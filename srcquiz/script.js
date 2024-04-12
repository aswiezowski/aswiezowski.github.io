let currentQuestion = 0;
let score = 0;
let quizData;

const questionEl = document.getElementById('question');
const optionsEl = document.getElementById('options');
const nextBtn = document.getElementById('next-btn');
const backBtn = document.getElementById('back-btn');
const questionNumberEl = document.getElementById('question-number');
const scoreValueEl = document.getElementById('score-value');
const refreshBtn = document.getElementById('refresh-btn');


nextBtn.addEventListener('click', () => {
  currentQuestion++;
  if (currentQuestion < quizData.length) {
    showQuestion();
  } else {
    showResults();
  }
});

backBtn.addEventListener('click', () => {
  if (currentQuestion > 0) {
    currentQuestion--;
    showQuestion();
  }
});


refreshBtn.addEventListener('click', () => {
  resetQuiz();
});

function showQuestion() {
  const q = quizData[currentQuestion];
  questionEl.textContent = q.question;

  // Update question number
  questionNumberEl.textContent = `Question ${currentQuestion + 1}`;

  optionsEl.innerHTML = '';
  q.options.forEach(option => {
    const optionEl = document.createElement('button');
    optionEl.textContent = option.text;
    optionEl.classList.add('option-btn');
    optionEl.addEventListener('click', () => checkAnswer(option.correct, optionEl));
    optionsEl.appendChild(optionEl);
  });
}

let selectedCorrectAnswers = new Set();
let selectedWrongAnswers = new Set();
let selectedOptions = {}; // Object to store selected options

function checkAnswer(correct, optionEl) {
  // Enable all option buttons
  optionsEl.querySelectorAll('.option-btn').forEach(btn => {
    btn.disabled = false;
  });

  // Check if the clicked option is already correct and selected before
  if (correct && selectedCorrectAnswers.has(optionEl)) {
    return;
  }

  // Check if the clicked option is already wrong and selected before
  if (!correct && selectedWrongAnswers.has(optionEl)) {
    return;
  }

  // Check if the option was previously selected
  if (selectedOptions[currentQuestion] && selectedOptions[currentQuestion].includes(optionEl)) {
    return;
  }

  if (correct) {
    score++;
    scoreValueEl.textContent = score;
    optionEl.style.backgroundColor = '#28a745'; // Green color for correct answer
    selectedCorrectAnswers.add(optionEl); // Add the option to the set of selected correct answers
  } else {
    optionEl.style.backgroundColor = '#dc3545'; // Red color for wrong answer
    selectedWrongAnswers.add(optionEl); // Add the option to the set of selected wrong answers
  }

  // Store the selected option
  if (!selectedOptions[currentQuestion]) {
    selectedOptions[currentQuestion] = [optionEl];
  } else {
    selectedOptions[currentQuestion].push(optionEl);
  }

  // Disable the clicked option button
  optionEl.disabled = true;
}



function showResults() {
  questionEl.textContent = `You scored ${score} out of ${quizData.length}`;
  optionsEl.innerHTML = '';
}

function resetQuiz() {
  // Reset variables and UI to initial state
  currentQuestion = 0;
  score = 0;
  selectedCorrectAnswers.clear();
  selectedWrongAnswers.clear();
  selectedOptions = {};

  scoreValueEl.textContent = score;
  fetchQuizData(); // Fetch new quiz data
}

function shuffleQuizData() {
  for (let i = quizData.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [quizData[i], quizData[j]] = [quizData[j], quizData[i]];
  }
}


function fetchQuizData() {
  fetch('quiz.json')
    .then(response => response.json())
    .then(data => {
      quizData = data;
      shuffleQuizData();
      showQuestion();
    });
}

// Initial fetch of quiz data
fetchQuizData();
