// Log a message to the console to ensure the script is linked correctly
console.log("JavaScript file is linked correctly.");

// Get HTML elements
const gameArea = document.getElementById("gameArea");
const bucket = document.getElementById("bucket");
const scoreDisplay = document.getElementById("score");
const timerDisplay = document.getElementById("timer");
const countdownDisplay = document.getElementById("countdown");
const messageBox = document.getElementById("messageBox");

const startButton = document.getElementById("startButton");
const leftButton = document.getElementById("leftButton");
const rightButton = document.getElementById("rightButton");

// Game variables
let score = 0;
let timeLeft = 30;
let gameRunning = false;

let bucketPosition = 50;
let bucketSpeed = 5;

let dropSpawnInterval;
let gameTimerInterval;
let movementInterval;

// Start button
startButton.addEventListener("click", startCountdown);

// Keyboard controls for desktop
document.addEventListener("keydown", function(event) {
  if (!gameRunning) {
    return;
  }

  if (event.key === "ArrowLeft") {
    moveBucketLeft();
  }

  if (event.key === "ArrowRight") {
    moveBucketRight();
  }
});

// Mobile button controls
leftButton.addEventListener("mousedown", function() {
  startMoving("left");
});

rightButton.addEventListener("mousedown", function() {
  startMoving("right");
});

leftButton.addEventListener("mouseup", stopMoving);
rightButton.addEventListener("mouseup", stopMoving);

leftButton.addEventListener("mouseleave", stopMoving);
rightButton.addEventListener("mouseleave", stopMoving);

leftButton.addEventListener("touchstart", function(event) {
  event.preventDefault();
  startMoving("left");
});

rightButton.addEventListener("touchstart", function(event) {
  event.preventDefault();
  startMoving("right");
});

leftButton.addEventListener("touchend", stopMoving);
rightButton.addEventListener("touchend", stopMoving);

// Starts countdown before the game begins
function startCountdown() {
  resetGame();

  startButton.style.display = "none";
  countdownDisplay.style.display = "flex";

  let countdownNumber = 3;
  countdownDisplay.textContent = countdownNumber;

  const countdownInterval = setInterval(function() {
    countdownNumber--;

    if (countdownNumber > 0) {
      countdownDisplay.textContent = countdownNumber;
    } else {
      clearInterval(countdownInterval);
      countdownDisplay.textContent = "Go!";

      setTimeout(function() {
        countdownDisplay.style.display = "none";
        startGame();
      }, 700);
    }
  }, 1000);
}

// Starts the main game
function startGame() {
  gameRunning = true;
  messageBox.textContent = "Catch blue droplets! Avoid green droplets!";

  dropSpawnInterval = setInterval(createDrop, 700);

  gameTimerInterval = setInterval(function() {
    timeLeft--;
    timerDisplay.textContent = timeLeft;

    if (timeLeft <= 0) {
      endGame();
    }
  }, 1000);
}

// Creates falling water drops
function createDrop() {
  const drop = document.createElement("div");

  const isCleanDrop = Math.random() > 0.25;

  if (isCleanDrop) {
    drop.classList.add("drop", "clean");
  } else {
    drop.classList.add("drop", "polluted");
  }

  const randomLeftPosition = Math.random() * 95;
  drop.style.left = randomLeftPosition + "%";
  drop.style.top = "-40px";

  gameArea.appendChild(drop);

  moveDrop(drop, isCleanDrop);
}

// Moves each drop down the screen
function moveDrop(drop, isCleanDrop) {
  let dropTopPosition = -40;

  const fallInterval = setInterval(function() {
    if (!gameRunning) {
      clearInterval(fallInterval);
      drop.remove();
      return;
    }

    dropTopPosition += 4;
    drop.style.top = dropTopPosition + "px";

    if (checkCollision(drop, bucket)) {
      clearInterval(fallInterval);

      if (isCleanDrop) {
        score++;
        messageBox.textContent = "+1 gallon of clean water!";
      } else {
        score--;
        messageBox.textContent = "-1 gallon! Polluted water collected!";
      }

      scoreDisplay.textContent = score;
      drop.remove();
    }

    if (dropTopPosition > gameArea.offsetHeight) {
      clearInterval(fallInterval);
      drop.remove();
    }
  }, 20);
}

// Checks if a drop touches the bucket
function checkCollision(drop, bucket) {
  const dropBox = drop.getBoundingClientRect();
  const bucketBox = bucket.getBoundingClientRect();

  return (
    dropBox.left < bucketBox.right &&
    dropBox.right > bucketBox.left &&
    dropBox.top < bucketBox.bottom &&
    dropBox.bottom > bucketBox.top
  );
}

// Moves bucket left
function moveBucketLeft() {
  bucketPosition -= bucketSpeed;

  if (bucketPosition < 5) {
    bucketPosition = 5;
  }

  bucket.style.left = bucketPosition + "%";
}

// Moves bucket right
function moveBucketRight() {
  bucketPosition += bucketSpeed;

  if (bucketPosition > 95) {
    bucketPosition = 95;
  }

  bucket.style.left = bucketPosition + "%";
}

// Starts holding movement for mobile buttons
function startMoving(direction) {
  if (!gameRunning) {
    return;
  }

  stopMoving();

  movementInterval = setInterval(function() {
    if (direction === "left") {
      moveBucketLeft();
    } else {
      moveBucketRight();
    }
  }, 60);
}

// Stops holding movement
function stopMoving() {
  clearInterval(movementInterval);
}

// Ends the game
function endGame() {
  gameRunning = false;

  clearInterval(dropSpawnInterval);
  clearInterval(gameTimerInterval);
  clearInterval(movementInterval);

  const allDrops = document.querySelectorAll(".drop");
  allDrops.forEach(function(drop) {
    drop.remove();
  });

  countdownDisplay.style.display = "flex";
  countdownDisplay.textContent = "Game Over";

  messageBox.textContent =
    "You managed to collect " +
    score +
    " gallons of water, which could help provide clean water awareness for " +
    score +
    " people.";

  startButton.style.display = "block";
  startButton.textContent = "Play Again";
}

// Resets the game
function resetGame() {
  score = 0;
  timeLeft = 30;
  bucketPosition = 50;
  gameRunning = false;

  scoreDisplay.textContent = score;
  timerDisplay.textContent = timeLeft;
  bucket.style.left = bucketPosition + "%";

  clearInterval(dropSpawnInterval);
  clearInterval(gameTimerInterval);
  clearInterval(movementInterval);

  const allDrops = document.querySelectorAll(".drop");
  allDrops.forEach(function(drop) {
    drop.remove();
  });

  messageBox.textContent = "Get ready to collect clean water!";
}