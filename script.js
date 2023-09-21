const rulesBtn = document.getElementById('rules-btn');
const closeBtn = document.getElementById('close-btn');
const rules = document.getElementById('rules');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let score = 0;

const brickRowCount = 9;
const brickColumnCount = 5;
const delay = 500;

const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  size: 10,
  speed: 4,
  dx: 4,
  dy: -4,
  visible: true
};

const paddle = {
  x: canvas.width / 2 - 40,
  y: canvas.height - 20,
  w: 80,
  h: 10,
  speed: 8,
  dx: 0,
  visible: true
};

const brickInfo = {
  w: 70,
  h: 20,
  padding: 10,
  offsetX: 45,
  offsetY: 60,
  visible: true
};


const bricks = [];
for (let i = 0; i < brickRowCount; i++) {
  bricks[i] = [];
  for (let j = 0; j < brickColumnCount; j++) {
    const x = i * (brickInfo.w + brickInfo.padding) + brickInfo.offsetX;
    const y = j * (brickInfo.h + brickInfo.padding) + brickInfo.offsetY;
    bricks[i][j] = { x, y, ...brickInfo };
  }
}




function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
  ctx.fillStyle = ball.visible ? '#0095dd' : 'transparent';
  ctx.fill();
  ctx.closePath();
}



function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddle.x, paddle.y, paddle.w, paddle.h);
  ctx.fillStyle = paddle.visible ? '#0095dd' : 'transparent';
  ctx.fill();
  ctx.closePath();
}


function drawScore() {
  ctx.font = '20px Arial';
  ctx.fillText(`Score: ${score}`, canvas.width - 100, 30);
}

function drawBricks() {
  bricks.forEach(column => {
    column.forEach(brick => {
      if (brick.visible) {
        ctx.beginPath();
        ctx.rect(brick.x, brick.y, brick.w, brick.h);
        ctx.fillStyle = brick.brickColor;
        ctx.fill();
        ctx.closePath();
      }
    });
  });
}




function movePaddle() {
  paddle.x += paddle.dx;


  if (paddle.x + paddle.w > canvas.width) {
    paddle.x = canvas.width - paddle.w;
  }

  if (paddle.x < 0) {
    paddle.x = 0;
    }
}


function moveBall() {
  ball.x += ball.dx;
  ball.y += ball.dy;


  if (ball.x + ball.size > canvas.width || ball.x - ball.size < 0) {
    ball.dx *= -1; 
  }

 
  if (ball.y + ball.size > canvas.height || ball.y - ball.size < 0) {
    ball.dy *= -1;
  }

 
  if (
    ball.x - ball.size > paddle.x &&
    ball.x + ball.size < paddle.x + paddle.w &&
    ball.y + ball.size > paddle.y
  ) {
    ball.dy = -ball.speed;
  }

  
  bricks.forEach(column => {
    column.forEach(brick => {
      if (brick.visible) {
        if (
          ball.x - ball.size > brick.x && 
          ball.x + ball.size < brick.x + brick.w && 
          ball.y + ball.size > brick.y && 
          ball.y - ball.size < brick.y + brick.h 
        ) {
          ball.dy *= -1;
          brick.visible = false;

          increaseScore();
        }
      }
    });
  });


  if (ball.y + ball.size > canvas.height) {
    showAllBricks();
    score = 0;
  }
}

function increaseScore() {
  score++;

  if (score % (brickRowCount * brickColumnCount) === 0) {
    // Level completed, move to the next level
    currentLevel++;

    if (currentLevel >= levels.length) {
      // All levels completed (you can add a game completion logic here)
      alert('Congratulations! You completed all levels.');
      // You might want to add logic to restart the game or go back to the first level
    } else {
      // Reset game elements and show the next level
      ball.visible = false;
      paddle.visible = false;

      setTimeout(function () {
        showAllBricks();
        score = 0;
        paddle.x = canvas.width / 2 - 40;
        paddle.y = canvas.height - 20;
        ball.x = canvas.width / 2;
        ball.y = canvas.height / 2;
        ball.visible = true;
        paddle.visible = true;

        // Update and display the current level
        displayCurrentLevel();
      }, delay);
    }
  }
}


function showAllBricks() {
  bricks.forEach(column => {
    column.forEach(brick => (brick.visible = true));
  });
}


function draw() {
 
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawBall();
  drawPaddle();
  drawScore();
  drawBricks();
}


function update() {
  movePaddle();
  moveBall();

  
  draw();

  requestAnimationFrame(update);
}

update();


function keyDown(e) {
  if (e.key === 'Right' || e.key === 'ArrowRight') {
    paddle.dx = paddle.speed;
  } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
    paddle.dx = -paddle.speed;
  }
}


function keyUp(e) {
  if (
    e.key === 'Right' ||
    e.key === 'ArrowRight' ||
    e.key === 'Left' ||
    e.key === 'ArrowLeft'
  ) {
    paddle.dx = 0;
  }
}


document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);


rulesBtn.addEventListener('click', () => rules.classList.add('show'));
closeBtn.addEventListener('click', () => rules.classList.remove('show'));

// Add this before your existing level information
const levels = [
  {
    name: 'Level 1',
    brickRowCount: 4,
    brickColumnCount: 5,
    ballSpeed: 4,
    paddleSpeed: 8,
  },
  {
    name: 'Level 2',
    brickRowCount: 6,
    brickColumnCount: 6,
    ballSpeed: 6,
    paddleSpeed: 10,
  },
  // Add more levels as needed
];

let currentLevel = 0;


// Add this function to display the current level
function displayCurrentLevel() {
  const levelInfo = document.getElementById('level-info');
  levelInfo.textContent = `Level: ${levels[currentLevel].name}`;
}

// Call the function to display the initial level


