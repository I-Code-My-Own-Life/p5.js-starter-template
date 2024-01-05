// console.log("This is a p5.js project. ");
// // Our canvas object :
let canvas = {
  width: innerWidth,
  height: innerHeight,
};

let grid = [];
let gridSize = 100;
let row, col;
let currentColor;

let plantImg;
function preload() {
  plantImg = loadImage("image.png");
}

let plants = [];
class Plant {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
  draw() {
    image(plantImg, this.x, this.y, this.width, this.height);
  }
}


function setup() {
    let canvasWidth = min(windowWidth, 1920);
    let canvasHeight = min(windowHeight, 1080);
  
    createCanvas(canvasWidth, canvasHeight + 50);
  
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
  }
  
  function draw() {
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
    }
  }
  
  function mousePressed() {
    let i = floor(mouseY / gridSize);
    let j = floor(mouseX / gridSize);
  
    if (
      i >= 0 &&
      i < row &&
      j >= 0 &&
      j < col &&
      (grid[i][j] === "#08fc50" || grid[i][j] === "#21c452")
    ) {
      // Place plant on the specific grid
      let newPlant = new Plant(j * gridSize + 25, i * gridSize + 25, 40, 60);
      plants.push(newPlant);
    }
  }
  
  function windowResized() {
    let canvasWidth = min(windowWidth, 1920);
    let canvasHeight = min(windowHeight, 1080);
  
    resizeCanvas(canvasWidth, canvasHeight);
  
    row = floor(height / gridSize);
    col = floor(width / gridSize);
  }