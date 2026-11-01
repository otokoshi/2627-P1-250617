// Het huisdier
let imgIdle, imgFeeding, imgSleeping, imgPlaying, imgCleaning, imgSad;

// Statusvariabelen 
let hunger = 100;
let tiredness = 100;
let happiness = 100;
let cleanliness = 100;

// Huidige actie of animatie 
let currentActivity = "idle"; // Opties: "idle", "feeding", "sleeping", "playing", "cleaning"
let actionTimer = 0;

// Knoppen voor de interactie
let feedButton, sleepButton, playButton, cleanButton;

// Laad de afbeeldingen in met voordat het spel begint
async function setup() {
  createCanvas(400, 400);
  imgIdle = await loadImage('acchinormal.jpg');
  imgFeeding = await loadImage('acchinormal.jpg');
  imgSleeping = await loadImage('zleep.png');
  imgPlaying = await loadImage('acchinormal.jpg');
  imgCleaning = await loadImage('acchinormal.jpg');
  imgSad = await loadImage('acchi.png');
  
  // Interactieve knoppen 
  feedButton = createButton('Voeren');
  feedButton.position(20, 350);
  feedButton.mousePressed(feedPet);

  sleepButton = createButton('Slapen');
  sleepButton.position(110, 350);
  sleepButton.mousePressed(sleepPet);

  playButton = createButton('Spelen');
  playButton.position(200, 350);
  playButton.mousePressed(playWithPet);

  cleanButton = createButton('Schoonmaken');
  cleanButton.position(290, 350);
  cleanButton.mousePressed(cleanPet);
}

// Achtergrond verandert als het huisdier slaapt
function draw() {
  if (currentActivity === "sleeping") {
    background(20, 20, 50); // Nachtblauwe achtergrond
  } else {
    background(220, 240, 255); // Lichtblauwe achtergrond
  }
  
  // Statussen langzaam verminderen over tijd  
  if (frameCount % 60 === 0) { // Ongeveer elke seconde
    if (currentActivity !== "feeding") hunger = max(0, hunger - 1);
    if (currentActivity !== "sleeping") tiredness = max(0, tiredness - 1.5);
    if (currentActivity !== "playing") happiness = max(0, happiness - 1);
    if (currentActivity !== "cleaning") cleanliness = max(0, cleanliness - 0.5);
  }
  
  // Duur van acties/animaties
  if (actionTimer > 0) {
    actionTimer--;
    if (actionTimer === 0) {
      currentActivity = "idle"; // Terug naar de normale status
    }
  }
  drawStatusBars();
  drawPet();
}

// Functie om de statusbalken te tekenen
function drawStatusBars() {
  stroke(0);
  strokeWeight(1);
  
  // Honger  (Groen)
  fill(200); rect(20, 20, 150, 15);
  fill(50, 200, 50); rect(20, 20, map(hunger, 0, 100, 0, 150), 15);
  fill(0); noStroke(); text("Honger", 20, 15);
  
  // Energie/Slaap (Geel)
  stroke(0); fill(200); rect(230, 20, 150, 15);
  fill(240, 200, 50); rect(230, 20, map(tiredness, 0, 100, 0, 150), 15);
  fill(0); noStroke(); text("Energie", 230, 15);
  
  // Geluk (Roze)
  stroke(0); fill(200); rect(20, 60, 150, 15);
  fill(255, 100, 150); rect(20, 60, map(happiness, 0, 100, 0, 150), 15);
  fill(0); noStroke(); text("Geluk", 20, 55);
  
  // Hygiëne (Blauw)
  stroke(0); fill(200); rect(230, 60, 150, 15);
  fill(50, 150, 255); rect(230, 60, map(cleanliness, 0, 100, 0, 150), 15);
  fill(0); noStroke(); text("Hygiëne", 230, 55);
}

// Afbeelding verandert op basis van status
function drawPet() {
  push();
  imageMode(CENTER);
  let currentImage = imgIdle; // Standaard afbeelding
  if (currentActivity === "sleeping") {
    currentImage = imgSleeping;
  } else if (currentActivity === "feeding") {
    currentImage = imgFeeding;
  } else if (currentActivity === "playing") {
    currentImage = imgPlaying;
  } else if (currentActivity === "cleaning") {
    currentImage = imgCleaning;
  } else if (hunger < 30 || tiredness < 30 || happiness < 30) {
    currentImage = imgSad; // Toon verdrietige afbeelding als de status laag is
  }
  image(currentImage, width / 2, height / 2 + 30, 150, 150);
  
  pop();
}

// Knop 'Voeren'
function feedPet() {
  if (currentActivity === "idle") {
    currentActivity = "feeding";
    actionTimer = 90; // Duurt 90 frames (ca. 1.5 seconde)
    hunger = min(100, hunger + 25);
    cleanliness = max(0, cleanliness - 5); // Wordt een beetje vies van eten
  }
}

// Knop 'Slapen'
function sleepPet() {
  if (currentActivity === "idle") {
    currentActivity = "sleeping";
    actionTimer = 180; // Duurt 180 frames (ca. 3 seconden)
    tiredness = min(100, tiredness + 40);
  }
}

// Knop 'Spelen'
function playWithPet() {
  if (currentActivity === "idle") {
    currentActivity = "playing";
    actionTimer = 120; // Duurt 120 frames (ca. 2 seconden)
    happiness = min(100, happiness + 30);
    tiredness = max(0, tiredness - 15); // Kost energie om te spelen
  }
}

// Knop 'Schoonmaken'
function cleanPet() {
  if (currentActivity === "idle") {
    currentActivity = "cleaning";
    actionTimer = 90; // Duurt 90 frames (ca. 1.5 seconde)
    cleanliness = min(100, cleanliness + 40);
  }
}
