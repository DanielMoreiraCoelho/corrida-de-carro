class Game {
  constructor(){
    this.resetTitle = createElement("h2")
    this.resetButton = createButton("")
    this.placarTitle = createElement("h2")
    this.jogador1 = createElement("h2")
    this.jogador2 = createElement("h2")
    this.playerMove = false;
  }

  lerEstado(){
    var gameStateRef = database.ref("gameState");
    gameStateRef.on("value", function(data){
      gameState = data.val();
    })
  }

  updateEstado(state){
    database.ref("/").update({
      gameState: state
    })
  }

  elementGame(){
    this.resetTitle.html("reiniciar jogo");
    this.resetTitle.position(width/2 + 200, 40);

    this.resetTitle.class("resetText");

    this.resetButton.class("resetButton");

    this.resetButton.position(width/2 + 230, 100);

    //mostrar placar e dados dos jogadores
    this.placarTitle.html("placar");
    this.placarTitle.position(width/3 - 60, 40);
    this.placarTitle.class("resetText");
    
    this.jogador1.position(width/3 - 50, 80);
    this.jogador1.class("leadersText");

    this.jogador2.position(width/3 - 50, 130);
    this.jogador2.class("leadersText");
   }

  start(){
    form = new Form();
    form.display();

    player = new Player();
    player.lerJogadores();
  
    //criando os carros do jogo
    carro1 = createSprite(width/2 - 50, height - 100);
    carro1.addImage("carro1", carroIMG1);
    carro1.scale = 0.07;

    carro2 = createSprite(width/2 + 100, height - 100);
    carro2.addImage("carro2", carroIMG2);
    carro2.scale = 0.07;

    carros = [carro1, carro2]
    //carros [0] = carro1
    //carros [1] = carro2

    fuels = new Group();
    coins = new Group();
    obstacles = new Group();

    //posiçoes predefinida dos obstaculos
    var obstaclesPositions = [ 
      { x: width / 2 + 250, y: height - 800, image: obstacle2IMG }, 
      { x: width / 2 - 150, y: height - 1300, image: obstacle1IMG }, 
      { x: width / 2 + 250, y: height - 1800, image: obstacle1IMG }, 
      { x: width / 2 - 180, y: height - 2300, image: obstacle2IMG }, 
      { x: width / 2, y: height - 2800, image: obstacle2IMG }, 
      { x: width / 2 - 180, y: height - 3300, image: obstacle1IMG }, 
      { x: width / 2 + 180, y: height - 3300, image: obstacle2IMG }, 
      { x: width / 2 + 250, y: height - 3800, image: obstacle2IMG }, 
      { x: width / 2 - 150, y: height - 4300, image: obstacle1IMG }, 
      { x: width / 2 + 250, y: height - 4800, image: obstacle2IMG }, 
      { x: width / 2, y: height - 5300, image: obstacle1IMG }, 
      { x: width / 2 - 180, y: height - 5500, image: obstacle2IMG } ];    

    this.addSprites(fuels, 4, fuelIMG, 0.02);
    this.addSprites(coins, 18, coinIMG, 0.09);
    this.addSprites(obstacles, obstaclesPositions.length, obstacle1IMG, 0.04, obstaclesPositions);
  }

  addSprites(spriteGroup, numberOfSprite, spriteIMG, spriteScale, position = []){
    for(var e = 0; e < numberOfSprite; e = e+1){
      var x, y;

      //condiçao para os obstaculos
      if(position.length > 0){
        x = position [e].x;
        y = position [e].y;
        spriteIMG = position [e].image;
      }
      //condiçao para posiçoes aleatorias
      else{
        x = random(width/2 + 200, width/2 - 200);
        y = random(-height*4.5, height - 400);
      }
      

      var sprite = createSprite(x,y);
      sprite.addImage(spriteIMG);

      sprite.scale = spriteScale;

      spriteGroup.add(sprite);
    }
  }

  play(){
    console.log("o jogo começou");
    form.hideElement();

    this.elementGame();

    this.resetarJogo();
    
    Player.lerTodosOsJog();

    player.lerCarrosNaFinal();

    if(allPlayers !== undefined){
      image(pistaIMG, 0, -height*5, width, height*6);

      var index = 0;

      this.mostrarPlacar();
      this.mostrarVida();
      this.mostrarGasolina();

      for(var plr in allPlayers){
        index = index +1;

        var x = allPlayers[plr].positionX;
        var y = height - allPlayers[plr].positionY;

        carros[index - 1].position.x = x;
        carros[index - 1].position.y = y;

        if(index === player.index){
          stroke(10);
          fill("red");
          ellipse(x,y, 60, 60);

          this.pegarGasolina(index);
          this.pegarMoeda(index);

          //posiçao da camera na direção y do carro
          camera.position.y = carros[index - 1].position.y;

        }
      }

      this.playerControl();

      //escreva movimento automatico
      if(this.playerMove === true){
        player.positionY = player.positionY +2;
        
        player.update();
      }

      // linha de chegada
      const linhaDeChegada = height*6 - 100;
      if(player.positionY > linhaDeChegada){
        gameState = 2;
        player.rank = player.rank +1;
        Player.updateCarsNaFinal(player.rank);
        player.update();
        this.mostrarRank();

      }

      drawSprites();
    }
  }

  playerControl(){
    if(keyIsDown(UP_ARROW)){
      player.positionY = player.positionY +10;
      player.update();
      this.playerMove = true;
    }

    if(keyIsDown(LEFT_ARROW) && player.positionX > width/2 - 300){
      player.positionX = player.positionX -5;
      player.update();
    }

    if(keyIsDown(RIGHT_ARROW) && player.positionX < width/2 + 300){
      player.positionX = player.positionX +5;
      player.update();
    }
  }

  resetarJogo(){
    this.resetButton.mousePressed(()=> {
      database.ref("/").set({
        gameState: 0, 
        playerCount: 0, 
        players: {},
        carAtEnd: 0
      });
      window.location.reload();
    })
  }

  mostrarPlacar(){
    var texto1, texto2;
    var players = Object.values(allPlayers);

    if(
      (players[0].rank === 0 && players[1].rank === 0 ) || (players[0].rank === 1)
    ){
      texto1 = players[0].rank +"&emsp;" + players[0].name + "&emsp;" + players[0].score;
      texto2 = players[1].rank +"&emsp;" + players[1].name + "&emsp;" + players[1].score;
   }

   if(players[1] === 1){
    texto1 = players[1].rank +"&emsp;" + players[1].name + "&emsp;" + players[1].score;
    texto2 = players[0].rank +"&emsp;" + players[0].name + "&emsp;" + players[0].score;
   }
   this.jogador1.html(texto1);
   this.jogador2.html(texto2);

  }

  pegarGasolina(index){
    carros[index -1].overlap(fuels, function(collector, collected){
      player.fuel = 185;
      collected.remove();
    })

    //reduzindo gasolina
    if(player.fuel > 0 && this.playerMove === true){
      player.fuel = player.fuel -0.3;
    }

    if(player.fuel <= 0){
      gameState = 2;

      this.gameOver();
    }
  }

  pegarMoeda(index){
    carros[index -1].overlap(coins, function(collector, collected){
      player.score = player.score +21;
      player.update();
      collected.remove();
    })
  }

  mostrarVida(){
    push();
    image(lifeIMG, width/2 - 130, height - player.positionY - 400, 20, 20);
    fill("white");
    rect(width/2 - 100, height - player.positionY - 400, 185, 20);
    fill("#f50057");
    rect(width/2 - 100, height - player.positionY - 400, player.life, 20);
    noStroke();
    pop();
  }

  mostrarGasolina(){
    push();
    image(fuelIMG, width/2 - 130, height - player.positionY - 350, 20, 20);
    fill("white");
    rect(width/2 - 100, height - player.positionY - 350, 185, 20);
    fill("#ffc400");
    rect(width/2 - 100, height - player.positionY - 350, player.fuel, 20);
    noStroke();
    pop();
  }

  mostrarRank(){
    swal({
      title: `incrivel! ${"\n"} ${player.rank} º lugar`,
      text: "parabens",
      imageUrl: "https://raw.githubusercontent.com/vishalgaddam873/p5-multiplayer-car-race-game/master/assets/cup.png",
      imageSize: "100x100",
      confirmButtonText: "obrigado por jogar"
    })
  }

  gameOver(){
    swal({
      title: "fim de jogo",
      text: "voce perdeu",
      imageUrl: "https://cdn.shopify.com/s/files/1/1061/1924/products/Thumbs_Down_Sign_Emoji_Icon_ios10_grande.png",
      imageSize: "100x100",
      confirmButtonText: "obrigado por jogar"
    })
  }
}
