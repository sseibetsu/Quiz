import sqlite3
import uuid
from datetime import datetime
from fastapi import FastAPI, Request, Response, HTTPException
from fastapi.responses import FileResponse, HTMLResponse
from pydantic import BaseModel
import os

app = FastAPI()

TEMPLATE_DIR = "templates"


def init_db():
    conn = sqlite3.connect('quiz_results.db')
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS users 
                 (token TEXT PRIMARY KEY, name TEXT, ip TEXT, created_at TEXT)''')
    # Добавили поле tab_switches
    c.execute('''CREATE TABLE IF NOT EXISTS results 
                 (id INTEGER PRIMARY KEY AUTOINCREMENT, token TEXT, score INTEGER, max_score INTEGER, tab_switches INTEGER, timestamp TEXT)''')
    conn.commit()
    conn.close()


init_db()


class UserLogin(BaseModel):
    name: str


class QuizResult(BaseModel):
    score: int
    max_score: int
    tab_switches: int  # Новое поле

# --- Роуты файлов ---


@app.get("/", response_class=FileResponse)
async def read_root():
    return os.path.join(TEMPLATE_DIR, "index.html")


@app.get("/style.css", response_class=FileResponse)
async def get_css():
    return os.path.join(TEMPLATE_DIR, "style.css")


@app.get("/script.js", response_class=FileResponse)
async def get_js():
    return os.path.join(TEMPLATE_DIR, "script.js")

# --- API ---


@app.post("/api/login")
async def login(user: UserLogin, request: Request, response: Response):
    token = request.cookies.get("student_token")

    # Проверка: сдавал ли уже?
    if token:
        conn = sqlite3.connect('quiz_results.db')
        c = conn.cursor()
        c.execute("SELECT id FROM results WHERE token = ?", (token,))
        exists = c.fetchone()
        conn.close()
        if exists:
            # Если результат есть, возвращаем спец. статус
            return JSONResponse(status_code=403, content={"detail": "Вы уже сдали тест. Повторная попытка запрещена."})

    if not token:
        token = str(uuid.uuid4())

    client_ip = request.client.host

    conn = sqlite3.connect('quiz_results.db')
    c = conn.cursor()
    c.execute("INSERT OR REPLACE INTO users (token, name, ip, created_at) VALUES (?, ?, ?, ?)",
              (token, user.name, client_ip, datetime.now().strftime("%Y-%m-%d %H:%M:%S")))
    conn.commit()
    conn.close()

    response.set_cookie(key="student_token", value=token, max_age=31536000)
    return {"status": "ok", "token": token}


@app.post("/api/submit")
async def submit_result(result: QuizResult, request: Request):
    token = request.cookies.get("student_token")
    if not token:
        token = "anonymous_" + str(uuid.uuid4())

    conn = sqlite3.connect('quiz_results.db')
    c = conn.cursor()

    # Проверка на повтор
    c.execute("SELECT id FROM results WHERE token = ?", (token,))
    if c.fetchone():
        conn.close()
        return {"status": "already_submitted"}

    c.execute("INSERT INTO results (token, score, max_score, tab_switches, timestamp) VALUES (?, ?, ?, ?, ?)",
              (token, result.score, result.max_score, result.tab_switches, datetime.now().strftime("%Y-%m-%d %H:%M:%S")))
    conn.commit()
    conn.close()
    return {"status": "saved"}


@app.get("/teacher", response_class=HTMLResponse)
async def teacher_stats():
    conn = sqlite3.connect('quiz_results.db')
    c = conn.cursor()
    # Добавили вывод Alt+Tab
    c.execute('''
        SELECT u.name, r.score, r.max_score, r.tab_switches, r.timestamp 
        FROM results r 
        LEFT JOIN users u ON r.token = u.token 
        ORDER BY r.timestamp DESC
    ''')
    rows = c.fetchall()
    conn.close()

    html = """
    <!DOCTYPE html>
    <html>
    <head>
        <title>Журнал преподавателя</title>
        <meta charset="utf-8">
        <style>
            body { font-family: monospace; padding: 20px; background: #121212; color: #e0e0e0; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #333; padding: 12px; text-align: left; }
            th { background: #1f1b24; color: #03dac6; }
            tr:nth-child(even) { background: #1a1a1a; }
            .warn { color: #ffb74d; font-weight: bold; }
            .danger { color: #cf6679; font-weight: bold; }
        </style>
    </head>
    <body>
        <h1>Результаты практики</h1>
        <table>
            <tr><th>Студент</th><th>Баллы</th><th>Alt+Tab (раз)</th><th>Время</th></tr>
    """
    for row in rows:
        name = row[0] if row[0] else "Аноним"
        switches = row[3]
        switch_style = ""
        if switches > 0:
            switch_style = "warn"
        if switches > 5:
            switch_style = "danger"

        html += f"<tr><td>{name}</td><td>{row[1]} / {row[2]}</td><td class='{switch_style}'>{switches}</td><td>{row[4]}</td></tr>"
    html += "</table></body></html>"
    return html

if __name__ == "__main__":
    import uvicorn
    # Импорт JSONResponse нужен был выше, добавим
    from fastapi.responses import JSONResponse
    uvicorn.run(app, host="0.0.0.0", port=8000)
