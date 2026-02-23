import sqlite3
import uuid
from datetime import datetime
from fastapi import FastAPI, Request, Response, HTTPException
from fastapi.responses import FileResponse, HTMLResponse
from pydantic import BaseModel
import os
from typing import List

app = FastAPI()

TEMPLATE_DIR = "templates"


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


class QuizResult(BaseModel):
    score: int
    max_score: int


class AnswerCheck(BaseModel):
    question_id: int
    selected_index: int


QUESTIONS = [
    {
        "id": 1,
        "question": "В чем заключается основное отличие троянской программы от вируса?",
        "options": ["Способность автономно распространяться по сети", "Маскировка под легитимное ПО и отсутствие способности к самокопированию", "Обязательное шифрование файлов пользователя", "Внедрение своего кода в загрузочный сектор"],
        "correctIndex": 1
    },
    {
        "id": 2,
        "question": "Каков принцип действия программ-вымогателей (Ransomware)?",
        "options": ["Скрытый сбор данных и телеметрии", "Перехват вводимых реквизитов в браузере", "Ограничение доступа к данным путём шифрования с требованием выкупа", "Удаленный доступ и управление системой"],
        "correctIndex": 2
    },
    {
        "id": 3,
        "question": "К какой категории вредоносного ПО относятся кейлоггеры и трекеры?",
        "options": ["Вирусы", "Spyware (Шпионские программы)", "Ransomware", "Руткиты"],
        "correctIndex": 1
    },
    {
        "id": 4,
        "question": "Что означает концепция Defense in Depth (Многоуровневая защита)?",
        "options": ["Комбинирование технических, организационных и процедурных мер", "Использование только проактивных методов", "Изоляция компьютера от интернета", "Использование нескольких антивирусов одновременно"],
        "correctIndex": 0
    },
    {
        "id": 5,
        "question": "В чем главный недостаток сигнатурного анализа?",
        "options": ["Высокая нагрузка на процессор", "Неэффективен против ранее неизвестных (0-day) угроз", "Сложность в настройке", "Высокое число ложных срабатываний"],
        "correctIndex": 1
    },
    {
        "id": 6,
        "question": "Какое правило рекомендуется использовать для хранения резервных копий (бэкапов)?",
        "options": ["Правило 1-2-3", "Правило 3-2-1", "Правило 5-4-1", "Правило 2-2-2"],
        "correctIndex": 1
    },
    {
        "id": 7,
        "question": "Какую уязвимость эксплуатировал известный вирус-шифровальщик WannaCry?",
        "options": ["Уязвимость RDP", "Уязвимость SQL-инъекции", "Уязвимость SMB", "Уязвимость нулевого дня в браузерах"],
        "correctIndex": 2
    },
    {
        "id": 8,
        "question": "Что означает 'двойное вымогательство' при атаке Ransomware?",
        "options": ["Требование выкупа дважды на разные кошельки", "Шифрование данных и угроза публикации похищенной информации", "Блокировка системы и заражение локальной сети", "Удаление бэкапов и шифрование диска"],
        "correctIndex": 1
    },
    {
        "id": 9,
        "question": "Какой механизм работы характерен для банковских троянов (Banking trojan)?",
        "options": ["Удаление антивируса", "Саморазмножение по сети", "Инжекции в браузер и перехват вводимых реквизитов", "Шифрование базы данных"],
        "correctIndex": 2
    },
    {
        "id": 10,
        "question": "Что из перечисленного относится к базовым организационным мерам защиты?",
        "options": ["Установка межсетевого экрана (Firewall)", "Внедрение строгой политики паролей", "Использование песочниц (Sandboxing)", "Поведенческий мониторинг"],
        "correctIndex": 1
    },
    {
        "id": 11,
        "question": "Какая задача у компонента 'Карантин' в современном антивирусе?",
        "options": ["Фильтрация входящего трафика", "Сканирование процессов в памяти", "Изоляция и анализ подозрительных объектов", "Блокировка фишинговых ссылок"],
        "correctIndex": 2
    },
    {
        "id": 12,
        "question": "Как в основном распространяются сетевые черви?",
        "options": ["Через пиратские диски", "Требуют активного участия пользователя", "Автономно по уязвимым сервисам сети", "Только через зараженные USB-накопители"],
        "correctIndex": 2
    },
    {
        "id": 13,
        "question": "Что отслеживает эвристический анализ в антивирусных решениях?",
        "options": ["Отклонения в исполнении программ (необычные вызовы API, сеть)", "Совпадение хэшей файлов с базой данных", "Тексты входящих писем", "Наличие сложных паролей у пользователей"],
        "correctIndex": 0
    },
    {
        "id": 14,
        "question": "Какова основная функция трояна типа Downloader?",
        "options": ["Постоянный удаленный доступ", "Скачивание и установка вторичных полезных нагрузок", "Извлечение метаданных", "Сбор коммерческих секретов"],
        "correctIndex": 1
    },
    {
        "id": 15,
        "question": "Каким должно быть первое действие при подозрении на заражение узла?",
        "options": ["Запуск полного сканирования системы", "Немедленная изоляция пострадавшего узла от сети", "Попытка удалить вирус вручную", "Выключение питания из розетки"],
        "correctIndex": 1
    },

    {
        "id": 16,
        "question": "Какие методы часто применяют шпионские программы (Spyware) для глубокой маскировки?",
        "options": ["Отключение брандмауэра Windows", "Маскировка под процессы антивируса", "Использование руткитов и шифрование каналов связи с C2", "Полиморфизм и метаморфизм кода"],
        "correctIndex": 2
    },
    {
        "id": 17,
        "question": "В чем заключается принципиальное отличие EDR-решений от классических антивирусов?",
        "options": ["EDR работает без подключения к интернету", "EDR использует только сигнатурный анализ", "Фокус на поведенческом анализе, контекстной телеметрии и средствах расследования", "EDR не требует обновлений"],
        "correctIndex": 2
    },
    {
        "id": 18,
        "question": "Какая криптографическая схема обычно используется современным Ransomware для обеспечения надежной блокировки?",
        "options": ["Только симметричное шифрование", "Комбинация симметричных и асимметричных ключей", "Стеганография", "Исключительно хэширование файлов (MD5, SHA-256)"],
        "correctIndex": 1
    },
    {
        "id": 19,
        "question": "Что из нижеперечисленного НЕ относится к техническим мерам защиты?",
        "options": ["Patch Management", "Sandboxing вложений", "Принцип наименьших привилегий", "SPF/DKIM/DMARC"],
        "correctIndex": 2
    },
    {
        "id": 20,
        "question": "Каков классический вектор многослойной современной атаки согласно лекции?",
        "options": ["Spyware -> Virus -> Rootkit", "Trojan -> Spyware -> Ransomware", "Worm -> Downloader -> Trojan", "Phishing -> DDoS -> Ransomware"],
        "correctIndex": 1
    },
    {
        "id": 21,
        "question": "Какая деструктивная особенность отличала атаку NotPetya от классического Ransomware?",
        "options": ["Маскировка под шифровальщик с целью необратимого саботажа инфраструктуры", "Заражение исключительно домашних ПК", "Отказ от использования уязвимости SMB", "Требование выкупа в фиатной валюте"],
        "correctIndex": 0
    },
    {
        "id": 22,
        "question": "Какие технологии входят в современную техническую защиту электронной почты?",
        "options": ["IPsec и VPN", "SPF/DKIM/DMARC, Sandboxing и URL-rewriting", "IDS и IPS сигнатуры", "Только локальный спам-фильтр в почтовом клиенте"],
        "correctIndex": 1
    },
    {
        "id": 23,
        "question": "Что регламентирует цифра '1' в правиле бэкапов 3-2-1?",
        "options": ["Необходимо иметь один полный бэкап сервера", "Одна копия должна быть недоступна по сети (оффлайн)", "Проверка бэкапа должна проводиться раз в 1 месяц", "Требуется хотя бы один облачный провайдер"],
        "correctIndex": 1
    },
    {
        "id": 24,
        "question": "Какие процессы относятся исключительно к реактивному подходу в информационной безопасности?",
        "options": ["Патч-менеджмент и оценка уязвимостей", "Обучение персонала и харденинг", "Мониторинг, расследование инцидентов и восстановление из резервных копий", "Ограничение привилегий и сегментация сети"],
        "correctIndex": 2
    },
    {
        "id": 25,
        "question": "Какова основная задача машинного обучения в рамках продвинутого обнаружения угроз?",
        "options": ["Обновление сигнатурных баз", "Генерация отчетов для руководства", "Построение базовой модели поведения и поиск аномалий в телеметрии", "Шифрование исходящего трафика"],
        "correctIndex": 2
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


@app.get("/api/questions")
async def get_questions():
    safe_questions = [
        {"id": q["id"], "question": q["question"], "options": q["options"]}
        for q in QUESTIONS
    ]
    return safe_questions


@app.post("/api/check")
async def check_answer(answer: AnswerCheck):
    question = next(
        (q for q in QUESTIONS if q["id"] == answer.question_id), None)
    if not question:
        raise HTTPException(status_code=404, detail="Вопрос не найден")

    is_correct = question["correctIndex"] == answer.selected_index
    return {
        "correct": is_correct,
        "correctIndex": question["correctIndex"]
    }


@app.post("/api/submit")
async def submit_result(result: QuizResult, request: Request):
    token = request.cookies.get("student_token")
    if not token:
        token = "anonymous_" + str(uuid.uuid4())

    conn = sqlite3.connect('quiz_results.db')
    c = conn.cursor()
    c.execute("INSERT INTO results (token, score, max_score, timestamp) VALUES (?, ?, ?, ?)",
              (token, result.score, result.max_score, datetime.now().strftime("%Y-%m-%d %H:%M:%S")))
    conn.commit()
    conn.close()
    return {"status": "saved"}


@app.get("/teacher", response_class=HTMLResponse)
async def teacher_stats():
    conn = sqlite3.connect('quiz_results.db')
    c = conn.cursor()
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
        <h1>Журнал результатов</h1>
        <table>
            <tr><th>Имя студента</th><th>Результат</th><th>Время сдачи</th><th>IP адрес</th></tr>
    """
    for row in rows:
        name = row[0] if row[0] else "Аноним"

        score = row[1]
        max_score = row[2]
        percentage = (score / max_score) * 100 if max_score > 0 else 0
        score_color = "#03dac6" if percentage >= 80 else "#cf6679"

        html += f"<tr><td>{name}</td><td class='score' style='color:{score_color}'>{score} / {max_score}</td><td>{row[3]}</td><td>{row[4]}</td></tr>"
    html += "</table></body></html>"
    return html

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
