// --- БАЗА ВОПРОСОВ (30 штук) ---
// Типы: 0-14 (Норм), 15-19 (Сложные), 20-29 (Код)
const questions = [
  // === ТЕОРИЯ (НОРМАЛЬНЫЕ) ===
  { id: 1, q: "Какая составляющая «триады CIA» отвечает за то, что данные не были изменены?", opts: ["Конфиденциальность", "Целостность", "Доступность", "Аутентичность"], c: 1 },
  { id: 2, q: "Что из этого является биометрической аутентификацией?", opts: ["Пароль", "Смарт-карта", "Отпечаток пальца", "Одноразовый код из SMS"], c: 2 },
  { id: 3, q: "Как называется программа, которая шифрует файлы пользователя и требует выкуп?", opts: ["Spyware", "Ransomware", "Adware", "Rootkit"], c: 1 },
  { id: 4, q: "Что такое Phishing?", opts: ["Сетевая разведка", "Взлом Wi-Fi", "Поддельные письма для кражи данных", "Отказ в обслуживании"], c: 2 },
  { id: 5, q: "Какой протокол обеспечивает безопасную передачу данных в браузере?", opts: ["HTTP", "FTP", "HTTPS", "SMTP"], c: 2 },
  { id: 6, q: "Что такое «Социальная инженерия»?", opts: ["Взлом через ошибки в коде", "Манипуляция людьми для получения данных", "Атака на сервера баз данных", "Настройка фаервола"], c: 1 },
  { id: 7, q: "Пароль «123456» является слабым, потому что он уязвим к:", opts: ["SQL-инъекции", "Словарной атаке (Brute-force)", "XSS-атаке", "Man-in-the-middle"], c: 1 },
  { id: 8, q: "Какое устройство фильтрует трафик между сетями?", opts: ["Свитч", "Хаб", "Межсетевой экран (Firewall)", "Репитер"], c: 2 },
  { id: 9, q: "Что значит аббревиатура VPN?", opts: ["Very Private Network", "Virtual Public Network", "Virtual Private Network", "Verified Personal Node"], c: 2 },
  { id: 10, q: "Двухфакторная аутентификация (2FA) – это:", opts: ["Два пароля подряд", "Пароль + то, чем вы владеете (телефон/токен)", "Пароль + имя пользователя", "Два разных аккаунта"], c: 1 },
  { id: 11, q: "Какой порт по умолчанию использует SSH?", opts: ["80", "443", "22", "21"], c: 2 },
  { id: 12, q: "Атака, направленная на переполнение канала связи, чтобы сайт стал недоступен:", opts: ["DDoS", "Spoofing", "Sniffing", "Phishing"], c: 0 },
  { id: 13, q: "Какое действие НЕ поможет защититься от вирусов?", opts: ["Обновление ОС", "Использование антивируса", "Открытие всех вложений в почте", "Ограничение прав администратора"], c: 2 },
  { id: 14, q: "Как называется «люк» в программе, оставленный разработчиком для входа?", opts: ["Backdoor", "Frontdoor", "Sidechannel", "Exploit"], c: 0 },
  { id: 15, q: "Какая угроза исходит от обиженного уволенного сотрудника?", opts: ["Внешняя, случайная", "Внутренняя, преднамеренная", "Техногенная", "Внешняя, преднамеренная"], c: 1 },

  // === ТЕОРИЯ (СЛОЖНЫЕ) ===
  { id: 16, q: "Какой тип шифрования использует пару ключей (открытый и закрытый)?", opts: ["Симметричное", "Асимметричное", "Хеширование", "Стенография"], c: 1 },
  { id: 17, q: "Что такое «Zero-day» уязвимость?", opts: ["Уязвимость, которой 0 дней", "Уязвимость, для которой еще нет патча", "Уязвимость, которая не опасна", "Ошибка при установке Windows"], c: 1 },
  { id: 18, q: "Какую атаку предотвращает использование Prepared Statements (подготовленных запросов)?", opts: ["XSS", "SQL Injection", "CSRF", "DDoS"], c: 1 },
  { id: 19, q: "Что делает хеш-функция с паролем?", opts: ["Шифрует его с возможностью расшифровки", "Превращает в необратимую строку фиксированной длины", "Сжимает его для экономии места", "Передает его в открытом виде"], c: 1 },
  { id: 20, q: "Атака «Man-in-the-Middle» (MITM) возможна, если:", opts: ["Используется HTTPS с валидным сертификатом", "Злоумышленник контролирует канал связи (например, публичный Wi-Fi)", "Установлен надежный антивирус", "Пароль слишком длинный"], c: 1 },

  // === ПРАКТИКА (КОД) ===
  { id: 21, code: "SELECT * FROM users WHERE name = '" + "user_input" + "';", q: "Уязвимость в этом коде:", opts: ["XSS", "SQL Injection", "Buffer Overflow", "Race Condition"], c: 1 },
  { id: 22, code: "<script>alert(document.cookie)</script>", q: "Если этот текст попадет на страницу сайта, это пример:", opts: ["SQL Injection", "XSS (Stored/Reflected)", "CSRF", "Brute Force"], c: 1 },
  { id: 23, code: "if (password == 'admin123') { grant_access(); }", q: "В чем главная проблема этого кода?", opts: ["Использование == вместо ===", "Хардкод пароля в коде", "Функция grant_access устарела", "Нет проверки логина"], c: 1 },
  { id: 24, code: "chmod 777 sensitive_data.txt", q: "Что делает эта команда в Linux и почему это плохо?", opts: ["Дает полные права всем (чтение/запись/исполнение) – угроза безопасности", "Удаляет файл", "Шифрует файл", "Скрывает файл от пользователей"], c: 0 },
  { id: 25, code: "def check_pass(p): return p == 'secret'", q: "Как исправить хранение пароля?", opts: ["Использовать хеширование (bcrypt/argon2)", "Записать пароль в файл", "Использовать base64", "Сделать пароль сложнее"], c: 0 },
  { id: 26, code: "iptables -A INPUT -p tcp --dport 22 -j DROP", q: "Что делает это правило фаервола?", opts: ["Разрешает доступ к сайту", "Блокирует входящие SSH соединения", "Блокирует исходящую почту", "Открывает порт для игр"], c: 1 },
  { id: 27, code: "while(True): fork()", q: "Как называется этот тип атаки?", opts: ["Fork Bomb (DoS)", "Memory Leak", "Kernel Panic", "Buffer Overflow"], c: 0 },
  { id: 28, code: "int arr[5]; arr[10] = 3;", q: "К чему приведет этот код на C++?", opts: ["Синтаксическая ошибка", "Buffer Overflow (выход за границы массива)", "Утечка памяти", "Ничего страшного"], c: 1 },
  { id: 29, code: "User-Agent: () { :;}; /bin/bash -c ...", q: "Это сигнатура известной уязвимости:", opts: ["Heartbleed", "Shellshock", "EternalBlue", "Log4Shell"], c: 1 },
  { id: 30, code: "try { ... } catch (e) { print(e); }", q: "Почему вывод сырой ошибки (e) пользователю опасен?", opts: ["Это некрасиво", "Раскрывает детали архитектуры (пути, версии ПО)", "Замедляет работу сервера", "Забивает логи"], c: 1 }
];

let current = 0;
let score = 0;
let tabSwitches = 0;
let quizStarted = false;

// --- ЗАЩИТА ОТ ЧИТЕРСТВА ---

// 1. Блокировка контекстного меню
document.addEventListener('contextmenu', event => event.preventDefault());

// 2. Блокировка F12 и горячих клавиш
document.onkeydown = function (e) {
  if (e.key == 123) { // F12
    return false;
  }
  if (e.ctrlKey && e.shiftKey && e.key == 'I') { // Ctrl+Shift+I
    return false;
  }
  if (e.ctrlKey && e.shiftKey && e.key == 'J') { // Ctrl+Shift+J
    return false;
  }
  if (e.ctrlKey && e.key == 'U') { // Ctrl+U
    return false;
  }
};

// 3. Отслеживание ухода с вкладки
document.addEventListener("visibilitychange", () => {
  if (quizStarted && document.hidden) {
    tabSwitches++;
    document.title = `⚠️ Внимание! (${tabSwitches})`;
    // Можно добавить визуальное предупреждение
    // alert("Пожалуйста, не переключайтесь между вкладками!");
  } else if (quizStarted && !document.hidden) {
    document.title = "Квиз: ИБ";
  }
});

// --- ЛОГИКА ТЕСТА ---

function show(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const el = document.getElementById(id);
  el.classList.add('active');
  el.style.animation = 'none';
  el.offsetHeight;
  el.style.animation = 'fadeIn .5s ease';
}

async function loginAndStart() {
  const nameInput = document.getElementById('username-input');
  const name = nameInput.value.trim();

  if (!name) {
    nameInput.style.borderColor = 'var(--destructive)';
    setTimeout(() => nameInput.style.borderColor = 'var(--border)', 1000);
    return;
  }

  const btn = document.querySelector('.btn-primary');
  btn.disabled = true;
  btn.textContent = "Загрузка...";

  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name })
    });

    if (response.ok) {
      quizStarted = true; // Включаем трекинг
      startQuiz();
    } else {
      // Если сервер вернул 403 (уже сдавал)
      const data = await response.json();
      alert(data.detail || "Ошибка доступа");
      btn.disabled = false;
      btn.textContent = "Начать →";
    }
  } catch (e) {
    console.error(e);
    alert("Нет соединения с сервером.");
    btn.disabled = false;
  }
}

function startQuiz() {
  current = 0;
  score = 0;
  tabSwitches = 0; // Сброс
  show('quiz-screen');
  renderQuestion();
}

function renderQuestion() {
  const q = questions[current];
  document.getElementById('current-num').textContent = current + 1;
  const pct = ((current + 1) / questions.length) * 100;
  document.getElementById('progress-percent').textContent = Math.round(pct) + '%';
  document.getElementById('progress-fill').style.width = pct + '%';

  // Обработка текста вопроса
  const qText = document.getElementById('question-text');
  qText.innerHTML = q.q;

  // Если есть блок кода
  if (q.code) {
    qText.innerHTML += `<div class="code-block">${escapeHtml(q.code)}</div>`;
  }

  const container = document.getElementById('options-container');
  container.innerHTML = '';

  q.opts.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.innerHTML = `<span class="letter">${String.fromCharCode(65 + i)}</span><span>${escapeHtml(opt)}</span>`;
    btn.style.animation = `fadeIn .3s ease ${i * 0.05}s both`;
    btn.onclick = () => selectOption(i);
    container.appendChild(btn);
  });
}

function escapeHtml(text) {
  if (!text) return text;
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function selectOption(index) {
  const q = questions[current];
  const btns = document.querySelectorAll('.option-btn');

  btns.forEach((btn, i) => {
    btn.disabled = true;
    if (i === q.c) btn.classList.add('option-correct');
    else if (i === index) btn.classList.add('option-wrong');
    else btn.classList.add('option-dimmed');
  });

  if (index === q.c) score++;

  setTimeout(() => {
    current++;
    if (current < questions.length) {
      renderQuestion();
    } else {
      quizStarted = false; // Остановить трекинг
      submitAndShowResults();
    }
  }, 1200); // Чуть быстрее переход
}

async function submitAndShowResults() {
  try {
    await fetch('/api/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        score: score,
        max_score: questions.length,
        tab_switches: tabSwitches
      })
    });
  } catch (e) {
    console.error("Ошибка сохранения", e);
  }
  showResults();
}

function showResults() {
  show('results-screen');
  const isHigh = score >= (questions.length * 0.7); // 70% проходной
  const pct = Math.round((score / questions.length) * 100);

  const sv = document.getElementById('score-value');
  sv.textContent = score;
  sv.className = 'score-value ' + (isHigh ? 'score-high' : 'score-low');

  const iconBox = document.getElementById('result-icon-box');
  iconBox.className = 'icon-box glass-card ' + (isHigh ? 'success-glow' : 'error-glow');
  iconBox.innerHTML = isHigh
    ? '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="hsl(155,55%,45%)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/><path d="M12 3v12"/><path d="M5 21h14"/></svg>'
    : '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="hsl(0,65%,55%)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>';

  document.getElementById('feedback-text').innerHTML = `Вы ответили верно на ${pct}% вопросов.<br><br>Сворачиваний экрана: <b>${tabSwitches}</b>`;

  const fill = document.getElementById('result-bar-fill');
  fill.style.width = '0';
  fill.style.background = isHigh ? 'var(--success)' : 'var(--destructive)';
  setTimeout(() => fill.style.width = pct + '%', 100);
  document.getElementById('result-percent').textContent = pct + '% верно';

  // Убираем кнопку рестарта!
  const restartBtn = document.querySelector('#results-screen .btn-primary');
  if (restartBtn) restartBtn.style.display = 'none';
}