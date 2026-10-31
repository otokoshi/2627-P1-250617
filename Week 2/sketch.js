let sunX = 0;
let cloudX = 800;
let carX = 0;
let carSpeed = 0;
let carColor;
let trafficLightState = 0; 
let leafWiggle = 0;

function setup() {
  createCanvas(800, 600);
  carColor = color(220, 50, 50);
}

function draw() {
  let cycleTime = millis() % 20000; 
  let isNight = cycleTime > 10000;
  
  let skyColor;
  let groundColor;
  let mountainColor;
  
  if (!isNight) {
    skyColor = color(135, 206, 235);
    groundColor = color(50, 200, 50);
    mountainColor = color(100, 130, 105);
  } else {
    skyColor = color(20, 24, 50);
    groundColor = color(20, 70, 20);
    mountainColor = color(40, 50, 60);
  }
  
  background(skyColor);

  if (!isNight) {
    noStroke();
    fill(255, 223, 0);
    circle(sunX, 80, 70);
  } else {
    noStroke();
    fill(230, 230, 250);
    circle(sunX, 80, 65);
    fill(skyColor);
    circle(sunX + 15, 75, 55);
  }
  
  sunX += 1;
  if (sunX > width + 50) sunX = -50;

  fill(mountainColor);
  noStroke();
  triangle(100, 450, 300, 200, 500, 450);
  triangle(350, 450, 550, 150, 750, 450);

  leafWiggle += 0.05;

  drawMovingTree(150, 365, 0.8);
  drawMovingTree(680, 365, 0.7);

  fill(groundColor);
  rect(0, 450, width, 150);
  fill(80);
  rect(0, 480, width, 80);

  drawStreetLight(250, 350, isNight);
  drawStreetLight(550, 350, isNight);

  if (!isNight) fill(255); else fill(80, 90, 110);
  noStroke();
  circle(cloudX, 120, 60);
  circle(cloudX + 30, 110, 70);
  circle(cloudX + 60, 120, 60);
  cloudX -= 1.5;
  if (cloudX < -100) cloudX = width + 50;

  if (trafficLightState === 0) {
    carSpeed = 0;
  } else if (trafficLightState === 1) {
    carSpeed = 4;
  } else if (trafficLightState === 2) {
    carSpeed = 1.5;
  }

  carX += carSpeed;
  
  if (carX > width + 150) {
    carX = -150; 
    carColor = color(random(50, 255), random(50, 255), random(50, 255));
  }

  drawCar(carX, 490, isNight);

  drawTrafficLight(650, 300);
}

function drawMovingTree(x, y, scaleFactor) {
  push();
  translate(x, y);
  scale(scaleFactor);
  
  fill(101, 67, 33);
  rect(10, 60, 20, 60);
  
  let offset = sin(leafWiggle) * 3;
  
  fill(34, 139, 34);
  circle(20 + offset, 50, 70);
  circle(-5 + offset, 20, 60);
  circle(45 + offset, 20, 60);
  circle(20 + offset, -10, 70);
  
  pop();
}

function drawStreetLight(x, y, active) {
  push();
  translate(x, y);
  
  stroke(60);
  strokeWeight(5);
  line(0, 130, 0, 0);
  line(0, 0, 20, 0);
  
  noStroke();
  fill(40);
  rect(15, -2, 15, 8, 2);
  
  if (active) {
    fill(255, 255, 150, 50);
    triangle(22, 6, -10, 130, 55, 130);
    
    fill(255, 255, 200);
    circle(22, 6, 8);
  }
  pop();
}

function drawCar(x, y, nightMode) {
  push();
  translate(x, y);

  if (nightMode && carSpeed > 0) {
    fill(255, 255, 200, 80);
    triangle(140, 30, 260, 15, 260, 55);
  }

  fill(carColor);
  rect(0, 20, 140, 30, 5);

  fill(30, 30, 30, 150);
  rect(30, 0, 70, 25, 10);

  fill(200, 230, 255);
  rect(40, 5, 20, 15, 2);
  rect(65, 5, 25, 15, 2);

  fill(0);
  circle(30, 50, 28);
  circle(110, 50, 28);
  fill(200);
  circle(30, 50, 12);
  circle(110, 50, 12);

  if (nightMode) fill(255, 255, 0); else fill(255, 200, 0);
  circle(138, 28, 8);

  pop();
}

function drawTrafficLight(x, y) {
  push();
  translate(x, y);

  fill(100);
  rect(12, 100, 6, 80);
  fill(30);
  rect(0, 0, 30, 100, 5);

  let redColor = color(80, 0, 0);
  let yellowColor = color(80, 80, 0);
  let greenColor = color(0, 80, 0);

  if (trafficLightState === 0) redColor = color(255, 0, 0);
  else if (trafficLightState === 1) greenColor = color(0, 255, 0);
  else if (trafficLightState === 2) yellowColor = color(255, 200, 0);

  fill(redColor); circle(15, 20, 22);
  fill(yellowColor); circle(15, 50, 22);
  fill(greenColor); circle(15, 80, 22);

  pop();
}

function keyPressed() {
  if (key === 'Enter') {
    if (trafficLightState === 0) {
      trafficLightState = 1;
    } else if (trafficLightState === 1) {
      trafficLightState = 2;
    } else if (trafficLightState === 2) {
      trafficLightState = 0;
    }
  }
}