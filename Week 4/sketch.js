// Arrays 
let shapeTypes = [];    // Type vorm: 'cirkel', 'vierkant', 'driehoek', 'poly'
let positionsX = [];    // X/Y-posities van de vormen
let positionsY = [];   
let sizes = [];         // Grootte van de vormen
let speedsX = [];       // Bewegingssnelheid op de X/Y-as
let speedsY = [];       
let colors = [];        // Kleuren van de vormen
let sides = [];         // Aantal zijden 

  // Canvas/Achtergrond 
function setup() {
  createCanvas(800, 600);
  generateArt();
}

function draw() {
  background(150);
  
  // For-loop om alle vormen uit de arrays
  for (let i = 0; i < positionsX.length; i++) {
    
    // Transparante effect
    fill(colors[i]);
    stroke(50, 150);
    strokeWeight(4);
    
    // Bewegende elementen 
    positionsX[i] += speedsX[i];
    positionsY[i] += speedsY[i];
    
    // Vormen binnen stuiteren wanneer ze de rand raken
    if (positionsX[i] < 0 || positionsX[i] > width) {
      speedsX[i] *= -1;
    }
    if (positionsY[i] < 0 || positionsY[i] > height) {
      speedsY[i] *= -1;
    }
    
    // Type vorm getekend moet worden
    if (shapeTypes[i] === 'circle') {
      circle(positionsX[i], positionsY[i], sizes[i]);
    } 
    else if (shapeTypes[i] === 'square') {
      rectMode(CENTER);
      rect(positionsX[i], positionsY[i], sizes[i], sizes[i]);
    } 
    else if (shapeTypes[i] === 'triangle') {
      let r = sizes[i] / 2;
      triangle(
        positionsX[i], positionsY[i] - r,
        positionsX[i] - r * Math.sin(PI/3), positionsY[i] + r * Math.cos(PI/3),
        positionsX[i] + r * Math.sin(PI/3), positionsY[i] + r * Math.cos(PI/3)
      );
    } 
    else if (shapeTypes[i] === 'poly') {
      drawPolygon(positionsX[i], positionsY[i], sizes[i] / 2, sides[i]);
    }
  }
}

// Abstracte kunst te genereren
function generateArt() {
  shapeTypes = [];
  positionsX = [];
  positionsY = [];
  sizes = [];
  speedsX = [];
  speedsY = [];
  colors = [];
  sides = [];
  
  let numberOfShapes = floor(random(15, 40));
  let possibleShapes = ['circle', 'square', 'triangle', 'poly'];
  
  for (let i = 0; i < numberOfShapes; i++) {
    shapeTypes.push(random(possibleShapes));
    positionsX.push(random(50, width - 50));
    positionsY.push(random(50, height - 50));
    sizes.push(random(40, 150));
    
    speedsX.push(random(-2, 2));
    speedsY.push(random(-2, 2));
    
    let r = random(20, 220);
    let g = random(20, 220);
    let b = random(20, 220);
    colors.push(color(r, g, b, 180)); 
    
    sides.push(floor(random(5, 9)));
  }
}

// Backspace-toets
function keyPressed() {
  if (keyCode === BACKSPACE || key === 'Backspace' || keyCode === 8) {
    generateArt();
    return false;
  }
}

// Polygonen
function drawPolygon(x, y, radius, numberOfPoints) {
  let angle = TWO_PI / numberOfPoints;
  beginShape();
  for (let a = 0; a < TWO_PI; a += angle) {
    let sx = x + cos(a) * radius;
    let sy = y + sin(a) * radius;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}
