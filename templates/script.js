let questions = []; // че, ответов теперь не видно, да?
let current = 0, score = 0;

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
      await startQuiz();
    } else {
      alert("Ошибка сервера при логине. Попробуйте обновить страницу.");
      btn.disabled = false;
      btn.textContent = "Начать →";
    }
  } catch (e) {
    console.error(e);
    alert("Нет соединения с сервером.");
    btn.disabled = false;
    btn.textContent = "Начать →";
  }
}

async function startQuiz() {
  try {
    const res = await fetch('/api/questions');
    if (!res.ok) {
      throw new Error("HTTP Error " + res.status);
    }
    questions = await res.json();
    current = 0;
    score = 0;
    show('quiz-screen');
    renderQuestion();
  } catch (e) {
    console.error("Не удалось загрузить вопросы", e);
    alert("Ошибка загрузки вопросов. Проверьте консоль сервера.");
    const btn = document.querySelector('.btn-primary');
    if (btn) {
      btn.disabled = false;
      btn.textContent = "Начать →";
    }
  }
}

function renderQuestion() {
  const q = questions[current];
  document.getElementById('current-num').textContent = current + 1;

  document.getElementById('total-num').textContent = questions.length;

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

async function selectOption(index) {
  const q = questions[current];
  const btns = document.querySelectorAll('.option-btn');

  // Блокируем кнопки, пока ждем ответ от сервера
  btns.forEach(btn => btn.disabled = true);

  try {
    const res = await fetch('/api/check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question_id: q.id, selected_index: index })
    });

    if (!res.ok) throw new Error("Server error " + res.status);

    const data = await res.json();

    // Сервер вернул правильный индекс ответа
    btns.forEach((btn, i) => {
      if (i === data.correctIndex) btn.classList.add('option-correct');
      else if (i === index) btn.classList.add('option-wrong');
      else btn.classList.add('option-dimmed');
    });

    if (data.correct) score++;

    setTimeout(() => {
      current++;
      if (current < questions.length) {
        renderQuestion();
      } else {
        submitAndShowResults();
      }
    }, 1500);
  } catch (e) {
    console.error("Ошибка проверки ответа", e);
    alert("Ошибка сети при проверке ответа.");
    btns.forEach(btn => btn.disabled = false);
  }
}

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

  // Рассчитываем процент правильных ответов (хорошо = от 80%)
  const percentage = (score / questions.length) * 100;
  const isHigh = percentage >= 80;

  const sv = document.getElementById('score-value');
  sv.textContent = score;
  document.querySelector('.score-total').textContent = ' / ' + questions.length;
  sv.className = 'score-value ' + (isHigh ? 'score-high' : 'score-low');

  const iconBox = document.getElementById('result-icon-box');
  iconBox.className = 'icon-box glass-card ' + (isHigh ? 'success-glow' : 'error-glow');

  iconBox.innerHTML = isHigh
    ? '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="hsl(155,55%,45%)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/><path d="M12 3v12"/><path d="M5 21h14"/></svg>'
    : '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="hsl(0,65%,55%)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>';

  document.getElementById('feedback-text').textContent = isHigh
    ? "Отличный результат! Вы превосходно усвоили материал лекции."
    : "Есть над чем поработать. Рекомендуется повторить классификацию угроз и методы защиты.";

  const fill = document.getElementById('result-bar-fill');
  fill.style.width = '0';
  fill.style.background = isHigh ? 'var(--success)' : 'var(--destructive)';
  setTimeout(() => fill.style.width = percentage + '%', 100);
  document.getElementById('result-percent').textContent = Math.round(percentage) + '% верно';
}