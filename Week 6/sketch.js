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

// Extra variabelen
let petName = "";
let sick = false;
let bgIndex = 0;
let tintIndex = 0;
let bgColors = [[220, 240, 255], [190, 235, 170], [250, 235, 180], [255, 220, 235]];
let tintColors = [[255, 255, 255], [255, 190, 210], [180, 210, 255], [190, 255, 200]];
let miniTime = 0, miniScore = 0, heartX = 200, heartY = 200; // minigame
let bgButton, tintButton, medButton, miniButton;

// Inventory, munten en meubels
let coins = 10;
let inv = { brokjes: 3, appel: 0, vis: 0, fruitsalade: 0, visschotel: 0, medicijn: 1 };
let foodValues = { brokjes: 25, fruitsalade: 35, visschotel: 50 }; // hoeveel honger het geeft
let prices = { brokjes: 3, appel: 2, vis: 3, medicijn: 5, bed: 20, toy: 25 };
let recipes = { fruitsalade: { appel: 2 }, visschotel: { vis: 1, appel: 1 } };
let MAX_ITEMS = 9; // inventory is beperkt
let hasBed = false, hasToy = false;
let foodSelect, shopSelect, recipeSelect, buyButton, cookButton;

// Foto's, grafiek, schermen
let photos = [];      // foto's als afbeelding
let photoURLs = [];   // foto's om op te slaan
let history = [];     // statistieken over tijd
let view = "main";    // "main", "graph" of "gallery"
let photoButton, galleryButton, graphButton, nameButton;
let message = "", messageTimer = 0;

// Hoe snel de statussen dalen 
let drainSpeed = 0.2;

// Laad de afbeeldingen in met voordat het spel begint
async function setup() {
  createCanvas(400, 540); 
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

  // Tweede rij knoppen
  bgButton = createButton('Achtergrond');
  bgButton.position(20, 390);
  bgButton.mousePressed(() => { bgIndex = (bgIndex + 1) % bgColors.length; saveGame(); });

  tintButton = createButton('Kleur');
  tintButton.position(110, 390);
  tintButton.mousePressed(() => { tintIndex = (tintIndex + 1) % tintColors.length; saveGame(); });

  medButton = createButton('Medicijn');
  medButton.position(165, 390);
  medButton.mousePressed(giveMedicine);

  miniButton = createButton('Minigame');
  miniButton.position(240, 390);
  miniButton.mousePressed(startMini);

  // Derde rij knoppen
  photoButton = createButton('Foto');
  photoButton.position(20, 430);
  photoButton.mousePressed(takePhoto);

  galleryButton = createButton('Galerij');
  galleryButton.position(70, 430);
  galleryButton.mousePressed(() => { view = (view === "gallery") ? "main" : "gallery"; });

  graphButton = createButton('Grafiek');
  graphButton.position(130, 430);
  graphButton.mousePressed(() => { view = (view === "graph") ? "main" : "graph"; });

  nameButton = createButton('Naam');
  nameButton.position(190, 430);
  nameButton.mousePressed(renamePet);

  // Winkel en koken
  shopSelect = createSelect();
  shopSelect.position(20, 470);
  shopSelect.option('Brokjes (3)', 'brokjes');
  shopSelect.option('Appel (2)', 'appel');
  shopSelect.option('Vis (3)', 'vis');
  shopSelect.option('Medicijn (5)', 'medicijn');
  shopSelect.option('Bed (20)', 'bed');
  shopSelect.option('Speelgoed (25)', 'toy');

  buyButton = createButton('Koop');
  buyButton.position(135, 470);
  buyButton.mousePressed(buyItem);

  recipeSelect = createSelect();
  recipeSelect.position(190, 470);
  recipeSelect.option('Fruitsalade (2 appel)', 'fruitsalade');
  recipeSelect.option('Visschotel (vis+appel)', 'visschotel');

  cookButton = createButton('Kook');
  cookButton.position(345, 470);
  cookButton.mousePressed(cookFood);

  // Kies welk eten je geeft bij 'Voeren'
  foodSelect = createSelect();
  foodSelect.position(20, 510);
  foodSelect.option('Brokjes', 'brokjes');
  foodSelect.option('Fruitsalade', 'fruitsalade');
  foodSelect.option('Visschotel', 'visschotel');

  // Opgeslagen spel laden (game speelt door als je weg was)
  await loadGame();
  if (petName === "") {
    petName = prompt("Hoe heet je huisdier?") || "Acchi";
    saveGame();
  }
}

// Is het nacht? (echte klok)
function isNight() {
  let h = new Date().getHours();
  return h >= 22 || h < 7;
}

// Achtergrond verandert als het huisdier slaapt
function draw() {
  // Minigame, grafiek en galerij hebben een eigen scherm
  if (miniTime > 0) {
    drawMini();
    return;
  }
  if (view === "graph") {
    drawGraph();
    return;
  }
  if (view === "gallery") {
    drawGallery();
    return;
  }

  if (currentActivity === "sleeping") {
    background(20, 20, 50); // Nachtblauwe achtergrond
  } else {
    let c = bgColors[bgIndex];
    if (isNight()) { // donkerder 's nachts
      background(c[0] * 0.6, c[1] * 0.6, c[2] * 0.6);
    } else {
      background(c[0], c[1], c[2]);
    }
  }
  
  // Statussen langzaam verminderen over tijd  
  if (frameCount % 60 === 0) {
    let nightMul = isNight() ? 2 : 1;      
    let sickMul = sick ? 2 : 1;            
    let bedMul = hasBed ? 0.6 : 1;         
    let toyMul = hasToy ? 0.6 : 1;         
    if (currentActivity !== "feeding") hunger = max(0, hunger - 1 * sickMul * drainSpeed);
    if (currentActivity !== "sleeping") tiredness = max(0, tiredness - 1.5 * nightMul * bedMul * drainSpeed);
    if (currentActivity !== "playing") happiness = max(0, happiness - 1 * sickMul * toyMul * drainSpeed);
    if (currentActivity !== "cleaning") cleanliness = max(0, cleanliness - 0.5 * drainSpeed);

    // Willekeurige gebeurtenis: ziek worden
    if (!sick && random() < 0.02) {
      sick = true;
      say(petName + " is ziek! Geef medicijn.");
    }

    saveGame();
  }

  // Grafiek
  if (frameCount % 180 === 0) {
    history.push([hunger, tiredness, happiness, cleanliness]);
    if (history.length > 100) history.shift();
  }
  
  // Duur van acties/animaties
  if (actionTimer > 0) {
    actionTimer--;
    if (actionTimer === 0) {
      currentActivity = "idle"; // Terug naar de normale status
    }
  }

  if (messageTimer > 0) messageTimer--;

  drawStatusBars();
  drawInventory();
  drawFurniture();
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

// Inventory 
function drawInventory() {
  noStroke();
  fill(0);
  textSize(11);
  textAlign(LEFT, BASELINE);
  text("Munten: " + coins + "   Brokjes: " + inv.brokjes + "   Appel: " + inv.appel + "   Vis: " + inv.vis, 20, 95);
  text("Fruitsalade: " + inv.fruitsalade + "   Visschotel: " + inv.visschotel + "   Medicijn: " + inv.medicijn, 20, 110);
  if (messageTimer > 0) {
    textSize(13);
    textAlign(CENTER, BASELINE);
    text(message, width / 2, 140);
  }
  textSize(12); // terug naar standaard
  textAlign(LEFT, BASELINE);
}

// Meubels tekenen
function drawFurniture() {
  push();
  textAlign(CENTER, CENTER);
  textSize(40);
  if (hasBed) text("🛏️", 60, 290);
  if (hasToy) text("🧸", 340, 290);
  pop();
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
  } else if (sick || hunger < 30 || tiredness < 30 || happiness < 30) {
    currentImage = imgSad; // Toon verdrietige afbeelding als de status laag is
  }

  // Kleur van het huisdier aanpassen
  let t = tintColors[tintIndex];
  tint(t[0], t[1], t[2]);
  image(currentImage, width / 2, 250, 150, 150);
  noTint();

  // Naam en ziek-teken
  textAlign(CENTER);
  textSize(16);
  fill(isNight() || currentActivity === "sleeping" ? 255 : 0);
  noStroke();
  text(petName + (sick ? " (ziek 🤒)" : ""), width / 2, 330);
  
  pop();
}

// Knop 'Voeren' 
function feedPet() {
  let food = foodSelect.value();
  if (currentActivity !== "idle") return;
  if (inv[food] <= 0) {
    say("Geen " + food + " meer! Koop of kook iets.");
    return;
  }
  inv[food]--;
  currentActivity = "feeding";
  actionTimer = 90; // Duurt 90 frames (ca. 1.5 seconde)
  hunger = min(100, hunger + foodValues[food]);
  cleanliness = max(0, cleanliness - 5); // Wordt een beetje vies van eten
  saveGame();
}

// Knop 'Slapen'
function sleepPet() {
  if (currentActivity === "idle") {
    currentActivity = "sleeping";
    actionTimer = 180; // Duurt 180 frames (ca. 3 seconden)
    tiredness = min(100, tiredness + (hasBed ? 55 : 40)); 
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

// ======================= EXTRA'S =======================

function say(t) {
  message = t;
  messageTimer = 180;
}

// Knop 'Naam': geef je huisdier een nieuwe naam (alles mag)
function renamePet() {
  let newName = prompt("Hoe wil je je huisdier noemen?", petName);
  if (newName === null) return;      // op Annuleren gedrukt
  newName = newName.trim();
  if (newName === "") return;        // lege naam negeren
  petName = newName.slice(0, 20);    // maximaal 20 tekens zodat het past
  say("Je huisdier heet nu " + petName + "!");
  saveGame();
}

// Knop 'Medicijn': maakt een ziek huisdier beter
function giveMedicine() {
  if (!sick) {
    say(petName + " is niet ziek.");
  } else if (inv.medicijn <= 0) {
    say("Geen medicijn meer! Koop er een.");
  } else {
    inv.medicijn--;
    sick = false;
    happiness = min(100, happiness + 10);
    saveGame();
  }
}

// Winkel
function buyItem() {
  let item = shopSelect.value();
  if (coins < prices[item]) {
    say("Te weinig munten!");
    return;
  }
  if (item === "bed") {
    if (hasBed) { say("Je hebt al een bed."); return; }
    hasBed = true;
  } else if (item === "toy") {
    if (hasToy) { say("Je hebt al speelgoed."); return; }
    hasToy = true;
  } else {
    if (inv[item] >= MAX_ITEMS) { say("Inventory vol!"); return; }
    inv[item]++;
  }
  coins -= prices[item];
  saveGame();
}

// Eten maken van grondstoffen
function cookFood() {
  let food = recipeSelect.value();
  let recipe = recipes[food];
  if (inv[food] >= MAX_ITEMS) { say("Inventory vol!"); return; }
  for (let ingredient in recipe) {
    if (inv[ingredient] < recipe[ingredient]) {
      say("Niet genoeg grondstoffen!");
      return;
    }
  }
  for (let ingredient in recipe) {
    inv[ingredient] -= recipe[ingredient];
  }
  inv[food]++;
  say(food + " gemaakt!");
  saveGame();
}

// Minigame
function startMini() {
  if (currentActivity === "idle") {
    miniTime = 600; 
    miniScore = 0;
    moveHeart();
  }
}

function moveHeart() {
  heartX = random(40, 360);
  heartY = random(100, 300);
}

function drawMini() {
  background(255, 235, 245);
  miniTime--;
  if (frameCount % 45 === 0) moveHeart(); // hartje springt weg

  textAlign(CENTER, CENTER);
  noStroke();
  fill(0);
  textSize(40);
  text("💖", heartX, heartY);
  textSize(16);
  text("Score: " + miniScore + "   Tijd: " + ceil(miniTime / 60), 200, 30);
  textAlign(LEFT, BASELINE); // terug naar standaard
  textSize(12);

  if (miniTime === 0) {
    happiness = min(100, happiness + miniScore * 5); 
    coins += miniScore;                              
    say("Minigame klaar! +" + miniScore + " munten");
    saveGame();
  }
}

function mousePressed() {
  if (miniTime > 0 && dist(mouseX, mouseY, heartX, heartY) < 30) {
    miniScore++;
    moveHeart();
  }
}

// foto maken van het huisdier (wordt opgeslagen in de galerij)
function takePhoto() {
  if (view !== "main" || miniTime > 0) return;
  let img = get(0, 0, 400, 340);
  photos.push(img);
  photoURLs.push(img.canvas.toDataURL('image/jpeg', 0.5));
  if (photos.length > 4) {
    photos.shift();
    photoURLs.shift();
  }
  say("Foto opgeslagen in de galerij!");
  saveGame();
}

function drawGallery() {
  background(240);
  fill(0);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(16);
  text("Galerij (klik op 'Galerij' om terug te gaan)", 200, 20);
  for (let i = 0; i < photos.length; i++) {
    image(photos[i], 5 + (i % 2) * 195, 45 + floor(i / 2) * 165, 190, 160);
  }
  if (photos.length === 0) text("Nog geen foto's. Klik op 'Foto'!", 200, 200);
  textAlign(LEFT, BASELINE);
  textSize(12);
}

// Grafiek van de statistieken over tijd
function drawGraph() {
  background(255);
  fill(0);
  noStroke();
  textSize(16);
  text("Statistieken (klik op 'Grafiek' om terug te gaan)", 20, 25);
  textSize(12);

  stroke(0);
  fill(240);
  rect(20, 60, 360, 250);

  let colors = [[50, 200, 50], [240, 200, 50], [255, 100, 150], [50, 150, 255]];
  let names = ["Honger", "Energie", "Geluk", "Hygiëne"];
  for (let s = 0; s < 4; s++) {
    stroke(colors[s][0], colors[s][1], colors[s][2]);
    strokeWeight(2);
    noFill();
    beginShape();
    for (let i = 0; i < history.length; i++) {
      let x = map(i, 0, max(1, history.length - 1), 20, 380);
      let y = map(history[i][s], 0, 100, 310, 60);
      vertex(x, y);
    }
    endShape();
    noStroke();
    fill(colors[s][0], colors[s][1], colors[s][2]);
    text(names[s], 20 + s * 90, 335);
  }
  strokeWeight(1);
}

// Opslaan en laden
function saveGame() {
  localStorage.setItem("huisdier", JSON.stringify({
    hunger, tiredness, happiness, cleanliness,
    petName, sick, bgIndex, tintIndex,
    coins, inv, hasBed, hasToy, photoURLs,
    lastSeen: Date.now()
  }));
}

async function loadGame() {
  let d = JSON.parse(localStorage.getItem("huisdier"));
  if (!d) return;
  hunger = d.hunger; tiredness = d.tiredness;
  happiness = d.happiness; cleanliness = d.cleanliness;
  petName = d.petName; sick = d.sick;
  bgIndex = d.bgIndex; tintIndex = d.tintIndex;
  if (d.coins !== undefined) coins = d.coins;
  if (d.inv) inv = d.inv;
  hasBed = d.hasBed || false;
  hasToy = d.hasToy || false;

  // Foto's terugzetten
  for (let url of (d.photoURLs || [])) {
    photos.push(await loadImage(url));
    photoURLs.push(url);
  }

  // Hoeveel seconden was het spel dicht
  let away = min((Date.now() - d.lastSeen) / 1000, 8 * 3600) * 0.02;
  hunger = max(0, hunger - away);
  tiredness = max(0, tiredness - away * 1.5);
  happiness = max(0, happiness - away);
  cleanliness = max(0, cleanliness - away * 0.5);
}
