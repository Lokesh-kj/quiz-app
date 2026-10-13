// ---------- Question generator (random math questions each game!) ----------
function generateQuestions() {
  const questions = [];
  for (let i = 0; i < 5; i++) {
    const a = Math.floor(Math.random() * 10) + 1;   // 1 to 10
    const b = Math.floor(Math.random() * 10) + 1;
    const operators = ["+", "-", "×"];
    const op = operators[Math.floor(Math.random() * operators.length)];
    let correct;
    if (op === "+") correct = a + b;
    else if (op === "-") correct = a - b;
    else correct = a * b;

    // Generate 3 wrong answers
    const wrongAnswers = new Set();
    while (wrongAnswers.size < 3) {
      const wrong = correct + Math.floor(Math.random() * 10) - 5;
      if (wrong !== correct && wrong >= 0) wrongAnswers.add(wrong);
    }

    // Build options array and shuffle
    const options = [...wrongAnswers, correct];
    options.sort(() => Math.random() - 0.5);

    questions.push({
      question: a + " " + op + " " + b + " = ?",
      answers: options.map(String),
      correct: options.indexOf(correct)
    });
  }
  return questions;
}

let questions = generateQuestions();
let currentQuestion = 0;
let score = 0;
let timeLeft = 15;
let timerId = null;

const questionEl = document.getElementById("question");
const answersEl = document.getElementById("answers");
const scoreEl = document.getElementById("score");
const counterEl = document.getElementById("counter");
const timerEl = document.getElementById("timer");
const progressEl = document.getElementById("progress");
const restartBtn = document.getElementById("restart-btn");

function startTimer() {
  timeLeft = 15;
  timerEl.textContent = "Time: " + timeLeft + "s";
  timerId = setInterval(() => {
    timeLeft--;
    timerEl.textContent = "Time: " + timeLeft + "s";
    if (timeLeft <= 5) timerEl.style.color = "#e53935";
    if (timeLeft <= 0) {
      clearInterval(timerId);
      timeOut();
    }
  }, 1000);
}

function showQuestion() {
  const q = questions[currentQuestion];
  questionEl.textContent = q.question;
  answersEl.innerHTML = "";
  counterEl.textContent = "Question " + (currentQuestion + 1) + "/" + questions.length;
  progressEl.style.width = (currentQuestion / questions.length) * 100 + "%";
  timerEl.style.color = "#333";

  q.answers.forEach((answer, index) => {
    const btn = document.createElement("button");
    btn.textContent = answer;
    btn.classList.add("answer-btn");
    btn.addEventListener("click", () => selectAnswer(index, btn));
    answersEl.appendChild(btn);
  });

  startTimer();
}

function lockButtons() {
  answersEl.querySelectorAll("button").forEach(b => b.disabled = true);
}

function selectAnswer(index, btn) {
  clearInterval(timerId);
  lockButtons();
  const q = questions[currentQuestion];
  const buttons = answersEl.querySelectorAll("button");

  if (index === q.correct) {
    btn.classList.add("correct");
    score += timeLeft; // bonus points for speed!
  } else {
    btn.classList.add("wrong");
    buttons[q.correct].classList.add("correct");
  }
  scoreEl.textContent = "Score: " + score;
  setTimeout(nextQuestion, 1000);
}

function timeOut() {
  lockButtons();
  const q = questions[currentQuestion];
  answersEl.querySelectorAll("button")[q.correct].classList.add("correct");
  setTimeout(nextQuestion, 1000);
}

function nextQuestion() {
  currentQuestion++;
  if (currentQuestion < questions.length) {
    showQuestion();
  } else {
    showResult();
  }
}

function showResult() {
  questionEl.textContent = "Finished! Final score: " + score;
  answersEl.innerHTML = "";
  timerEl.textContent = "";
  progressEl.style.width = "100%";
  counterEl.textContent = "Quiz complete";
  restartBtn.classList.remove("hidden");
}

restartBtn.addEventListener("click", () => {
  questions = generateQuestions();  // brand new random questions!
  currentQuestion = 0;
  score = 0;
  scoreEl.textContent = "Score: 0";
  restartBtn.classList.add("hidden");
  showQuestion();
});

showQuestion();
