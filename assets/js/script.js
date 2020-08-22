// List of questions for quiz
const questions = [
  {
    "question": "Question 1",
    "answer1": "Answer 1",
    "answer2": "Answer 2",
    "answer3": "Answer 3",
    "answer4": "Answer 4",
    "correctAnswer": "1"
  },
  {
    "question": "Question 2",
    "answer1": "Answer 1",
    "answer2": "Answer 2",
    "answer3": "Answer 3",
    "answer4": "Answer 4",
    "correctAnswer": "1"
  },
  {
    "question": "Question 3",
    "answer1": "Answer 1",
    "answer2": "Answer 2",
    "answer3": "Answer 3",
    "answer4": "Answer 4",
    "correctAnswer": "1"
  }
]

// Page objects to access 
let headerEl = document.querySelector("#header");
let countdownTimerEl = document.querySelector("#countdown");
let pageContentEl = document.querySelector("#page-content");
let quizContentEl = document.querySelector("#quiz-content-template");
let resultsContentEl = document.querySelector("#results-content-template");
let highScoresContentEl = document.querySelector("#highscores-content-template");

// Page objects that may not be displayed, yet. Will set up as needed
let resultsWrapperEl;
let startBtn;
let aBtn;
let bBtn;
let cBtn;
let dBtn;

// Template HTML to swap out in page content area
let startHtml = pageContentEl.innerHTML;
let quizHtml = quizContentEl.innerHTML;
let resultsHtml = resultsContentEl.innerHTML;
let higScoresHtml = highScoresContentEl.innerHTML;

// Timer variables
let startTime = 15;
let currentTime = startTime;
let timePenalty = 10;
let thisInterval;

// quiz variables
let questionIndex = 0;

let startTimer = function () {
  // Set the start time for the timer
  currentTime = startTime;
  countdownTimerEl.textContent = currentTime;

  // Clear any timer before setting it to be "thread safe"
  clearInterval(thisInterval);

  // Start timer and exit this function
  thisInterval = setInterval(function () {
    countdownTimerEl.textContent = --currentTime;
    if (currentTime === 0) {
      // Test is over
      clearInterval(thisInterval);
      endQuiz(null);
    }
  }, 1000);
};

let startQuiz = function () {
  pageContentEl.innerHTML = quizHtml;
  initAnswerListeners();
  startTimer();
  questionIndex = 0;

  displayQuestion();
};

// Display the current question and answers
let displayQuestion = function () {
  pageContentEl.querySelector("#question").textContent = questions[questionIndex].question;

  for (let i = 1; i <= 4; i++) {
    eval('pageContentEl.querySelector("#btnAnswer' + i + '").textContent = "' + i + '. " + questions[questionIndex].answer' + i + ';');
  }
};

// Display the result of the last answered question
let displayResult = function (answerCorrect) {
  resultsWrapperEl = pageContentEl.querySelector("#result-wrapper");
  resultsWrapperEl.style.visibility = "visible";
  
  if (answerCorrect) {
    resultsWrapperEl.textContent = "Correct!";
  }
  else {
    resultsWrapperEl.textContent = "Wrong!";
  }
};

// Check answer and display if the user got it right or wrong on the next screen
let checkAnswer = function (event) {
  let userAnswer = event.target.value;

  let answerCorrect = (userAnswer === questions[questionIndex].correctAnswer);

  if (answerCorrect) {
    displayResult(true);
  }
  else {
    displayResult(false);
    currentTime -= timePenalty;
    if (currentTime <= 0) {
      currentTime = 0;
      endQuiz(answerCorrect);
      return;
    }
    countdownTimerEl.textContent = currentTime;
  }

  questionIndex++;

  // Determine if the quiz if over of if the user gets another question
  if (questionIndex == questions.length) {
    endQuiz(answerCorrect)
  }
  else {
    displayQuestion(answerCorrect);
  }
};


// End the quiz and display the score
let endQuiz = function(answerCorrect){
  clearInterval(thisInterval);
  countdownTimerEl.textContent = currentTime;
  pageContentEl.innerHTML = resultsHtml;
  let scoreDisplay = pageContentEl.querySelector("#score");

  scoreDisplay.textContent = currentTime;
  // If the quiz ended because the last question was answered, display the results of the last question
  if (answerCorrect !== null)
  {
    displayResult(answerCorrect);
  }
}

// Set up the DOM objects and event listeners for the start slide
let initStartListeners = function () {
  startBtn = document.querySelector("#btnStart");

  startBtn.addEventListener("click", startQuiz);
}

// Set up the DOM objects and event listeners for the quiz slide
let initAnswerListeners = function () {
  answer1Btn = document.querySelector("#btnAnswer1");
  answer2Btn = document.querySelector("#btnAnswer2");
  answer3Btn = document.querySelector("#btnAnswer3");
  answer4Btn = document.querySelector("#btnAnswer4");

  answer1Btn.addEventListener("click", checkAnswer);
  answer2Btn.addEventListener("click", checkAnswer);
  answer3Btn.addEventListener("click", checkAnswer);
  answer4Btn.addEventListener("click", checkAnswer);
};

// Just in case there are conflicts with ids in templates, get rid of them
let destroyTemplates = function () {
  quizContentEl.innerHTML = "";
  resultsContentEl.innerHTML = "";
  highScoresContentEl.innerHTML = "";
};

initStartListeners();

//destroyTemplates();