var Snake = Snake || {};

Snake.init = function(){
  this.grid             = document.getElementById('game-grid');
  this.isFirstGame      = true;
  this.boardWidth       = 21;
  this.boardHeight      = 16;
  this.index            = Math.floor(this.boardHeight*this.boardWidth/2)-1;
  this.direction        = 'ArrowRight';
  this.addABlock        = false;
  this.appleOnBoard     = false;
  this.intervalPeriod   = 80;
  this.score            = 0;
  this.snake            = [];
  this.iCanPress        = true;
  if (this.isFirstGame){
    this.addKeyStrokes();
  }
  this.buildBoard();
};

Snake.addKeyStrokes = function(){
  window.addEventListener('keydown', this.changeDirection);
};

Snake.changeDirection = function(e){
  if (e.key !== Snake.direction && Snake.iCanPress){
    if (((e.key === 'ArrowRight' || e.key === 'ArrowLeft') && (Snake.direction === 'ArrowUp' || Snake.direction === 'ArrowDown'))||((e.key === 'ArrowUp' || e.key === 'ArrowDown') && (Snake.direction === 'ArrowLeft' || Snake.direction === 'ArrowRight'))){
      Snake.direction = e.key;
      Snake.pausePress();
    }
  }
};

Snake.pausePress = function(){
  Snake.iCanPress = false;
  setTimeout(function(){
    Snake.iCanPress = true;
  }, 80);
};

Snake.buildBoard = function(){
  this.isFirstGame    = false;
  var number = (this.boardWidth * this.boardHeight);
  for (var i = 0; i < number; i++) {
    this.grid.innerHTML += '<li class="grid-square" id="square-' + (i+1) + '"></li>';
  }
  this.squares = document.getElementsByClassName('grid-square');
  this.numOfBlocks = this.squares.length;
  this.placeSnake();
};

Snake.placeSnake = function(){
  for (var i = -5; i <= 0 ; i++) {
    this.snake.push(this.squares[i+this.index]);
  }
  Snake.addApple();
  this.startGame();
};
Snake.startGame = function(){
  Snake.gameInAction = setInterval(Snake.renderSnake, Snake.intervalPeriod);
};

Snake.renderSnake = function(){
  for (var i = 0; i < Snake.snake.length; i++) {
    Snake.snake[i].className = 'grid-square';
  }
  for (var j = 0; j < Snake.snake.length; j++) {
    Snake.snake[j].className = 'grid-square occupied';
  }
  Snake.updateSnake();
};

Snake.updateSnake = function(){
  if (!Snake.appleOnBoard){
    setTimeout(Snake.addApple, (Snake.intervalPeriod*2));
  }
  var newBlock;
  if(!Snake.addABlock){
    Snake.snake[0].className = 'grid-square';
    Snake.snake.shift();
  }
  switch(Snake.direction){
    case 'ArrowRight':
      newBlock = Snake.index + 1;
      if(newBlock%Snake.boardWidth === 0){
        newBlock -= Snake.boardWidth;
      }
      break;
  }
  switch(Snake.direction){
    case 'ArrowLeft':
      newBlock = Snake.index - 1;
      if(newBlock%Snake.boardWidth === this.boardWidth-1 || newBlock < 0){
        newBlock += Snake.boardWidth;
      }
      break;
  }
  switch(Snake.direction){
    case 'ArrowUp':
      newBlock = Snake.index - Snake.boardWidth;
      if (newBlock < 0){
        newBlock += (this.numOfBlocks);
      }
      break;
  }
  switch(Snake.direction){
    case 'ArrowDown':
      newBlock = Snake.index + Snake.boardWidth;
      if (newBlock > (this.numOfBlocks - 1)){
        newBlock %= this.numOfBlocks;
      }
      break;
  }
  Snake.index = newBlock;
  Snake.snake.push(Snake.squares[newBlock]);
  Snake.checkForLoss(Snake.squares[newBlock].className);
  if(Snake.squares[newBlock].className.indexOf('apple') === -1){
    Snake.addABlock = false;
  } else {
    Snake.score++;
    Snake.addABlock = true;
    Snake.appleOnBoard = false;
  }
};

Snake.checkForLoss = function(className){
  setTimeout(function(){
    if(className.indexOf('occupied') !== -1){
      clearInterval(Snake.gameInAction);
      Snake.displayLoss();
    }
  }, Snake.intervalPeriod);
};

Snake.addApple = function(){
  while (!Snake.appleOnBoard){
    var potentialApple = Math.floor(Math.random()*Snake.numOfBlocks);
    if(Snake.squares[potentialApple].className.indexOf('occupied') === -1){
      Snake.appleOnBoard = true;
      Snake.squares[potentialApple].className = 'grid-square apple';
    }
  }
};

Snake.displayLoss = function(){
  for (var h = 0; h < Snake.squares.length; h++) {
    Snake.squares[h].className = 'grid-square';
  }
  var message = 'GAME OVER';
  var score   = 'Score: ' + Snake.score;
  var messageIndex = Math.floor(Snake.boardHeight*Snake.boardWidth/2)-1;
  var scoreIndex = Math.floor(Snake.boardHeight*Snake.boardWidth/2)-1+Snake.boardWidth;
  var whereToStartMessage = messageIndex - Math.floor(message.length/2) - message.length - 1;
  var whereToStartScore = scoreIndex - Math.floor(score.length/2) - score.length - 2;
  for (var i = 0; i < message.length; i++) {
    Snake.squares[whereToStartMessage+i].innerText = message[i];
  }
  for (var j = 0; j < score.length; j++) {
    Snake.squares[whereToStartScore+j].innerText = score[j];
  }
};

document.addEventListener('DOMContentLoaded', Snake.init.bind(Snake));
