var form, game, player;
var bgIMG;
var gameState;
var playerCount;
var pistaIMG;
var carro1, carro2;
var carroIMG1, carroIMG2;
var carros;
var allPlayers;
var fuelIMG, fuels, coinIMG, coins;
var obstacle1IMG, obstacle2IMG, obstacles;
var lifeIMG;

function preload() {
  bgIMG = loadImage("assets/planodefundo.png");

  pistaIMG = loadImage("assets/PISTA.png");

  carroIMG1 = loadImage("assets/car1.png");
  carroIMG2 = loadImage("assets/car2.png");

  fuelIMG = loadImage("assets/fuel.png");

  coinIMG = loadImage("assets/goldCoin.png");

  obstacle1IMG = loadImage("assets/obstacle1.png");
  obstacle2IMG = loadImage("assets/obstacle2.png");

  lifeIMG = loadImage("assets/life.png");
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  database = firebase.database();

  game = new Game();
  game.start();
  game.lerEstado();
}

function draw() {
  background(bgIMG);

  if(playerCount === 2){
    game.updateEstado(1)
  }
  if(gameState == 1){
    game.play();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
