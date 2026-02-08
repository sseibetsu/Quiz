import sqlite3
import uuid
from datetime import datetime
from fastapi import FastAPI, Request, Response, HTTPException
from fastapi.responses import FileResponse, HTMLResponse
from pydantic import BaseModel
import os

app = FastAPI()

# Путь к папке templates
TEMPLATE_DIR = "templates"

# --- База данных ---


def init_db():
    conn = sqlite3.connect('quiz_results.db')
    c = conn.cursor()
    # Таблица пользователей (храним токен, имя, IP)
    c.execute('''CREATE TABLE IF NOT EXISTS users 
                 (token TEXT PRIMARY KEY, name TEXT, ip TEXT, created_at TEXT)''')
    # Таблица результатов
    c.execute('''CREATE TABLE IF NOT EXISTS results 
                 (id INTEGER PRIMARY KEY AUTOINCREMENT, token TEXT, score INTEGER, max_score INTEGER, timestamp TEXT)''')
    conn.commit()
    conn.close()


init_db()

# --- Модели данных для API ---


class UserLogin(BaseModel):
    name: str


class QuizResult(BaseModel):
    score: int
    max_score: int

# --- Роуты для отдачи файлов (так как все в одной папке) ---


@app.get("/", response_class=FileResponse)
async def read_root():
    return os.path.join(TEMPLATE_DIR, "index.html")


@app.get("/style.css", response_class=FileResponse)
async def get_css():
    return os.path.join(TEMPLATE_DIR, "style.css")


@app.get("/script.js", response_class=FileResponse)
async def get_js():
    return os.path.join(TEMPLATE_DIR, "script.js")

# --- API Логика ---


@app.post("/api/login")
async def login(user: UserLogin, request: Request, response: Response):
    # Проверяем, есть ли уже кука, если нет - создаем новую
    token = request.cookies.get("student_token")
    if not token:
        token = str(uuid.uuid4())

    client_ip = request.client.host

    conn = sqlite3.connect('quiz_results.db')
    c = conn.cursor()
    # Обновляем имя пользователя для этого токена
    c.execute("INSERT OR REPLACE INTO users (token, name, ip, created_at) VALUES (?, ?, ?, ?)",
              (token, user.name, client_ip, datetime.now().strftime("%Y-%m-%d %H:%M:%S")))
    conn.commit()
    conn.close()

    # Устанавливаем куку на 1 год
    response.set_cookie(key="student_token", value=token, max_age=31536000)
    return {"status": "ok", "token": token}


@app.post("/api/submit")
async def submit_result(result: QuizResult, request: Request):
    token = request.cookies.get("student_token")
    if not token:
        # Если куки нет, пытаемся сохранить анонимно (или можно вернуть ошибку)
        token = "anonymous_" + str(uuid.uuid4())

    conn = sqlite3.connect('quiz_results.db')
    c = conn.cursor()
    c.execute("INSERT INTO results (token, score, max_score, timestamp) VALUES (?, ?, ?, ?)",
              (token, result.score, result.max_score, datetime.now().strftime("%Y-%m-%d %H:%M:%S")))
    conn.commit()
    conn.close()
    return {"status": "saved"}

# --- Админка для тебя (Просмотр результатов) ---


@app.get("/teacher", response_class=HTMLResponse)
async def teacher_stats():
    conn = sqlite3.connect('quiz_results.db')
    c = conn.cursor()
    # Запрос: Имя, Результат, Максимум, Время
    c.execute('''
        SELECT u.name, r.score, r.max_score, r.timestamp, u.ip 
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
        <title>Результаты студентов</title>
        <meta charset="utf-8">
        <style>
            body { font-family: monospace; padding: 20px; background: #121212; color: #e0e0e0; }
            h1 { color: #bb86fc; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; box-shadow: 0 4px 8px rgba(0,0,0,0.5); }
            th, td { border: 1px solid #333; padding: 12px; text-align: left; }
            th { background: #1f1b24; color: #03dac6; }
            tr:nth-child(even) { background: #1a1a1a; }
            tr:hover { background: #2c2c2c; }
            .score { font-weight: bold; }
        </style>
    </head>
    <body>
        <h1>📊 Журнал результатов</h1>
        <table>
            <tr><th>Имя студента</th><th>Результат</th><th>Время сдачи</th><th>IP адрес</th></tr>
    """
    for row in rows:
        name = row[0] if row[0] else "Аноним"
        score_color = "#03dac6" if row[1] >= 4 else "#cf6679"
        html += f"<tr><td>{name}</td><td class='score' style='color:{score_color}'>{row[1]} / {row[2]}</td><td>{row[3]}</td><td>{row[4]}</td></tr>"
    html += "</table></body></html>"
    return html

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
