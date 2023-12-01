const myCanvas = document.querySelector("#myCanvas");
const leftControl = document.querySelector(".left-control");
const rightControl = document.querySelector(".right-control");
const fireControl = document.querySelector(".fire-control");
const ctx = myCanvas.getContext("2d");

console.log(myCanvas.width);

const windowWidth = window.innerWidth;

if (windowWidth > 1000) {
  const controls = [leftControl, rightControl, fireControl];
  controls.forEach(control => {
    control.style.display = "none";
  });
}

// Game variables
let leftArrow,
  rightArrow,
  fireArrow = false;

let player = {
  x: myCanvas.width / 2,
  y: myCanvas.height - 100,
  w: 30,
  score: 0,
};

const bullets = [];

let bullet = {
  x: player.x + 10,
  y: player.y - 10,
};

let enemies = [];
let enemyBullets = [];
let enemiesRow = 1;
let enemyXpos;
let enemyYpos;
let enemyBulletStatus = false;


// Handling keyboard events
document.addEventListener("keydown", (e) => {
  if (e.keyCode == 37) {
    leftArrow = true;
  } else if (e.keyCode == 39) {
    rightArrow = true;
  } else if (e.keyCode == 13) {
    createBullets();
  }
});

document.addEventListener("keyup", (e) => {
  if (e.keyCode == 37) {
    leftArrow = false;
  } else if (e.keyCode == 39) {
    rightArrow = false;
  } else if (e.keyCode == 13) {
    upArrow = false;
  }
});

// Handling button controls
leftControl.addEventListener("touchstart", () => {
  leftArrow = true
});

rightControl.addEventListener("touchstart", () => {
  rightArrow = true
});

leftControl.addEventListener("touchend", () => {
  leftArrow = false;
});

rightControl.addEventListener("touchend", () => {
  rightArrow = false;
});

fireControl.addEventListener("touchstart", () => {
  createBullets();
});





// Draw player
function drawPlayer() {
  ctx.drawImage(playerImg2, player.x, player.y);
}

// Move player
function movePlayer() {
  if (leftArrow && player.x >= 0) {
    player.x -= 5;
  } else if (rightArrow && player.x < myCanvas.width - 50) {
    player.x += 5;
  }
}

// Create bullets
function createBullets() {
  bulletSound.play();
  bulletSound.currentTime = 0;
  bullets.push({
    x: player.x + 10,
    y: player.y - 10, 
  });
}

// Draw bullets
function drawBullets() {
  for (let i = 0; i < bullets.length; i++) {
    let bullet = bullets[i];
    ctx.drawImage(bullImg, bullet.x, bullet.y);
  }
}

// Check when bullet hits enemy
function bulletCollision() {
  for (let i = 0; i < enemiesRow; i++) {
    let enemy = enemies[i];
    for (let j = 0; j < enemy.length; j++) {
      let enem = enemy[j];
      for (let k = 0; k < bullets.length; k++) {
        let bullet = bullets[k];
        if (
          bullet.y + player.w > enem.y &&
          bullet.y - player.w < enem.y + player.w &&
          bullet.x + player.w > enem.x &&
          bullet.x - player.w < enem.x
        ) {
          explodeSound.play();
          explodeSound.currentTime = 0;
          player.score++;
          enemies[i].splice(j, 1);
          bullets.splice(k, 1);
        }
      }
    }
  }
}

// Move bullets
function moveBullets() {
  for (let i = 0; i < bullets.length; i++) {
    let bullet = bullets[i];
    if (bullet.y <= 10) {
      bullets.splice(i, 1);
    }
    bullet.y -= 5;
  }
}

// Create enemies
function createEnemies() {
  for (let i = 0; i < enemiesRow; i++) {
    enemies[i] = [];
    for (let j = 0; j < 5; j++) {
      let enemX = Math.floor(Math.random() * myCanvas.width) - 50;
      enemies[i].push({
        x: enemX < 50 ? 50 : enemX,
        y: 100,
      });
    }
  }
}

createEnemies();

// Draw enemies
function drawEnemies() {
  for (let i = 0; i < enemiesRow; i++) {
    let enemy = enemies[i];
    for (let j = 0; j < enemy.length; j++) {
      let enem = enemy[j];
      for (let k = 0; k < enemies[0].length; k++) {
        const eachEnemy = enemies[0][k];
        if (enem.x !== eachEnemy.x) {
          if (enem.x + 50 > eachEnemy.x && enem.x - 50 < eachEnemy.x) {
            enemies[0].splice(k, 1);
          }
        }      }
      ctx.drawImage(enemyImg, enem.x, enem.y);
    }
  }
} 

// Move enemies
function moveEnemies() {
  for (let i = 0; i < enemiesRow; i++) {
    let enemy = enemies[i];
    for (let j = 0; j < enemy.length; j++) {
      let enem = enemy[j];
      if (Math.round(enem.y) == 200 || enemies[0].length < 5) {
        let enemX = Math.floor(Math.random() * myCanvas.width) - 50;
        enemies[0].push({
          x: enemX < 50 ? 50 : enemX,
          y: 50,
        });
      }

      if (enem.y > myCanvas.height) {
        enemies[0].splice(j, 1);
      }

      enem.y += 1;
    }
  }
}

// Enemy targeting
function enemyTargeting() {
  for (let i = 0; i < enemiesRow; i++) {
    let enemy = enemies[i];
    for (let j = 0; j < enemy.length; j++) {
      const enem = enemy[j];
      if (enem.x + player.w > player.x && enem.x - player.w < player.x) {
        enemyXpos = enem.x;
        enemyYpos = enem.y;
        enemyBulletStatus = true;
      }
    }
  }
}

// Move enemy bullets
function moveEnemyBullets() {
  for (let i = 0; i < enemyBullets.length; i++) {
    let bullet = enemyBullets[i];
    if (bullet.y > myCanvas.height) {
      enemyBullets.splice(i, 1);
    }
    bullet.y += 3;
  }
}

// Enemy bullet collision
function enemyBulletCollision() {
  for (let i = 0; i < enemyBullets.length; i++) {
    let bullet = enemyBullets[i];
    if (
      bullet.y + player.w > player.y &&
      bullet.y - player.w < player.y + player.w &&
      bullet.x + player.w > player.x &&
      bullet.x - player.w < player.x
    ) {
      explodeSound.play();
    }
  }
}

// Draw enemy bullets
function drawEnemyBullets() {
  for (let i = 0; i < enemyBullets.length; i++) {
    const enemyBullet = enemyBullets[i];
    ctx.drawImage(bullImg, enemyBullet.x, enemyBullet.y);
  }
}

// Enemy bullets interval
 function enemyBulletsTimer() {
  setInterval(() => {
    if (enemyBulletStatus) {
      enemyBullets.push({
        x: enemyXpos + 10,
        y: enemyYpos + 30,
      });
      drawEnemyBullets();
      enemyBulletStatus = false;
    }
  }, 1500);
}

enemyBulletsTimer();

// Draw text
function drawText() {
  ctx.fillStyle = "teal";
  ctx.font = "30px fantasy";
  ctx.fillText(`Score: ${player.score}`, myCanvas.width - 130, 50);
}


// Draw all objects game
function draw() {
  drawPlayer();
  drawBullets();
  drawEnemies();
  drawText();
}

// Update running rapidly
function update() {
  movePlayer();
  moveBullets();
  moveEnemies();
  moveEnemyBullets();
  bulletCollision();
  enemyTargeting();
  drawEnemyBullets();
  enemyBulletCollision();
}

function loop() {
  // Clearing the canvas
  ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);

  draw();
  update();
  requestAnimationFrame(loop);
}

loop();
