let stoplichtkleur = 0;


function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(220);

fill("#464e61")  
rect(200, 200, 30, 100)

fill("#262b3b ")
rect(212.5, 300, 5, 100)

fill("#22282e ")

// rode licht - waarde 0
  if (stoplichtkleur == 0) {
    fill("red")
  } else {
    fill("#22282e")
  }
  ellipse(215, 215, 30, 30)

  // oranje licht - 1
  if (stoplichtkleur == 1) {
    fill("orange")
  } else {
    fill("#22282e")
  }
  ellipse(215, 250, 30, 30)

  // groene licht - 2
  if (stoplichtkleur == 2) {
    fill("green")
  } else {
    fill("#22282e")
  }
  ellipse(215, 285, 30, 30)
}
function keyPressed() {
  if (keyCode == 13) {
    stoplichtkleur = stoplichtkleur + 1;
    if (stoplichtkleur > 2) {
      stoplichtkleur = 0;
    }
  }
}

