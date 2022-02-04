// Sets time for different pomodoro buttons
const timer = {
  pomodoro: 25,
  shortBreak: 5,
  longBreak: 15,
  longBreakInterval: 4,
  sessions: 0,
};

let interval;

// Controls main button
const mainButton = document.getElementById("js-btn");
mainButton.addEventListener("click", () => {
  const { action } = mainButton.dataset;
  if (action === "start") {
    startTimer();
  } else {
    stopTimer();
  }
});

// Stops the timer
function stopTimer() {
  clearInterval(interval);

  mainButton.dataset.action = "start";
  mainButton.textContent = "start";
  mainButton.classList.remove("active");
}

// Adds functionality to user clicks for the mode buttons
const modeButtons = document.querySelector("#js-mode-buttons");
modeButtons.addEventListener("click", handleMode);

function handleMode(event) {
  const { mode } = event.target.dataset;

  if (!mode) return;

  switchMode(mode);
  stopTimer();
}

// The switchMode function sets a property to mode (longbreak, pomodoro, etc), and also remaining time on the timer
function switchMode(mode) {
  timer.mode = mode;
  timer.remainingTime = {
    total: timer[mode] * 60,
    minutes: timer[mode],
    seconds: 0,
  };

  document
    .querySelectorAll("button[data-mode]")
    .forEach((e) => e.classList.remove("active"));
  document.querySelector(`[data-mode="${mode}"]`).classList.add("active");
  document.body.style.backgroundColor = `var(--${mode})`;

  // Adds the max attribute for the progress bar
  document
    .getElementById("js-progress")
    .setAttribute("max", timer.remainingTime.total);

  updateClock();
}

// Gets the remaining time for timer
function getRemainingTime(endTime) {
  const currentTime = Date.parse(new Date());
  const difference = endTime - currentTime;

  const total = Number.parseInt(difference / 1000, 10);
  const minutes = Number.parseInt((total / 60) % 60, 10);
  const seconds = Number.parseInt(total % 60, 10);

  return {
    total,
    minutes,
    seconds,
  };
}

// Starts timer
function startTimer() {
  let { total } = timer.remainingTime;
  const endTime = Date.parse(new Date()) + total * 1000;

  // Updates the value of sessions
  if (timer.mode === "pomodoro") timer.sessions++;

  mainButton.dataset.action = "stop";
  mainButton.textContent = "stop";
  mainButton.classList.add("active");

  interval = setInterval(function () {
    timer.remainingTime = getRemainingTime(endTime);
    updateClock();

    total = timer.remainingTime.total;
    if (total <= 0) {
      clearInterval(interval);

      // Switches the mode to the next automatically
      switch (timer.mode) {
        case "pomodoro":
          if (timer.sessions % timer.longBreakInterval === 0) {
            switchMode("longBreak");
          } else {
            switchMode("shortBreak");
          }
          break;
        default:
          switchMode("pomodoro");
      }

      startTimer();
    }
  }, 1000);
}

// This funciton updates the clock with the time
function updateClock() {
  const { remainingTime } = timer;
  const minutes = `${remainingTime.minutes}`.padStart(2, "0");
  const seconds = `${remainingTime.seconds}`.padStart(2, "0");

  const min = document.getElementById("js-minutes");
  const sec = document.getElementById("js-seconds");
  min.textContent = minutes;
  sec.textContent = seconds;

  // Updates the progress bar value with the time remaining
  const progress = document.getElementById("js-progress");
  progress.value = timer[timer.mode] * 60 - timer.remainingTime.total;
}

document.addEventListener("DOMContentLoaded", () => {
  switchMode("pomodoro");
});
