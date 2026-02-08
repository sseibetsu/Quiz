const questions = [
  { id: 1, question: "Сотрудник случайно удалил базу данных. Какая это угроза?", options: ["Внешняя, преднамеренная", "Внутренняя, случайная", "Внешняя, случайная", "Техногенная"], correctIndex: 1 },
  { id: 2, question: "Какой тип атаки использует поддельные письма для кражи учётных данных?", options: ["DDoS-атака", "Фишинг", "SQL-инъекция", "Brute-force"], correctIndex: 1 },
  { id: 3, question: "Что является примером угрозы конфиденциальности?", options: ["Отказ сервера", "Перехват сетевого трафика", "Удаление файлов", "Сбой электропитания"], correctIndex: 1 },
  { id: 4, question: "Какой принцип ИБ нарушается при несанкционированном изменении данных?", options: ["Конфиденциальность", "Доступность", "Целостность", "Аутентичность"], correctIndex: 2 },
  { id: 5, question: "Что из перечисленного относится к организационным мерам защиты?", options: ["Установка антивируса", "Шифрование данных", "Разработка политики безопасности", "Настройка межсетевого экрана"], correctIndex: 2 }
];

let current = 0, score = 0;

function show(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const el = document.getElementById(id);
  el.classList.add('active');
  el.style.animation = 'none';
  el.offsetHeight;
  el.style.animation = 'fadeIn .5s ease';
}

// НОВАЯ ФУНКЦИЯ: Логин и старт
async function loginAndStart() {
  const nameInput = document.getElementById('username-input');
  const name = nameInput.value.trim();

  if (!name) {
    // Визуальная тряска если имя пустое
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
      startQuiz();
    } else {
      alert("Ошибка сервера. Попробуйте обновить страницу.");
      btn.disabled = false;
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
  show('quiz-screen');
  renderQuestion();
}

function renderQuestion() {
  const q = questions[current];
  document.getElementById('current-num').textContent = current + 1;
  const pct = ((current + 1) / questions.length) * 100;
  document.getElementById('progress-percent').textContent = Math.round(pct) + '%';
  document.getElementById('progress-fill').style.width = pct + '%';
  document.getElementById('question-text').textContent = q.question;
  const container = document.getElementById('options-container');
  container.innerHTML = '';
  q.options.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.innerHTML = `<span class="letter">${String.fromCharCode(65 + i)}</span><span>${opt}</span>`;
    btn.style.animation = `fadeIn .3s ease ${i * 0.07}s both`;
    btn.onclick = () => selectOption(i);
    container.appendChild(btn);
  });
}

function selectOption(index) {
  const q = questions[current];
  const btns = document.querySelectorAll('.option-btn');
  btns.forEach((btn, i) => {
    btn.disabled = true;
    if (i === q.correctIndex) btn.classList.add('option-correct');
    else if (i === index) btn.classList.add('option-wrong');
    else btn.classList.add('option-dimmed');
  });
  if (index === q.correctIndex) score++;

  setTimeout(() => {
    current++;
    if (current < questions.length) {
      renderQuestion();
    } else {
      submitAndShowResults(); // ИЗМЕНЕНО: Отправка результатов перед показом
    }
  }, 1500);
}

// НОВАЯ ФУНКЦИЯ: Отправка на сервер
async function submitAndShowResults() {
  try {
    await fetch('/api/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ score: score, max_score: questions.length })
    });
  } catch (e) {
    console.error("Ошибка сохранения результата", e);
  }
  showResults();
}

function showResults() {
  show('results-screen');
  const isHigh = score >= 4;
  const pct = Math.round((score / questions.length) * 100);
  const sv = document.getElementById('score-value');
  sv.textContent = score;
  sv.className = 'score-value ' + (isHigh ? 'score-high' : 'score-low');
  const iconBox = document.getElementById('result-icon-box');
  iconBox.className = 'icon-box glass-card ' + (isHigh ? 'success-glow' : 'error-glow');
  iconBox.innerHTML = isHigh
    ? '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="hsl(265,30%,75%)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/><path d="M12 3v12"/><path d="M5 21h14"/></svg>'
    : '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="hsl(0,65%,55%)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>';
  document.getElementById('feedback-text').textContent = isHigh ? "Отличный результат! Вы готовы к защите периметра." : "Есть над чем поработать. Повторите классификацию угроз.";
  const fill = document.getElementById('result-bar-fill');
  fill.style.width = '0';
  fill.style.background = isHigh ? 'var(--success)' : 'var(--destructive)';
  setTimeout(() => fill.style.width = pct + '%', 100);
  document.getElementById('result-percent').textContent = pct + '% верно';
}