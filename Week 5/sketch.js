const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;

// Data objects
let quizQuestions = [
  {
    question: "Welke planeet staat het dichtst bij de zon?",
    options: ["Venus", "Mercurius", "Mars", "Aarde"],
    correctIndex: 1 // Mercurius
  },
  {
    question: "Wat is de hoofdstad van Australië?",
    options: ["Sydney", "Melbourne", "Canberra", "Brisbane"],
    correctIndex: 2 // Canberra
  },
  {
    question: "Hoeveel poten heeft een spin?",
    options: ["6", "8", "10", "12"],
    correctIndex: 1 // 8
  },
  {
    question: "Wie schilderde de Mona Lisa?",
    options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Claude Monet"],
    correctIndex: 2 // Leonardo da Vinci
  },
  {
    question: "Wat is het grootste basiselement van de menselijke botten?",
    options: ["IJzer", "Calcium", "Zink", "Magnesium"],
    correctIndex: 1 // Calcium
  },
  {
    question: "Welke oceaan is de grootste ter wereld?",
    options: ["Atlantische Oceaan", "Indische Oceaan", "Stille Oceaan", "Noordelijke IJszee"],
    correctIndex: 2 // Stille Oceaan
  },
  {
    question: "In welk jaar viel de Berlijnse Muur?",
    options: ["1985", "1989", "1991", "1993"],
    correctIndex: 1 // 1989
  },
  {
    question: "Wat is het chemische symbool voor goud?",
    options: ["Ag", "Fe", "Au", "Gd"],
    correctIndex: 2 // Au
  },
  {
    question: "Hoeveel continenten zijn er op aarde?",
    options: ["5", "6", "7", "8"],
    correctIndex: 2 // 7
  },
  {
    question: "Wat is het snelste landdier ter wereld?",
    options: ["Jachtluipaard", "Leeuw", "Antilope", "Hazewindhond"],
    correctIndex: 0 // Jachtluipaard
  }
];

// Variables
let currentGameState = "START";

let currentQuestionIndex = 0;
let score = 0;
let lastChosenAnswerCorrect = false;

// Positions
let buttonX = 150;
let buttonWidth = 500;
let buttonHeight = 50;
let startButtonY = 220;

function setup() {
  createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  textAlign(CENTER, CENTER);
  textSize(18);
}

function draw() {
  background(240, 244, 248); 

  // Current game state
  if (currentGameState === "START") {
    drawStartScreen();
  } else if (currentGameState === "QUIZ") {
    drawQuizScreen();
  } else if (currentGameState === "FEEDBACK") {
    drawFeedbackScreen();
  } else if (currentGameState === "END") {
    drawEndScreen();
  }
}

// Start screen
function drawStartScreen() {
  fill(33, 150, 243);
  rect(100, 100, 600, 400, 10);

  fill(255);
  textSize(32);
  text("De Grote Algemene Kennis Quiz", CANVAS_WIDTH / 2, 200);

  textSize(20);
  text("Test je kennis met 10 uitdagende vragen!", CANVAS_WIDTH / 2, 280);

  // Start button
  fill(76, 175, 80);
  rect(300, 380, 200, 50, 5);
  fill(255);
  text("START QUIZ", CANVAS_WIDTH / 2, 405);
}

function drawQuestionAndAnswers(questionObject) {
  fill(50);
  textSize(24);
  text(questionObject.question, CANVAS_WIDTH / 2, 120);

  for (let i = 0; i < questionObject.options.length; i++) {
    let buttonY = startButtonY + (i * 70);

    // Check if the mouse is hovering over the button
    if (mouseX > buttonX && mouseX < buttonX + buttonWidth && mouseY > buttonY && mouseY < buttonY + buttonHeight) {
      fill(220, 230, 242);
    } else {
      fill(255);
    }

    stroke(200);
    rect(buttonX, buttonY, buttonWidth, buttonHeight, 5);
    noStroke();
    fill(0);
    textSize(18);
    text(questionObject.options[i], CANVAS_WIDTH / 2, buttonY + (buttonHeight / 2));
  }
}

// Quiz screen
function drawQuizScreen() {
  let currentQuestion = quizQuestions[currentQuestionIndex];
  drawQuestionAndAnswers(currentQuestion);

  // Progress indicator
  fill(100);
  textSize(16);
  text("Vraag " + (currentQuestionIndex + 1) + " van " + quizQuestions.length, CANVAS_WIDTH / 2, 540);
  text("Huidige score: " + score, CANVAS_WIDTH / 2, 565);
}

// Correct or wrong
function drawFeedbackScreen() {
  let currentQuestion = quizQuestions[currentQuestionIndex];

  drawQuestionAndAnswers(currentQuestion);

  // Result
  if (lastChosenAnswerCorrect) {
    fill(76, 175, 80, 230); 
    rect(150, 200, 500, 200, 10);
    fill(255);
    textSize(36);
    text("GOED GEDAAN!", CANVAS_WIDTH / 2, 280);
  } else {
    fill(244, 67, 54, 230);
    rect(150, 200, 500, 200, 10);
    fill(255);
    textSize(36);
    text("HELAAS, FOUT!", CANVAS_WIDTH / 2, 270);
    textSize(18);
    let correctAnswerText = currentQuestion.options[currentQuestion.correctIndex];
    text("Het juiste antwoord was: " + correctAnswerText, CANVAS_WIDTH / 2, 330);
  }

  fill(255);
  textSize(16);
  text("Klik ergens om door te gaan", CANVAS_WIDTH / 2, 370);
}

// End screen indicator
function drawEndScreen() {
  fill(63, 81, 181);
  rect(100, 100, 600, 400, 10);

  fill(255);
  textSize(36);
  text("Quiz Afgelopen!", CANVAS_WIDTH / 2, 180);

  textSize(26);
  text("Jouw eindscore is: " + score + " / " + quizQuestions.length, CANVAS_WIDTH / 2, 260);

  // Evaluation 
  textSize(18);
  if (score === quizQuestions.length) {
    text("Perfect! Je bent een absolute expert!", CANVAS_WIDTH / 2, 320);
  } else if (score >= 6) {
    text("Goed gedaan! Ruim voldoende.", CANVAS_WIDTH / 2, 320);
  } else {
    text("Volgende keer beter! Oefening baart kunst.", CANVAS_WIDTH / 2, 320);
  }

  // Play again 
  fill(255, 152, 0);
  rect(300, 390, 200, 50, 5);
  fill(255);
  textSize(18);
  text("SPEEL OPNIEUW", CANVAS_WIDTH / 2, 415);
}

// Mouse click 
function mousePressed() {
  if (currentGameState === "START") {
    if (mouseX > 300 && mouseX < 500 && mouseY > 380 && mouseY < 430) {
      currentGameState = "QUIZ";
    }
  }
  else if (currentGameState === "QUIZ") {
    let currentQuestion = quizQuestions[currentQuestionIndex];
    for (let i = 0; i < currentQuestion.options.length; i++) {
      let buttonY = startButtonY + (i * 70);

      if (mouseX > buttonX && mouseX < buttonX + buttonWidth && mouseY > buttonY && mouseY < buttonY + buttonHeight) {
        if (i === currentQuestion.correctIndex) {
          score++;
          lastChosenAnswerCorrect = true;
        } else {
          lastChosenAnswerCorrect = false;
        }
        currentGameState = "FEEDBACK";
        break;
      }
    }
  }
  else if (currentGameState === "FEEDBACK") {
    // End screen
    currentQuestionIndex++;

    if (currentQuestionIndex < quizQuestions.length) {
      currentGameState = "QUIZ";
    } else {
      currentGameState = "END";
    }
  }
  else if (currentGameState === "END") { 
    if (mouseX > 300 && mouseX < 500 && mouseY > 390 && mouseY < 440) {
      restartQuiz();
    }
  }
}

// Reset function
function restartQuiz() {
  score = 0;
  currentQuestionIndex = 0;
  currentGameState = "QUIZ";
}
