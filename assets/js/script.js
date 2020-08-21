let countdownTimer = document.querySelector("#countdown");
let goBtn = document.querySelector("#btnStart");
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
}

goBtn.addEventListener("click", startTimer);