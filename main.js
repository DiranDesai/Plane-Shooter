const myCanvas = document.querySelector("#myCanvas");
const ctx = myCanvas.getContext("2d");




let leftArrow = false;
let rightArrow = false;
let fireArrow = false;

let enemiesRow = 1;

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

let player = {
  x: myCanvas.width / 2,
  y: myCanvas.height - 100,
  fillColor: "teal"
}

let playerWidth = 30;

const bullets = [];
let bullet = {
  x: player.x + 10,
  y: player.y - 10
}


function drawPlayer() {
  ctx.drawImage(playerImg2, player.x, player.y);
}


function draw(){
  drawPlayer();
  drawEnemies();
  //createBullets();
}

function update() {
  movePlayer();
  loadBullets();
  fireBullets();
  moveEnemies();
  moveEnemyBullets();
  bulletCollision();

  if (enemyBulletStatus) {
    enemyTargeting();
  }
  
}

function movePlayer() {
  if(leftArrow) {
    player.x -= 5;
  } else if (rightArrow) {
    player.x += 5;
  }
}

function createBullets() {
  bulletSound.play();
  bulletSound.currentTime = 0;
  bullets.push({
    x: player.x + 10,
    y: player.y - 10
  })
}

let enemies = [];

function createEnemies() {
  for (let i = 0; i < enemiesRow; i++) {
    enemies[i] = [];
    for (let j = 0; j < 5; j++) {
      enemies[i].push({
        x: Math.floor(Math.random() * myCanvas.width),
        y: -10
       })            
    }
  }
}

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
        }
      }
      ctx.drawImage(enemyImg, enem.x, enem.y);
    }
    
  }
}

function moveEnemies() {
  for (let i = 0; i < enemiesRow; i++) {
    let enemy = enemies[i];
    for (let j = 0; j < enemy.length; j++) {
      let enem = enemy[j];
      if (Math.round(enem.y) == 200 && enemies[0].length < 10) {
        // //createEnemies();
        // enemiesRow += 1;
        console.log(123);
        enemies[0].push({
          x: Math.floor(Math.random() * myCanvas.width),
          y: -10
        })

      }
      enem.y += 0.2
    }
    
  }
}






createEnemies();


function loadBullets() {
  for (let i = 0; i < bullets.length; i++) {
    let bullet = bullets[i];
    ctx.drawImage(bullImg, bullet.x, bullet.y);
  }
}

function bulletCollision() {
  for (let i = 0; i < enemiesRow; i++) {
    let enemy = enemies[i];
    for (let j = 0; j < enemy.length; j++) {
      let enem = enemy[j];
      for (let k = 0; k < bullets.length; k++) {
        let bullet = bullets[k];
        if (bullet.y + playerWidth >  enem.y && bullet.y - playerWidth < enem.y + playerWidth && bullet.x + playerWidth > enem.x && bullet.x - playerWidth < enem.x) {
          explodeSound.play();
          enemies[i].splice(j, 1);
        }
      }
    }
  }
}

let enemyBullets = [];

let enemyBulletStatus = false;

// if (enemyBulletStatus) {
//   console.log("YES!");
//   setInterval(() => {
//     drawEnemyBullets();
//   }, 1000);
// }

setInterval(() => {
  if (enemyBulletStatus) {
    console.log("YES!");
    enemyBullets.push({
      x: enemyXpos,
      y: enemyYpos
    })
    drawEnemyBullets();
  }
}, 1000);


let enemyXpos;
let enemyYpos;

function enemyTargeting() {
  for (let i = 0; i < enemiesRow; i++) {
    let enemy = enemies[i];
    for (let j = 0; j < enemy.length; j++) {
      const enem = enemy[j];
      if (enem.x + playerWidth > player.x && enem.x - playerWidth < player.x) {
        console.log("Shoot!");
        enemyXpos = enem.x
        enemyYpos = enem.y
        enemyBulletStatus = true
      }
    }
    
  }
}


function moveEnemyBullets() {
  for (let i = 0; i < enemyBullets.length; i++) {
    let bullet = enemyBullets[i];
    bullet.y += 3
  }

}

function drawEnemyBullets() {
  console.log(enemyBullets);
  for (let i = 0; i < enemyBullets.length; i++) {
    const enemyBullet = enemyBullets[i];
    ctx.drawImage(bullImg, enemyBullet.x, enemyBullet.y);
  }
}


function fireBullets() {
  for (let i = 0; i < bullets.length; i++) {
    let bullet = bullets[i];
    if (bullet.y <= 10) {
      bullets.splice(i, 1);
    }
    bullet.y -= 3;
  }
}


function loop(){
  ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
  draw();
  update();
  requestAnimationFrame(loop);
}

loop();