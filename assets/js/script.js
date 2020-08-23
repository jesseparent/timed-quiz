// Page objects to access 
let headerEl = document.querySelector("#header");
let highScoresLink = document.querySelector("#high-score-link");
let countdownTimerEl = document.querySelector("#countdown");
let pageContentEl = document.querySelector("#page-content");
let quizContentEl = document.querySelector("#quiz-content-template");
let resultsContentEl = document.querySelector("#results-content-template");
let highScoresContentEl = document.querySelector("#highscores-content-template");

// Page objects that may not be displayed, yet. Will set up as needed
let resultsWrapperEl;
let startBtn;
let answersDiv;
let scoreBtn;
let goBackBtn;
let clearScoresBtn;
let inputTxt;

// Template HTML to swap out in page content area and switch to different screens
let startHtml = pageContentEl.innerHTML;
let quizHtml = quizContentEl.innerHTML;
let resultsHtml = resultsContentEl.innerHTML;
let higScoresHtml = highScoresContentEl.innerHTML;

// Timer variables
let startTime = 75;
let currentTime = startTime;
let timePenalty = 10;
let thisInterval;

// Scores
let scores = [];

// Quiz variables
let questionIndex = 0;

// Starts and displays the timer
let startTimer = function () {
  // Set the start time for the timer and display it
  currentTime = startTime;
  countdownTimerEl.textContent = currentTime;

  // Clear any timer before setting one in order to be "thread safe"
  clearInterval(thisInterval);

  // Start timer and exit this function
  thisInterval = setInterval(function () {
    countdownTimerEl.textContent = --currentTime;
    if (currentTime === 0) {
      // Time has been reached and the test is over
      clearInterval(thisInterval);
      endQuiz(null);
    }
  }, 1000);
};

// Start the quiz and display the first question
let startQuiz = function () {
  pageContentEl.innerHTML = quizHtml;
  initAnswerListeners();
  startTimer();
  questionIndex = 0;

  displayQuestion();
};

// Display the current question and answers
let displayQuestion = function () {
  // Display the question
  pageContentEl.querySelector("#question").textContent = questions[questionIndex].question;

  // Display the answers as buttons
  for (let i = 0; i < questions[questionIndex].answers.length; i++) {
    eval('pageContentEl.querySelector("#btnAnswer' + i + '").textContent = "' + (i + 1) + '. " + questions[questionIndex].answers[' + i + '];');
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
let checkAnswer = function () {
  let userAnswer = event.target.value;

  let answerCorrect = (userAnswer === questions[questionIndex].correctAnswerIndex);

  // Answer is correct
  if (answerCorrect) {
    displayResult(true);
  }
  // Answer is wrong
  else {
    displayResult(false);

    // Apply time penalty
    currentTime -= timePenalty;

    // Check if we are out of time after the time penalty
    if (currentTime <= 0) {
      currentTime = 0;
      endQuiz(answerCorrect);
      return;
    }

    // Make sure timer display is accurate
    countdownTimerEl.textContent = currentTime;
  }

  // Move on to next question
  questionIndex++;

  // Determine if the quiz is over of if the user gets another question
  if (questionIndex == questions.length) {
    endQuiz(answerCorrect)
  }
  else {
    displayQuestion(answerCorrect);
  }
};

// End the quiz and display the score
let endQuiz = function (answerCorrect) {
  // Kill the timer
  clearInterval(thisInterval);

  // Display time left in case a wrong answer was given and the time was reduced before it could be displayed
  countdownTimerEl.textContent = currentTime;

  // Show the results template and initialize the listeners
  pageContentEl.innerHTML = resultsHtml;
  initSubmitScoreListeners();

  // Display the score
  let scoreDisplay = pageContentEl.querySelector("#score");
  scoreDisplay.textContent = currentTime;

  // If the quiz ended because the last question was answered, display the results of the last question
  if (answerCorrect !== null) {
    displayResult(answerCorrect);
  }
};

// Store the intials and score of the user in local storage
let storeScore = function () {
  let initials = pageContentEl.querySelector("#initials").value;

  // Check if the user entered their initials
  if (initials === "") {
    alert("Please enter initials in order to submit a high score");
    return;
  }

  let scoreObj = {
    "initials": initials,
    "score": currentTime
  };

  // Save in local memory
  scores.push(scoreObj);

  // Save in local storage
  saveScores();

  // Display high score list
  displayHighScores();
};

// Display the high score list
let displayHighScores = function () {
  // Kill the timer
  clearInterval(thisInterval);

  // Set the timer display to the current time
  countdownTimerEl.textContent = currentTime;

  // Show the high scores template and initialize the listeners
  pageContentEl.innerHTML = higScoresHtml;
  initHighScoresListeners();

  // Hide the link for high scores and the timer display, but let it take up space in the document flow
  headerEl.style.visibility = "hidden";

  // Create the high score list in HTML
  let displayScoresUL = pageContentEl.querySelector("#displayScores");

  for (let i = 0; i < scores.length; i++) {
    let scoreLi = generateScoreEntry(scores[i]);
    displayScoresUL.appendChild(scoreLi);
  }
};

// Generate the list item for a specific score in the high score entry
let generateScoreEntry = function (scoreObj) {
  let scoreLi = document.createElement("li");
  scoreLi.className = "score";
  scoreLi.innerHTML = scoreObj.initials + " &mdash; " + scoreObj.score;
  return scoreLi;
};

// if the user presses enter in the input text on the enter score page, submit the score
let handleEnter = function (event) {
  // Number 13 is the "Enter" key on the keyboard
  if (event.keyCode === 13) {
    // Trigger the submit button element with a click
    submitBtn.click();
  }
};

// Show the beginning page of the quiz
let displayBeginning = function () {
  // Show the beginning scores template and initialize the listeners
  pageContentEl.innerHTML = startHtml;
  initStartListeners();

  // Reset the timer and the timer display
  currentTime = startTime;
  countdownTimerEl.textContent = currentTime;

  // Show the link for high scores and the timer display (Probably got here from the high scores page)
  headerEl.style.visibility = "visible";
};

// Set up the DOM objects and event listeners for the start slide
let initStartListeners = function () {
  startBtn = pageContentEl.querySelector("#btnStart");

  startBtn.addEventListener("click", startQuiz);
};

// Set up the DOM objects and event listeners for the quiz slide
let initAnswerListeners = function () {
  answersDiv = pageContentEl.querySelector("#answers");

  answersDiv.addEventListener("click", checkAnswer);
};

// Set up the DOM objects and event listeners for the results/score submission slide
let initSubmitScoreListeners = function () {
  submitBtn = pageContentEl.querySelector("#btnSubmitScore");
  inputTxt = pageContentEl.querySelector("#initials");

  submitBtn.addEventListener("click", storeScore);
  inputTxt.addEventListener("keyup", handleEnter);
};

// Set up the DOM objects and event listeners for the high scores slide
let initHighScoresListeners = function () {
  goBackBtn = pageContentEl.querySelector("#btnGoBack");
  clearScoresBtn = pageContentEl.querySelector("#btnClearScores");

  goBackBtn.addEventListener("click", displayBeginning);
  clearScoresBtn.addEventListener("click", clearScores);
};

// Save the scores in descending order
let saveScores = function () {
  scores.sort(compareScores);

  localStorage.setItem("scores", JSON.stringify(scores));
};

// Load the scores from local storage into memory
let loadScores = function () {
  // Gets scores from localStorage as a string
  let savedScores = localStorage.getItem("scores");

  // Converts scores in the stringified format back into an array of objects
  if (savedScores) {
    scores = JSON.parse(savedScores);
  }
  else {
    return false;
  }
};

// Clear the scores from memory and local storage
let clearScores = function () {
  scores = [];
  saveScores();
  displayHighScores();
}

// Compare function for array sort by scores descending, then names ascending
let compareScores = function (obj1, obj2) {
  // Sort by score descending
  if (obj2.score < obj1.score) {
    return -1;
  }
  if (obj2.score > obj1.score) {
    return 1;
  }

  // If a score is tied, sort alphabetically by initials
  if (obj1.initials < obj2.initials) {
    return -1;
  }
  if (obj1.initials > obj2.initials) {
    return 1;
  }

  // All fields match
  return 0;
};

// Just in case there are conflicts with ids in templates, get rid of them
let destroyTemplates = function () {
  quizContentEl.innerHTML = "";
  resultsContentEl.innerHTML = "";
  highScoresContentEl.innerHTML = "";
};

initStartListeners();

// Set behavior for clicking on high scores link. This will never be destroyed, only hidden.
highScoresLink.addEventListener("click", displayHighScores);

loadScores();

destroyTemplates();

// List of questions for quiz
// STRUCTURE:
//  question - text of question
//  answers - array of possibly answers
//  correctAnswerIndex - array index of correct answer
const questions = [
  {
    "question": "How do you use Javascript to create and evaluate a string as Javascript?",
    "answers": [
      "code()",
      "eval()",
      "generateScript()",
      "evaluate()"],
    "correctAnswerIndex": "1"
  },
  {
    "question": "What can you put on a form's onSubmit attribute to stop it from submitting?",
    "answers": [
      "return null",
      "noSubmit",
      "exit",
      "return false"],
    "correctAnswerIndex": "3"
  },
  {
    "question": "What attribute of the image tag would you change on a rollover event to show a different image?",
    "answers": [
      "img",
      "alt",
      "src",
      "file"],
    "correctAnswerIndex": "2"
  },
  {
    "question": "What browser was the American Online Web browser built on top of?",
    "answers": [
      "Internet Explorer",
      "Mozilla",
      "Netscape",
      "Opera"],
    "correctAnswerIndex": "0"
  },
  {
    "question": "What tag did Netscape attempt to make popular as an alternative to the DIV tag?",
    "answers": [
      "division",
      "layer",
      "sheet",
      "area"],
    "correctAnswerIndex": "1"
  },
  {
    "question": "Which scripting language comes after Javascript in terms of native support in browsers available, today?",
    "answers": [
      "tcl",
      "python",
      "vbscript",
      "rexx"],
    "correctAnswerIndex": "2"
  }
];