class Player {
  constructor(){
    this.name = null;
    this.index = null;

    this.positionX = 0;
    this.positionY = 0;

    this.rank = 0;
    
    this.score = 0;

    this.fuel = 185;

    this.life = 185;
  }

  lerJogadores(){
    database.ref("playerCount").on("value", data => {
        playerCount = data.val();
    })
  }

  updateJogadores(count){
    database.ref("/").update({
        playerCount: count
    })
  }

  addJogadores(){
    var playerIndex = "players/player" + this.index;

    if(this.index === 1){
      this.positionX = width/2 -100;

    }else{
      this.positionX = width/2 +100;
    }

    database.ref(playerIndex).set({
        name: this.name, 
        positionX: this.positionX,
        positionY: this.positionY,
        rank: this.rank, score: this.score
    })
  }

  static lerTodosOsJog(){
    database.ref("players").on("value", data => {
      allPlayers = data.val();
      //allPlayers [0] = player1
      //allPlayers [1] = player2
    })

  }

  update(){
    var playerIndex = "players/player" + this.index;
    database.ref(playerIndex).update({
      positionX: this.positionX,
      positionY: this.positionY,
      rank: this.rank, score: this.score
    })
  }

  lerDistancia(){
    var playerIndex = "players/player" + this.index;
    database.ref(playerIndex).on("value", data => {
      var dados = data.val();
      this.positionX = dados.positionX;
      this.positionY = dados.positionY;
    })
  }

  lerCarrosNaFinal(){
    database.ref("carAtEnd").on("value", data => {
      this.rank = data.val();
    })
  }

 static updateCarsNaFinal(rank){
    database.ref("/").update({
      carAtEnd: rank
  })
  }
}