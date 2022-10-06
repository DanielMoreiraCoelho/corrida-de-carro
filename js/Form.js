class Form {

    constructor(){


        this.input = createInput(""). attribute("placeholder", "digite seu nome");
        this.button = createButton("jogar");
        this.titleIMG = createImg("./assets/TITULO.png", "nome do jogo");
        this.mensage = createElement("h2");
   }

   elementosPosicao(){
    this.titleIMG.position(120,160);
    this.input.position(width/2 - 110, height/2 - 80);
    this.button.position(width/2 - 90, height/2 - 20);
    this.mensage.position(width/2 - 300, height/2 - 100);
   }

   elementosEstilo(){
    this.titleIMG.class("gameTitle");
    this.input.class("customInput");
    this.button.class("customButton");
    this.mensage.class("greeting");

   }

   clickButon(){
    this.button.mousePressed(()=>{
        this.input.hide();
        this.button.hide();

        var nome = this.input.value();
        var msg = `ola, ${nome} </br> espere o outro jogador entrar`;
        this.mensage.html(msg);
        playerCount = playerCount +1;
        player.name = nome;
        player.index = playerCount;
        player.addJogadores();
        player.updateJogadores(playerCount);
        player.lerDistancia();
    })
   }

   display(){
    this.elementosEstilo();
    this.elementosPosicao();
    this.clickButon();
   }

   hideElement(){
    this.input.hide();
    this.button.hide();
    this.mensage.hide();
    this.titleIMG.position(40,50);
    this.titleIMG.class("gameTitleAfterEffect");
   }
}
