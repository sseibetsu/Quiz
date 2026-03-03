import sqlite3
import random
import uuid
from datetime import datetime
from fastapi import FastAPI, Request, Response, HTTPException
from fastapi.responses import FileResponse, HTMLResponse
from pydantic import BaseModel
import os
from typing import Dict, Any

app = FastAPI()
TEMPLATE_DIR = "templates"

active_sessions: Dict[str, Dict[str, Any]] = {}


def init_db():
    conn = sqlite3.connect('quiz_results.db')
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS users 
                 (token TEXT PRIMARY KEY, name TEXT, ip TEXT, created_at TEXT)''')
    c.execute('''CREATE TABLE IF NOT EXISTS results 
                 (id INTEGER PRIMARY KEY AUTOINCREMENT, token TEXT, score INTEGER, max_score INTEGER, timestamp TEXT)''')
    conn.commit()
    conn.close()


init_db()


class UserLogin(BaseModel):
    name: str


class AnswerCheck(BaseModel):
    question_id: int
    selected_index: int


class ViolationData(BaseModel):
    type: str


class MessageSend(BaseModel):
    token: str
    text: str


# questions
QUESTIONS = [
    {
        "id": 1,
        "question": "1",
        "options": ["...", "...", "...", "..."],
        "correctIndex": 0
    },
    {
        "id": 2,
        "question": "2",
        "options": ["...", "...", "...", "..."],
        "correctIndex": 0
    },
    {
        "id": 3,
        "question": "3",
        "options": ["...", "...", "...", "..."],
        "correctIndex": 0
    },
    {
        "id": 4,
        "question": "4",
        "options": ["...", "...", "...", "..."],
        "correctIndex": 0
    },
    {
        "id": 5,
        "question": "5",
        "options": ["...", "...", "...", "..."],
        "correctIndex": 0
    },
    {
        "id": 6,
        "question": "6",
        "options": ["...", "...", "...", "..."],
        "correctIndex": 0
    },
    {
        "id": 7,
        "question": "7",
        "options": ["...", "...", "...", "..."],
        "correctIndex": 0
    },
    {
        "id": 8,
        "question": "8",
        "options": ["...", "...", "...", "..."],
        "correctIndex": 0
    },
    {
        "id": 9,
        "question": "9",
        "options": ["...", "...", "...", "..."],
        "correctIndex": 0
    },
    {
        "id": 10,
        "question": "10",
        "options": ["...", "...", "...", "..."],
        "correctIndex": 0
    }
]


@app.get("/", response_class=FileResponse)
async def read_root():
    return os.path.join(TEMPLATE_DIR, "index.html")


@app.get("/style.css", response_class=FileResponse)
async def get_css():
    return os.path.join(TEMPLATE_DIR, "style.css")


@app.get("/script.js", response_class=FileResponse)
async def get_js():
    return os.path.join(TEMPLATE_DIR, "script.js")


@app.post("/api/login")
async def login(user: UserLogin, request: Request, response: Response):
    token = request.cookies.get("student_token")
    client_ip = request.client.host

    conn = sqlite3.connect('quiz_results.db')
    c = conn.cursor()

    if token:
        c.execute("SELECT score FROM results WHERE token = ?", (token,))
        if c.fetchone():
            conn.close()
            return {"status": "error", "message": "Вы уже сдали этот тест. Повторное прохождение и смена имени запрещены."}

    if not token:
        token = str(uuid.uuid4())
        response.set_cookie(key="student_token", value=token,
                            max_age=31536000, httponly=True)

    c.execute("INSERT OR IGNORE INTO users (token, name, ip, created_at) VALUES (?, ?, ?, ?)",
              (token, user.name, client_ip, datetime.now().strftime("%Y-%m-%d %H:%M:%S")))
    conn.commit()
    conn.close()

    question_ids = [q["id"] for q in QUESTIONS]
    random.shuffle(question_ids)

    active_sessions[token] = {
        "name": user.name,
        "ip": client_ip,
        "current_question": 0,
        "score": 0,
        "violations": 0,
        "last_violation": "Нет",
        "status": "В процессе",
        "message": None,
        "question_order": question_ids
    }

    return {"status": "ok", "token": token, "total_questions": len(QUESTIONS)}


@app.get("/api/question/{index}")
async def get_question(index: int, request: Request):
    token = request.cookies.get("student_token")

    if not token or token not in active_sessions:
        raise HTTPException(
            status_code=403, detail="Сессия не найдена. Обновите страницу и войдите заново.")

    session = active_sessions[token]

    if index < 0 or index >= len(session["question_order"]):
        raise HTTPException(status_code=404, detail="Вопрос не найден")

    real_q_id = session["question_order"][index]

    if token in active_sessions:
        active_sessions[token]["current_question"] = index + 1

    q = next((q for q in QUESTIONS if q["id"] == real_q_id), None)
    return {"id": q["id"], "question": q["question"], "options": q["options"]}


@app.post("/api/check")
async def check_answer(answer: AnswerCheck, request: Request):
    token = request.cookies.get("student_token")
    question = next(
        (q for q in QUESTIONS if q["id"] == answer.question_id), None)

    if not question:
        raise HTTPException(status_code=404, detail="Вопрос не найден")

    is_correct = question["correctIndex"] == answer.selected_index

    if is_correct and token in active_sessions:
        active_sessions[token]["score"] += 1

    return {"correct": is_correct, "correctIndex": question["correctIndex"]}


@app.post("/api/violation")
async def log_violation(data: ViolationData, request: Request):
    token = request.cookies.get("student_token")
    if token in active_sessions:
        active_sessions[token]["violations"] += 1

        time_str = datetime.now().strftime("%H:%M:%S")
        if data.type == "blur":
            v_name = "Свернул окно (Alt-Tab)"
        elif data.type == "mouseleave":
            v_name = "Увел мышку за окно"
        elif data.type == "hotkey":
            v_name = "Нажал F12 / Ctrl+C"
        else:
            v_name = "Подозрительное действие"

        active_sessions[token]["last_violation"] = f"{v_name} в {time_str}"

    return {"status": "ok"}


@app.post("/api/submit")
async def submit_result(request: Request):
    token = request.cookies.get("student_token")
    if not token or token not in active_sessions:
        raise HTTPException(status_code=400, detail="Сессия не найдена")

    session = active_sessions[token]
    score = session["score"]
    max_score = len(QUESTIONS)

    conn = sqlite3.connect('quiz_results.db')
    c = conn.cursor()
    c.execute("INSERT INTO results (token, score, max_score, timestamp) VALUES (?, ?, ?, ?)",
              (token, score, max_score, datetime.now().strftime("%Y-%m-%d %H:%M:%S")))
    conn.commit()
    conn.close()

    session["status"] = "Завершен"
    return {"status": "saved", "score": score, "max_score": max_score}


@app.get("/api/info")
async def get_quiz_info():
    return {"total_questions": len(QUESTIONS)}


@app.post("/api/send_message")
async def send_message_to_student(msg: MessageSend):
    if msg.token in active_sessions:
        active_sessions[msg.token]["message"] = msg.text
        return {"status": "ok"}
    raise HTTPException(status_code=404, detail="Сессия не найдена")


@app.get("/api/get_message")
async def get_message_for_student(request: Request):
    token = request.cookies.get("student_token")
    if token and token in active_sessions:
        msg = active_sessions[token].get("message")
        if msg:
            active_sessions[token]["message"] = None
            return {"message": msg}
    return {"message": None}


@app.get("/teacher", response_class=HTMLResponse)
async def teacher_stats():
    conn = sqlite3.connect('quiz_results.db')
    c = conn.cursor()
    c.execute('''
        SELECT u.name, r.score, r.max_score, r.timestamp, u.ip, r.token 
        FROM results r 
        LEFT JOIN users u ON r.token = u.token 
        ORDER BY r.timestamp DESC
    ''')
    finished_rows = c.fetchall()
    conn.close()

    html = """
    <!DOCTYPE html>
    <html>
    <head>
        <title>Панель преподавателя</title>
        <meta charset="utf-8">
        <style>
            body { font-family: monospace; padding: 20px; background: #121212; color: #e0e0e0; }
            h1, h2 { color: #bb86fc; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 40px; }
            th, td { border: 1px solid #333; padding: 12px; text-align: left; }
            th { background: #1f1b24; color: #03dac6; }
            tr:nth-child(even) { background: #1a1a1a; }
            .danger { color: #ff5555; font-weight: bold; }
            button { background: #bb86fc; color: #121212; border: none; padding: 5px 10px; cursor: pointer; font-weight: bold; }
            button:hover { background: #9965f4; }
        </style>
        <script>
            // Умная перезагрузка каждые 3 секунды
            let refreshTimer = setTimeout(() => location.reload(), 3000);

            async function sendMessage(token, name) {
                clearTimeout(refreshTimer); // Останавливаем обновление страницы пока пишем текст
                let msg = prompt("Введите сообщение для студента " + name + ":");
                if (msg) {
                    await fetch('/api/send_message', {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({token: token, text: msg})
                    });
                }
                location.reload(); // Возобновляем работу после отправки
            }
        </script>
    </head>
    <body>
        <h1>В реальном времени (пишут сейчас)</h1>
        <table>
            <tr><th>Студент</th><th>IP</th><th>Вопрос</th><th>Алерты (Alt-Tab/F12)</th><th>Статус</th><th>Связь</th></tr>
    """
    for token, data in active_sessions.items():
        if data["status"] == "В процессе":
            viol_class = "danger" if data["violations"] > 0 else ""
            html += f"<tr><td>{data['name']}</td><td>{data['ip']}</td><td>{data['current_question']} / {len(QUESTIONS)}</td><td class='{viol_class}'>{data['violations']}</td><td style='color: #ffb86c; font-size: 0.9em;'>{data.get('last_violation', 'Нет')}</td><td>{data['status']}</td><td><button onclick=\"sendMessage('{token}', '{data['name']}')\">Написать</button></td></tr>"

    html += """
        </table>
        <h2>Завершенные работы</h2>
        <table>
            <tr><th>Имя</th><th>Результат</th><th>Алерты</th><th>Время сдачи</th><th>IP адрес</th></tr>
    """
    for row in finished_rows:
        name = row[0] if row[0] else "Аноним"
        violations = active_sessions.get(row[5], {}).get("violations", "0")
        viol_class = "danger" if str(violations) != "0" else ""
        percentage = (row[1] / row[2]) * 100 if row[2] > 0 else 0
        score_color = "#03dac6" if percentage >= 80 else "#cf6679"

        html += f"<tr><td>{name}</td><td style='color:{score_color}; font-weight:bold'>{row[1]} / {row[2]}</td><td class='{viol_class}'>{violations}</td><td>{row[3]}</td><td>{row[4]}</td></tr>"

    html += "</table></body></html>"
    return html

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
