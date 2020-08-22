let countdownTimer = document.querySelector("#countdown");
let pageContent = document.querySelector("#page-content");
let quizContent = document.querySelector("#quiz-content-template");

let goBtn;
let aBtn;
let bBtn;
let cBtn;
let dBtn;

let startHtml = pageContent.innerHTML;
let quizHtml = quizContent.innerHTML;

var startTime = 5;
var thisInterval;

let startTimer = function () {
  countdownTimer.textContent = startTime;
  clearInterval(thisInterval);
  thisInterval = setInterval(function () {
    countdownTimer.textContent = --startTime;
    if (startTime === 0) {
      clearInterval(thisInterval);
    }
  }, 1000);
};

let startQuiz = function() {
  pageContent.innerHTML = quizHtml;
  initAnswerListeners();
}

let checkAnswer = function(event) {
  console.log(event.target.value);
};

let initStartListeners = function() {
  goBtn = document.querySelector("#btnStart");

  goBtn.addEventListener("click", main);
}

let initAnswerListeners = function() {
  answer1Btn = document.querySelector("#btnAnswer1");
  answer2Btn = document.querySelector("#btnAnswer2");
  answer3Btn = document.querySelector("#btnAnswer3");
  answer4Btn = document.querySelector("#btnAnswer4");

  answer1Btn.addEventListener("click", checkAnswer);
  answer2Btn.addEventListener("click", checkAnswer);
  answer3Btn.addEventListener("click", checkAnswer);
  answer4Btn.addEventListener("click", checkAnswer);
};

let destroyTemplates = function() {
  quizContent.innerHTML = "";
}

let main = function() {
  startTimer();
  startQuiz();
};

initStartListeners();

//destroyTemplates();