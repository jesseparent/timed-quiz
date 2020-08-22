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
  addAnswerListeners();
}

let checkAnswer = function(event) {
  console.log(event.target.value);
};

let addStartListeners = function() {
  goBtn = document.querySelector("#btnStart");

  goBtn.addEventListener("click", main);
}

let addAnswerListeners = function() {
  aBtn = document.querySelector("#btnA");
  bBtn = document.querySelector("#btnB");
  cBtn = document.querySelector("#btnC");
  dBtn = document.querySelector("#btnD");

  aBtn.addEventListener("click", checkAnswer);
  bBtn.addEventListener("click", checkAnswer);
  cBtn.addEventListener("click", checkAnswer);
  dBtn.addEventListener("click", checkAnswer);
};

let destroyTemplates = function() {
  quizContent.innerHTML = "";
}

let main = function() {
  startTimer();
  startQuiz();
};

addStartListeners();

//destroyTemplates();