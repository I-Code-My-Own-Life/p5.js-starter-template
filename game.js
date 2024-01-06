// // Our canvas object :
let canvas = {
  width: innerWidth,
  height: innerHeight,
};

let grid = [];
let gridSize = 90;
let row, col;
let currentColor;

let plantImages = [];
let defaultPlantImage;
let selectedPlantIndex = -1; // Index of the selected plant image
let currentPlantImage;
let moneyImg;
let money = 100; // Initial amount of money
let plantMoney = [20, 10, 15];
let bullets = [];

let angryTeacher;
function preload() {
  shootingPlantImg = loadImage("shootingPlant.png");
  moneyPlantImg = loadImage("moneyPlant.png");
  wallnutPlant = loadImage("wallnutPlant.png");
  moneyImg = loadImage("money.png");
  angryTeacher = loadImage("angryTeacher.png");

  // Add all plant images to the plantImages array
  plantImages = [shootingPlantImg, moneyPlantImg, wallnutPlant];
}

let plants = [];
class Plant {
  constructor(x, y, width, height, image, cost) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.image = image; // Each plant has its own image property
    this.cost = cost; // Cost of the plant
    this.shootingInterval = 2000; // 2 seconds interval
    this.lastShotTime = millis();
    this.moneyGenerationInterval = 10000; // 10 seconds interval
    this.lastMoneyGenerationTime = millis();
    this.moneyText = {
      value: 0,
      expirationTime: 0,
    };
  }

  shoot() {
    // Check if it's time to shoot
    if (millis() - this.lastShotTime > this.shootingInterval) {
      // Create a new bullet and add it to the bullets array
      let newBullet = new Bullet(this.x + this.width / 2, this.y);
      bullets.push(newBullet);

      // Update the last shot time
      this.lastShotTime = millis();
    }
  }

  generateMoney() {
    // Check if the plant type is moneyPlantImg
    if (
      this.image === moneyPlantImg &&
      millis() - this.lastMoneyGenerationTime > this.moneyGenerationInterval
    ) {
      money += 5; // Increase money by 5
      this.lastMoneyGenerationTime = millis(); // Update the last money generation time

      // Set money text to display on the plant
      this.moneyText = {
        value: "+5",
        expirationTime: millis() + 1000, // Display for 1 second
      };
    }
  }

  drawMoneyText() {
    // Display money text if it's within the expiration time
    if (millis() < this.moneyText.expirationTime) {
      fill("red"); // Green color
      textSize(20);
      textAlign(CENTER, CENTER);
      text(this.moneyText.value, this.x + this.width / 2, this.y - 10);
    }
  }

  draw() {
    image(this.image, this.x, this.y, this.width, this.height);

    // Check if the plant has shooting behavior
    if (this.image === shootingPlantImg) {
      this.shoot();
    }
    // Generate money for moneyPlantImg
    this.generateMoney();

    // Draw money text
    this.drawMoneyText();
  }
}

class Bullet {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 6;
    this.speed = 5;
    this.color = "black";
  }

  move() {
    this.x += this.speed;
  }

  draw() {
    fill(this.color);
    noStroke();
    ellipse(this.x + 10, this.y + 10, this.radius * 2, this.radius * 2);
  }
}

class Teacher {
  constructor(y) {
    this.x = width; // Start from the rightmost end of the canvas
    this.y = y;
    this.width = 130;
    this.height = 100;
    this.image = angryTeacher;
    this.speed = Math.floor(Math.random() * 3);
  }

  move() {
    this.x -= this.speed;
  }

  draw() {
    image(this.image, this.x , this.y - 50, this.width, this.height);
  }
}

let teachers = [];

function setup() {
  let canvasWidth = min(windowWidth, 1920);
  let canvasHeight = min(windowHeight, 1080);

  createCanvas(canvasWidth, canvasHeight);

  row = floor(height / gridSize);
  col = floor(width / gridSize);
  for (let i = 0; i < row; i++) {
    grid[i] = [];
    for (let j = 0; j < col; j++) {
      if ((i + j) % 2 === 0) {
        grid[i][j] = "#08fc50";
      } else {
        grid[i][j] = "#21c452";
      }
    }
  }
  // Set a default plant image
  defaultPlantImage = plantImages[0];
}

function drawTeachers() {
  for (let i = teachers.length - 1; i >= 0; i--) {
    let teacher = teachers[i];
    teacher.move();
    teacher.draw();

    // Check if a bullet hits the teacher
    for (let j = bullets.length - 1; j >= 0; j--) {
      let bullet = bullets[j];

      if (
        bullet.x > teacher.x &&
        bullet.x < teacher.x + teacher.width &&
        bullet.y > teacher.y &&
        bullet.y < teacher.y + teacher.height
      ) {
        // Remove the bullet
        bullets.splice(j, 1);
        // Remove the teacher
        teachers.splice(i, 1);
        break; // Break to avoid further processing after the teacher is removed
      }
    }
  }
}

function generateTeachers() {
  // Generate teachers every 10 seconds at random rows
  if (millis() % 10000 < 50) {
    let randomRow = floor(random(1, row));
    let newTeacher = new Teacher(randomRow * gridSize + 25);
    teachers.push(newTeacher);
  }
}

function drawPlantImages() {
  // Display plant images at the top
  for (let i = 0; i < plantImages.length; i++) {
    image(plantImages[i], i * gridSize + 10, 15, gridSize - 25, gridSize - 25);

    // Display their amount of money :
    fill(255);
    textSize(21);
    textAlign(LEFT, CENTER);
    text(plantMoney[i], i * gridSize + 5, 15);
    // Draw a stroke around the selected plant at the top
    if (i === selectedPlantIndex) {
      noFill();
      stroke(255, 0, 0); // Red stroke color
      strokeWeight(3);
      rect(i * gridSize, 0, gridSize, gridSize);
    }
  }
}

function drawMoneySection() {
  // Display money image at the top
  image(
    moneyImg,
    (plantImages.length + 1) * gridSize,
    20,
    gridSize,
    gridSize / 2
  );

  // Display current amount of money
  fill(255);
  textSize(20);
  textAlign(LEFT, CENTER);
  text(money, (plantImages.length + 2) * gridSize + 25, gridSize / 2);
}

function drawBullets() {
  // Draw all bullets
  for (let i = bullets.length - 1; i >= 0; i--) {
    let bullet = bullets[i];
    bullet.move();
    bullet.draw();

    // Remove bullets that go off-screen
    if (bullet.x > width + bullet.radius || bullet.x < 0 - bullet.radius) {
      bullets.splice(i, 1);
    }
  }
}

function draw() {
  background("black")
  noStroke();
  // Draw grid
  for (let i = 0; i < row; i++) {
    for (let j = 0; j < col; j++) {
      fill(grid[i][j]);
      rect(j * gridSize, i * gridSize, gridSize, gridSize);
    }
  }

  // Draw all plants
  for (let plant of plants) {
    plant.draw();
    plant.generateMoney();
  }

  // Draw plant images and money section at the top
  drawPlantImages();
  drawMoneySection();

  // Draw all bullets
  drawBullets();

  // Draw all teachers
  drawTeachers();

  // Generate teachers
  generateTeachers();
}

function mousePressed() {
  // Check if the mouse is pressed within the plant image area
  if (mouseY < gridSize && mouseX < plantImages.length * gridSize) {
    // Determine the selected plant image
    selectedPlantIndex = floor(mouseX / gridSize);
    currentPlantImage = plantImages[selectedPlantIndex];
  } else {
    // Plant the selected plant on the grid
    let i = floor(mouseY / gridSize);
    let j = floor(mouseX / gridSize);

    // Ensure not placing anything on the first row of the grid
    if (
      i > 0 &&
      i < row &&
      j >= 0 &&
      j < col &&
      (grid[i][j] === "#08fc50" || grid[i][j] === "#21c452")
    ) {
      // Check if there is already a plant on this grid
      let existingPlant = plants.find(
        (plant) =>
          plant.x === j * gridSize + 25 && plant.y === i * gridSize + 25
      );

      if (!existingPlant && money >= plantMoney[selectedPlantIndex]) {
        // Place plant on the specific grid
        let newPlant = new Plant(
          j * gridSize + 25,
          i * gridSize + 25,
          40,
          60,
          currentPlantImage || defaultPlantImage,
          plantMoney[selectedPlantIndex]
        );
        plants.push(newPlant);
        money -= newPlant.cost; // Deduct money based on the selected plant's cost
      }
    }
  }
}

function windowResized() {
  let canvasWidth = min(windowWidth, 1920);
  let canvasHeight = min(windowHeight, 1080);

  resizeCanvas(canvasWidth, canvasHeight);

  row = floor(height / gridSize);
  col = floor(width / gridSize);
}
