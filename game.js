console.log("This is a p5.js project. ");

// Our canvas element : 
let canvas = {
    width:innerWidth,
    height:innerHeight
}
// All images and fonts will loaded here : 
let font1;
function preload() {
    font1 = loadFont("Fonts/font22.ttf");
}

// Our setup happens here : 
function setup(){
    createCanvas(canvas.width, canvas.height);
}

// Our loop that draws everything again and again : 
function draw(){
    background("black");
    textSize(50);
    textFont(font1);
    fill("white");
    text('P5.js Template', canvas.width / 2, canvas.height / 2);
    textAlign(CENTER);
}