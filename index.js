// Importing Sound Effects
const introMusic = new Audio("./music/introSong.mp3");
const shootingSound = new Audio("./music/shoooting.mp3");
const killEnemySound = new Audio("./music/killEnemy.mp3");
const gameOverSound = new Audio("./music/gameOver.mp3");
const heavyWeaponSound = new Audio("./music/heavyWeapon.mp3");
const hugeWeaponSound = new Audio("./music/hugeWeapon.mp3");

introMusic.play();
// -----------------------Basic Environment Setup---------------------------------------
const canvas = document.createElement("canvas");

document.querySelector(".myGame").appendChild(canvas);
canvas.width = innerWidth;
canvas.height = innerHeight;
const context = canvas.getContext("2d");


let difficulty = 2;
const form = document.querySelector("form");
const scoreBoard = document.querySelector(".scoreBoard");
const lightWeaponDamage = 10;
const heavyWeaponDamage = 20;
// const hugeWeaponDamage = 50;
let playerScore = 0;

// -------------------------------Basic Functions------------------------------------------------

// Event Listener for Difficulty form
document.querySelector("input").addEventListener('click', (e) => {
    e.preventDefault();

    // Stopping music
    introMusic.pause();

    // making form invisble
    form.style.display = "none";
    // making scoreBoard invisble
    scoreBoard.style.display = "block";

    //  getting diffculty selected by user
    const userValue = document.getElementById("difficulty").value;
    if (userValue === "Easy") {
        setInterval(spawnEnemy, 2000);
        return (difficulty = 2);
    }
    if (userValue === "Medium") {
        setInterval(spawnEnemy, 1400);
        return (difficulty = 4);
    }
    if (userValue === "Hard") {
        setInterval(spawnEnemy, 1000);
        return (difficulty = 6);
    }
    if (userValue === "Insane") {
        setInterval(spawnEnemy, 700);
        return (difficulty = 10);
    }
});

// Endscreen

const gameoverLoader = () => {
    // Creating endscreen div and play again button and high score element
    const gameOverBanner = document.createElement("div");
    const gameOverBtn = document.createElement("button");
    const highScore = document.createElement("div");

    highScore.innerHTML = `High Score : ${localStorage.getItem("highScore")
            ? localStorage.getItem("highScore")
            : playerScore
        }`;

    const oldHighScore =
        localStorage.getItem("highScore") && localStorage.getItem("highScore");

    if (oldHighScore < playerScore) {
        localStorage.setItem("highScore", playerScore);

        // updating high score html
        highScore.innerHTML = `High Score: ${playerScore}`;
    }

    // adding text to playagain button
    gameOverBtn.innerText = "Play Again";

    gameOverBanner.appendChild(highScore);

    gameOverBanner.appendChild(gameOverBtn);

    // Making reload on clicking playAgain button
    gameOverBtn.onclick = () => {
        window.location.reload();
    };

    gameOverBanner.classList.add("gameover");

    document.querySelector("body").appendChild(gameOverBanner);
};

// ------------------- Creating Player, Enemy, Weapon, Etc Classes-----------------------------------

// creating playerPosition object
const playerPosition = {
    x: canvas.width / 2,
    y: canvas.height / 2,
};

// -------------------------------------------------------Player class---------------------------
class Player {

    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color
    }

    draw() {
        context.beginPath();
        context.arc(this.x, this.y, this.radius, Math.PI / 180 * 0, Math.PI / 180 * 360, false);
        context.fillStyle = this.color;
        context.fill();
    }


}

// -------------------------------------------------------Weapon  class---------------------------

class Weapon {

    constructor(x, y, radius, color, velocity, damage) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
        this.damage = damage;
    }

    draw() {
        context.beginPath();
        context.arc(this.x, this.y, this.radius, Math.PI / 180 * 0, Math.PI / 180 * 360, false);
        context.fillStyle = this.color;
        context.fill();
    }

    update() {
        this.draw();
        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }


}
// -----------------------------------------Huge Weapon class------------------------------------

class HugeWeapon {

    constructor(x, y) {
        this.x = x;
        this.y = y;
        // this.color = "rgb(255,105,180)";
        this.color = "rgb(255,20,147)";
        // this.damage = damage;
    }

    draw() {
        context.beginPath();
        context.fillStyle = this.color;
        context.fillRect(this.x, this.y, 200, canvas.height);
        // context.fill();
    }

    update() {
        this.draw();
        this.x += 20;
        // this.y += this.velocity.y;
    }


}

// -------------------------------------------------------Enemy  class---------------------------
class Enemy {

    constructor(x, y, radius, color, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
    }

    draw() {
        context.beginPath();
        context.arc(this.x, this.y, this.radius, Math.PI / 180 * 0, Math.PI / 180 * 360, false);
        context.fillStyle = this.color;
        context.fill();
    }

    update() {
        this.draw();
        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }


}

// ---------------------------------------Particle class---------------------------------------------------

const fraction = 0.98;
class Particle {

    constructor(x, y, radius, color, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
        this.alpha = 1;
    }

    draw() {
        context.save();
        context.globalAlpha = this.alpha;
        context.beginPath();
        context.arc(this.x, this.y, this.radius, Math.PI / 180 * 0, Math.PI / 180 * 360, false);
        context.fillStyle = this.color;
        context.fill();
        context.restore();
    }

    update() {
        this.draw();
        this.velocity.x *= fraction;
        this.velocity.y *= fraction;

        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.alpha -= 0.01;
        // console.log(this.velocity);
    }


}

// -------------------------------------------------Main Logic Here -------------------------------------------

// Creating Player Object, Weapons Array, Enemy Array, Etc Array


const abhi = new Player(playerPosition.x,playerPosition.y,15,`rgb(${Math.random() * 250},${Math.random() * 250},${Math.random() * 250})`);
const weapons = [];
const hugeWeapons = [];
const enemies = [];
const particles = [];


//----------------------------- Function To Spawn Enemy at Random Location-----------------------------
const spawnEnemy = () => {

    // generating random size for enemy
    const enemySize = Math.random() * (40 - 5) + 5;

    // generating random color for enemy
    // const enemyColor = `rgb(${Math.random() * 250},${Math.random() * 250},${Math.random() * 250})`;
    const enemyColor = `hsl(${Math.floor(Math.random() * 360)},100%,50%)`;

    // random is Enemy Spawn position
    let random;  //random object type

    // Making Enemy Location Random but only from outsize of screen
    if (Math.random() < 0.5) {
        // creation of random object
        // Making X equal to very left off of screen or very right off of screen and setting Y to any where vertically
        random = {
            x: Math.random() < 0.5 ? canvas.width + enemySize : 0 - enemySize,
            y: Math.random() * canvas.height,
        };
    }
    else {
        // Making Y equal to very up off of screen or very down off of screen and setting X to any where horizontally
        random = {
            x: Math.random() * canvas.width,
            y: Math.random() < 0.5 ? canvas.height + enemySize : 0 - enemySize,
        };
    }
    // Finding Angle between center (means Player Position) and enemy position
    const myAngle = Math.atan2(canvas.height / 2 - random.y, canvas.width / 2 - random.x);

    // creating velocity object
    // Making velocity or speed of enemy by multipling chosen difficulty to radian
    const velocity = {
        // x: 1,
        // y: 1,
        x: Math.cos(myAngle) * difficulty,
        y: Math.sin(myAngle) * difficulty,
    }
    // Adding enemy to enemies array
    enemies.push(new Enemy(random.x, random.y, enemySize, enemyColor, velocity))
};

// ------------------------------------------------Creating Animation Function ---------------------------------------

let animationId;
function animation() {

    animationId = requestAnimationFrame(animation);

    // Updating Player Score in Score board in html
    scoreBoard.innerHTML = `Score : ${playerScore}`;

    // context.clearRect(0, 0, canvas.width, canvas.height);

    //clearing canvas on each frame
    context.fillStyle = "rgba(49, 49, 49, 0.4)";
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Drawing Player
    abhi.draw();

    // Generating Particles
    particles.forEach((particle, particleIndex) => {
        if (particle.alpha <= 0) {
            particles.splice(particleIndex, 1);
        }
        else {
            particle.update();
        }
    })

    // Generating Huge weapon
    hugeWeapons.forEach((hugeWeapon, hugeWeaponIndex) => {
        if (hugeWeapon.x > canvas.width) {
            hugeWeapons.splice(hugeWeaponIndex, 1);
        } else {
            hugeWeapon.update();
        }
    });
    // console.log(hugeWeapons);

    //  Generating weapons
    weapons.forEach((weapon, weaponIndex) => {
        // weapon.draw();
        weapon.update();

        // Removing weapons if they are off screen
        if (
            weapon.x + weapon.radius < 1 ||
            weapon.y + weapon.radius < 1 ||
            weapon.x - weapon.radius > canvas.width ||
            weapon.y - weapon.radius > canvas.height) {
            weapons.splice(weaponIndex, 1);
            // console.log(weapons);
        }
    });

    //  Generating enemies
    enemies.forEach((enemy, enemyIndex) => {
        // weapon.draw();
        enemy.update();

        // Finding distance between Player and Enemy
        const distanceBetweenPlayerAndEnemy = Math.hypot(
            abhi.x - enemy.x,
            abhi.y - enemy.y
        );

        // Stopping game if enemy hit player
        if (distanceBetweenPlayerAndEnemy - abhi.radius - enemy.radius < 1) {
            // console.log("Gameover");
            cancelAnimationFrame(animationId);
            gameOverSound.play();
            hugeWeaponSound.pause();
            shootingSound.pause();
            heavyWeaponSound.pause();
            killEnemySound.pause();
            return gameoverLoader();
        }

        // Finding distance between hugeWeapon and enemy
        hugeWeapons.forEach((hugeWeapon) => {
            // Finding Distance between Huge weapon and enemy
            const distanceBetweenHugeWeaponAndEnemy = hugeWeapon.x - enemy.x;

            if (
                distanceBetweenHugeWeaponAndEnemy <= 200 &&
                distanceBetweenHugeWeaponAndEnemy >= -200
            ) {
                // increasing player Score when killing one enemy
                playerScore += 10;
                setTimeout(() => {
                    killEnemySound.play();
                    enemies.splice(enemyIndex, 1);
                }, 0);
            }
        });
        console.log(playerScore);
        weapons.forEach((weapon, weaponIndex) => {
            // Finding Distance between weapon and enemy
            const distanceBetweenWeaponAndEnemy = Math.hypot(
                weapon.x - enemy.x,
                weapon.y - enemy.y
            );

            if (distanceBetweenWeaponAndEnemy - weapon.radius - enemy.radius < 1) {


                // Reducing size of enemy on hit
                if (enemy.radius > weapon.damage + 8) {
                    gsap.to(enemy, {
                        radius: enemy.radius - weapon.damage
                    });
                    setTimeout(() => {
                        weapons.splice(weaponIndex, 1);
                    }, 0)
                }
                // Removing enemy on hit if they are below 18
                else {
                    for (let i = 0; i < enemy.radius * 3; i++) {
                        particles.push(new Particle(weapon.x, weapon.y, Math.random() * 2, "enemy.color", {
                            x: (Math.random() - 0.5) * (Math.random() * 7),
                            y: (Math.random() - 0.5) * (Math.random() * 7),
                        }));
                    }
                    // increasing player Score when killing one enemy
                    playerScore += 10;

                    // Rendering player Score in scoreboard html element
                    scoreBoard.innerHTML = `Score : ${playerScore}`;

                    setTimeout(() => {
                        killEnemySound.play();
                        enemies.splice(enemyIndex, 1);
                        weapons.splice(weaponIndex, 1);
                    }, 0)
                }
            }
        });

    });

    // Making Recursion


}

// setInterval(spawnEnemy, 1000);

// ---------------------------------Adding Event Listeners------------------------

// event Listener for Light Weapon aka left click

canvas.addEventListener("click", (e) => {
    // console.log(e.clientX, e.clientY);
    // console.log(weapons);
    // finding angle between player position(center) and click co-ordinates
    shootingSound.play();
    const myAngle = Math.atan2(e.clientY - canvas.height / 2, e.clientX - canvas.width / 2);

    // creating velocity object
    // Making const speed for light weapon
    const velocity = {
        // x: 1,
        // y: 1,
        x: Math.cos(myAngle) * 5,
        y: Math.sin(myAngle) * 5,
    }

    // console.log(myAngle);
    // Adding light weapon in weapons array
    weapons.push(new Weapon(canvas.width / 2, canvas.height / 2, 5, "white", velocity, lightWeaponDamage));

});

// event Listener for Heavy Weapon aka Right click

canvas.addEventListener("contextmenu", (e) => {

    e.preventDefault();


    if (playerScore <= 0) {
        return;
    }
    heavyWeaponSound.play();
    // Decreasing Player Score for using Heavy Weapon
    playerScore -= 2;
    // Updating Player Score in Score board in html
    scoreBoard.innerHTML = `Score : ${playerScore}`;

    // console.log(e.clientX, e.clientY);
    // console.log(weapons);
    
    // finding angle between player position(center) and click co-ordinates
    const myAngle = Math.atan2(e.clientY - canvas.height / 2, e.clientX - canvas.width / 2);
    // console.log(myAngle);
    // creating velocity object

    // Making const speed for heavy weapon
    const velocity = {
        x: Math.cos(myAngle) * 3,
        y: Math.sin(myAngle) * 3,
    }

    // console.log(myAngle);
    // Adding light weapon in weapons array
    weapons.push(new Weapon(canvas.width / 2, canvas.height / 2, 20, "cyan", velocity, heavyWeaponDamage));

});

// // event Listener for Huge Weapon aka space bar press
addEventListener("keypress", (e) => {
    if (e.key === " ") {
        // console.log(`Key: Spacebar`);
        if (playerScore <= 20) {
            return;
        }
        // Decreasing Player Score for using Huge Weapon
        playerScore -= 20;
        // Updating Player Score in Score board in html
        scoreBoard.innerHTML = `Score : ${playerScore}`;
        //Hugeweapon sound 
        hugeWeaponSound.play();
        // hugeWeapons.push(new HugeWeapon(0, 0, hugeWeaponDamage));
        hugeWeapons.push(new HugeWeapon(0, 0));
    }
})

addEventListener("contextmenu", (e) => {
    e.preventDefault();
})

addEventListener("resize", () => {
    window.location.reload();
});

animation();