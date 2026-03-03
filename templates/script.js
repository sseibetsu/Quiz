let current = 0;
let totalQuestions = 30;
let messageInterval;

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await fetch("/api/info");
    const data = await res.json();
    totalQuestions = data.total_questions;

    document.querySelector('.text-lavender').textContent = totalQuestions + " вопросов";
    document.querySelectorAll('.meta-item')[0].innerHTML = `<span class="dot dot-primary"></span>${totalQuestions} вопросов`;
    document.getElementById('total-num').textContent = totalQuestions;
    document.querySelector('.score-total').textContent = ` / ${totalQuestions}`;
  } catch (e) { console.error("Ошибка синхронизации вопросов", e); }
});

function show(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const el = document.getElementById(id);
  el.classList.add('active');
  el.style.animation = 'none';
  el.offsetHeight;
  el.style.animation = 'fadeIn .5s ease';
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// anti-cheat

function reportViolation(type) {
  const quizScreen = document.getElementById('quiz-screen');
  if (quizScreen && quizScreen.classList.contains('active')) {
    fetch('/api/violation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: type })
    });
  }
}

// counting Alt+Tab combination and alerting about it 
window.addEventListener('blur', () => {
  const quizScreen = document.getElementById('quiz-screen');
  if (quizScreen && quizScreen.classList.contains('active')) {
    reportViolation('blur');
    alert("Вы переключились на другую вкладку или свернули браузер.\nЭто было зафиксировано и Вы теряете один балл. \nплаки-плаки...");
  }
});

// Студент увел мышку за пределы окна браузера
document.addEventListener('mouseleave', () => {
  const quizScreen = document.getElementById('quiz-screen');
  if (quizScreen && quizScreen.classList.contains('active')) {
    reportViolation('mouseleave');
    alert("Курсор мыши покинул окно тестирования. Если первый раз - балл не отнимается, но вот другие разы...");
  }
});

document.addEventListener('contextmenu', event => event.preventDefault());

document.addEventListener('keydown', (e) => {
  if (e.key === 'F12' ||
    (e.ctrlKey && e.shiftKey && e.key === 'I') ||
    (e.ctrlKey && e.key === 'c')) {
    e.preventDefault();
    reportViolation('hotkey');
    alert("асуждаю\nИспользование горячих клавиш или консоли разработчика заблокировано.\nНарушение зафиксировано.");
  }
});

async function checkMessages() {
  try {
    const res = await fetch('/api/get_message');
    const data = await res.json();
    if (data.message) {
      alert(`УВЕДОМЛЕНИЕ ОТ ПРЕПОДАВАТЕЛЯ:\n\n${data.message}`);
    }
  } catch (e) { console.error(e); }
}

async function loginAndStart() {
  const nameInput = document.getElementById('username-input');
  const name = nameInput.value.trim();

  if (localStorage.getItem("quiz_completed")) {
    alert("Вы уже сдали этот тест.");
    return;
  }

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

    const data = await response.json();

    if (response.ok && data.status === "ok") {
      totalQuestions = data.total_questions;
      current = 0;
      messageInterval = setInterval(checkMessages, 3000);
      show('quiz-screen');
      loadNextQuestion();
    } else {
      alert(data.message || "Ошибка сервера при логине.");
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

async function loadNextQuestion() {
  try {
    const res = await fetch(`/api/question/${current}`);
    if (!res.ok) throw new Error("HTTP Error " + res.status);
    const q = await res.json();
    renderQuestion(q);
  } catch (e) {
    console.error("Не удалось загрузить вопрос", e);
  }
}

function renderQuestion(q) {
  document.getElementById('current-num').textContent = current + 1;
  document.getElementById('total-num').textContent = totalQuestions;

  const pct = ((current + 1) / totalQuestions) * 100;
  document.getElementById('progress-percent').textContent = Math.round(pct) + '%';
  document.getElementById('progress-fill').style.width = pct + '%';
  document.getElementById('question-text').textContent = q.question;

  const container = document.getElementById('options-container');
  container.innerHTML = '';

  let shuffledOptions = q.options.map((optText, index) => {
    return { text: optText, originalIndex: index };
  });

  shuffleArray(shuffledOptions);

  shuffledOptions.forEach((optObj, i) => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.dataset.originalIndex = optObj.originalIndex;
    btn.innerHTML = `<span class="letter">${String.fromCharCode(65 + i)}</span><span>${optObj.text}</span>`;
    btn.style.animation = `fadeIn .3s ease ${i * 0.07}s both`;

    btn.onclick = () => selectOption(q.id, optObj.originalIndex);
    container.appendChild(btn);
  });
}

async function selectOption(questionId, selectedOriginalIndex) {
  const btns = document.querySelectorAll('.option-btn');
  btns.forEach(btn => btn.disabled = true);

  try {
    const res = await fetch('/api/check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question_id: questionId, selected_index: selectedOriginalIndex })
    });

    if (!res.ok) throw new Error("Server error");
    const data = await res.json();

    btns.forEach((btn) => {
      const btnOriginalIndex = parseInt(btn.dataset.originalIndex);
      if (btnOriginalIndex === data.correctIndex) {
        btn.classList.add('option-correct');
      } else if (btnOriginalIndex === selectedOriginalIndex) {
        btn.classList.add('option-wrong');
      } else {
        btn.classList.add('option-dimmed');
      }
    });

    setTimeout(() => {
      current++;
      if (current < totalQuestions) {
        loadNextQuestion();
      } else {
        submitAndShowResults();
      }
    }, 1500);
  } catch (e) {
    console.error("Ошибка проверки ответа", e);
    btns.forEach(btn => btn.disabled = false);
  }
}

async function submitAndShowResults() {
  try {
    const res = await fetch('/api/submit', { method: 'POST' });
    const data = await res.json();

    localStorage.setItem("quiz_completed", "true");

    if (messageInterval) clearInterval(messageInterval);

    showResults(data.score, data.max_score);
  } catch (e) {
    console.error("Ошибка сохранения результата", e);
  }
}

function showResults(score, maxScore) {
  show('results-screen');
  const percentage = (score / maxScore) * 100;
  const isHigh = percentage >= 80;

  const sv = document.getElementById('score-value');
  sv.textContent = score;
  sv.className = 'score-value ' + (isHigh ? 'score-high' : 'score-low');

  const iconBox = document.getElementById('result-icon-box');
  iconBox.className = 'icon-box glass-card ' + (isHigh ? 'success-glow' : 'error-glow');

  iconBox.innerHTML = isHigh
    ? '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="hsl(155,55%,45%)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/><path d="M12 3v12"/><path d="M5 21h14"/></svg>'
    : '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="hsl(0,65%,55%)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>';

  document.getElementById('feedback-text').textContent = isHigh
    ? "Отличный результат! Вы превосходно усвоили материал."
    : "осуждаю.";

  const fill = document.getElementById('result-bar-fill');
  fill.style.width = '0';
  fill.style.background = isHigh ? 'var(--success)' : 'var(--destructive)';
  setTimeout(() => fill.style.width = percentage + '%', 100);
  document.getElementById('result-percent').textContent = Math.round(percentage) + '% верно';
}