const questions = [
  // === ЛЕГКИЕ И СРЕДНИЕ (Определения и База) ===
  {
    id: 1,
    q: "Что такое «угроза» согласно презентации?",
    opts: ["Дыра или слабое место в системе", "Фактор, стремящийся нарушить работу системы", "Реализованная атака на систему", "Последствие взлома"],
    c: 1
  }, // Слайд 17
  {
    id: 2,
    q: "Как называется «дыра» или слабое место в системе?",
    opts: ["Угроза", "Атака", "Уязвимость", "Риск"],
    c: 2
  }, // Слайд 25
  {
    id: 3,
    q: "Защита информации защищает от потери:",
    opts: ["Только денег", "Только репутации", "Денег, репутации и нервов", "Только данных клиентов"],
    c: 2
  }, // Слайд 6-9
  {
    id: 4,
    q: "Какие три свойства составляют базовую триаду информационной безопасности?",
    opts: ["Конфиденциальность, Целостность, Доступность", "Анонимность, Доступность, Скорость", "Целостность, Скрытность, Пароль", "Надежность, Отказоустойчивость, Бэкап"],
    c: 0
  }, // Слайд 58-61
  {
    id: 5,
    q: "Что подразумевается под нарушением «Конфиденциальности»?",
    opts: ["Блокировка ресурса", "Несанкционированное изменение данных", "Информация становится известной неуполномоченному лицу", "Утеря физического носителя"],
    c: 2
  }, // Слайд 64
  {
    id: 6,
    q: "Что подразумевается под нарушением «Целостности»?",
    opts: ["Утечка данных", "Несанкционированное изменение данных", "Блокировка доступа к сайту", "Разведка параметров системы"],
    c: 1
  }, // Слайд 65
  {
    id: 7,
    q: "Какой четвертый вид угрозы выделяется для защищенных систем (помимо классической триады)?",
    opts: ["Социальная инженерия", "Раскрытие параметров (разведка)", "Физическое уничтожение", "Отключение электричества"],
    c: 1
  }, // Слайд 68
  {
    id: 8,
    q: "К какому классу угроз по природе возникновения относится «молния, сжегшая сервер»?",
    opts: ["Искусственная", "Естественная", "Внутренняя", "Логическая"],
    c: 1
  }, // Слайд 80-82
  {
    id: 9,
    q: "Сотрудник случайно удалил важный файл. Какая это угроза по степени преднамеренности?",
    opts: ["Преднамеренная", "Случайная", "Внешняя", "Пассивная"],
    c: 1
  }, // Слайд 84-86
  {
    id: 10,
    q: "Кто такой «Злоумышленник» согласно презентации?",
    opts: ["Любой нарушитель", "Нарушитель, действующий случайно", "Нарушитель, намеренно идущий на нарушение из корысти", "Хакер из внешней сети"],
    c: 2
  }, // Слайд 41
  {
    id: 11,
    q: "Где находится источник «Внутренней» угрозы?",
    opts: ["В пределах контролируемой зоны", "В сети Интернет", "За пределами офиса", "В облачном хранилище"],
    c: 0
  }, // Слайд 95
  {
    id: 12,
    q: "Какая угроза считается «Пассивной»?",
    opts: ["Внесение изменений в базу данных", "Блокировка работы сервера", "Подслушивание трафика (без изменений)", "Удаление файлов"],
    c: 2
  }, // Слайд 107
  {
    id: 13,
    q: "Что такое «Атака»?",
    opts: ["Потенциальная опасность", "Слабое место системы", "Реализованная угроза", "Способ защиты"],
    c: 2
  }, // Слайд 27
  {
    id: 14,
    q: "К какому типу нарушителей относится «уборщик» или «электрик»?",
    opts: ["Внешний нарушитель", "Внутренний нарушитель", "Злоумышленник", "Случайный прохожий"],
    c: 1
  }, // Слайд 53
  {
    id: 15,
    q: "Почему, согласно презентации, нельзя составить полный перечень всех угроз?",
    opts: ["Лень писать", "Системы слишком простые", "Технологии развиваются быстрее, чем закрываются дыры", "Угроз всего три, список полон"],
    c: 2
  }, // Слайд 33-34

  // === СЛОЖНЫЕ И СПЕЦИФИЧЕСКИЕ (Модели и Формулы) ===
  {
    id: 16,
    q: "Что такое «Разведка» (четвертая угроза)?",
    opts: ["Прямой ущерб оборудованию", "Опосредованная угроза, дающая возможность для прямых атак", "Блокировка доступа", "Изменение данных"],
    c: 1
  }, // Слайд 74
  {
    id: 17,
    q: "Какая модель защиты изображена как «одно кольцо вокруг предмета защиты»?",
    opts: ["Многозвенная защита", "Многоуровневая защита", "Однозвенная защита", "Круговая оборона"],
    c: 2
  }, // Слайд 129
  {
    id: 18,
    q: "В формуле оценки уязвимости Рн + Рп = 1. Что такое Рн?",
    opts: ["Вероятность взлома", "Вероятность непреодоления защиты", "Вероятность обхода", "Вероятность ошибки"],
    c: 1
  }, // Слайд 125
  {
    id: 19,
    q: "В формуле Рн + Рп = 1. Что такое Рп?",
    opts: ["Вероятность непреодоления защиты", "Вероятность преодоления преграды напрямую (взлом)", "Вероятность обхода защиты", "Радиус поражения"],
    c: 1
  }, // Слайд 126
  {
    id: 20,
    q: "Если у преграды есть пути обхода, то прочность защиты Рн для одного нарушителя определяется как:",
    opts: ["Сумма всех вероятностей", "Максимум из вероятностей (max)", "Минимум из вероятностей (min)", "Среднее арифметическое"],
    c: 2
  }
];

let current = 0;
let score = 0;
let tabSwitches = 0;
let quizStarted = false;


document.addEventListener('contextmenu', event => event.preventDefault());

// 1. Блокировка F12 и горячих клавиш
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

// 2. Отслеживание ухода с вкладки
function handleLossOfFocus() {
  if (quizStarted) {
    tabSwitches++;
    document.title = `⚠️ Внимание! (${tabSwitches})`;
    document.body.style.backgroundColor = "#3a0000";
    setTimeout(() => document.body.style.backgroundColor = "", 500);
  }
}

function handleGainFocus() {
  if (quizStarted) {
    document.title = "Квиз: ИБ";
  }
}

// Срабатывает при Alt+Tab, сворачивании браузера, переключении вкладки или клике в другое окно
window.addEventListener("blur", handleLossOfFocus);
window.addEventListener("focus", handleGainFocus);
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    handleLossOfFocus();
  } else {
    handleGainFocus();
  }
});


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
  setInterval(() => {
    const start = performance.now();
    debugger; // Останавливает выполнение кода, если консоль открыта
    const end = performance.now();
    if (end - start > 100) {
      alert("Закройте панель разработчика, чтобы продолжить!");
    }
  }, 1000);
  current = 0;
  score = 0;
  tabSwitches = 0;
  show('quiz-screen');
  renderQuestion();
}

function renderQuestion() {
  const q = questions[current];
  document.getElementById('current-num').textContent = current + 1;
  const pct = ((current + 1) / questions.length) * 100;
  document.getElementById('progress-percent').textContent = Math.round(pct) + '%';
  document.getElementById('progress-fill').style.width = pct + '%';
  const qText = document.getElementById('question-text');
  qText.innerHTML = q.q;

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
      quizStarted = false;
      submitAndShowResults();
    }
  }, 1200);
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
  const isHigh = score >= (questions.length * 0.7);
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

  const restartBtn = document.querySelector('#results-screen .btn-primary');
  if (restartBtn) restartBtn.style.display = 'none';
}

function initCounters() {
  const total = questions.length;

  const idsToUpdate = [
    'total-count-subtitle',
    'total-count-meta',
    'total-count-quiz',
    'total-count-result'
  ];

  idsToUpdate.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = total;
  });
}

document.addEventListener('DOMContentLoaded', initCounters);
initCounters();