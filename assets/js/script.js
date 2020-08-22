var questions = [
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
  }
]
console.dir(questions);

let headerEl = document.querySelector("#header");
let countdownTimerEl = document.querySelector("#countdown");
let pageContentEl = document.querySelector("#page-content");
let resultsWrapperEl;
let quizContentEl = document.querySelector("#quiz-content-template");
let resultsContentEl = document.querySelector("#results-content-template");
let highScoresContentEl = document.querySelector("#highscores-content-template");

let goBtn;
let aBtn;
let bBtn;
let cBtn;
let dBtn;

let startHtml = pageContentEl.innerHTML;
let quizHtml = quizContentEl.innerHTML;
let resultsHtml = resultsContentEl.innerHTML;
let higScoresHtml = highScoresContentEl.innerHTML;

var startTime = 75;
var thisInterval;

let startTimer = function () {
  countdownTimerEl.textContent = startTime;
  clearInterval(thisInterval);
  thisInterval = setInterval(function () {
    countdownTimerEl.textContent = --startTime;
    if (startTime === 0) {
      clearInterval(thisInterval);
    }
  }, 1000);
};

let startQuiz = function () {
  pageContentEl.innerHTML = quizHtml;
  initAnswerListeners();

  displayQuestion(0);
};

let displayQuestion = function (questionNum) {
  pageContentEl.querySelector("#question").textContent = questions[questionNum].question;
  pageContentEl.querySelector("#questionIndex").value = questionNum;
  for (let i = 1; i <= 4; i++) {
    eval('pageContentEl.querySelector("#btnAnswer' + i + '").textContent = "' + i + '. " + questions[questionNum].answer' + i + ';');
  }
};

let checkAnswer = function (event) {
  let questionIndex = pageContentEl.querySelector("#questionIndex").value;
  let userAnswer = event.target.value;

  console.log(userAnswer === questions[questionIndex].correctAnswer);
  questionIndex++;
  console.log("next index: "+ questionIndex);
  displayQuestion(questionIndex);
};

let initStartListeners = function () {
  goBtn = document.querySelector("#btnStart");

  goBtn.addEventListener("click", main);
}

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

let main = function () {
  startTimer();
  startQuiz();
};

initStartListeners();

destroyTemplates();