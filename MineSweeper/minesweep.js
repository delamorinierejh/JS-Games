var MineSweep = MineSweep || {};

MineSweep.startGame = function(){
  this.gameInPlay          = true;
  this.gameGrid            = document.getElementById('grid');
  this.flagDisplay         = document.getElementById('flag-display');
  this.mineDisplay         = document.getElementById('mine-display');
  document.getElementById('reset').addEventListener('click', MineSweep.buildBoard.bind(this));
  this.heading             = document.getElementById('heading');
  this.boardWidth          = 32;
  this.boardHeight         = 16;
  this.mines               = 80;
  this.checkArray          = [(-1-this.boardWidth), -this.boardWidth, 1-this.boardWidth, -1, 1, this.boardWidth-1, this.boardWidth, this.boardWidth+1];
  this.checkArrayColLeft   = [-this.boardWidth, 1-this.boardWidth, 1, this.boardWidth, this.boardWidth+1];
  this.checkArrayColRight  = [(-1-this.boardWidth), -this.boardWidth, -1, this.boardWidth-1, this.boardWidth];
  this.buildBoard();
};

MineSweep.chooseMines = function(){
  while(MineSweep.minesArray.length < MineSweep.mines){
    var randomSquare = '' + Math.floor(Math.random() * (MineSweep.boardWidth * MineSweep.boardHeight));
    if (MineSweep.minesArray.indexOf(randomSquare) === -1){
      MineSweep.minesArray.push(randomSquare);
    }
  }
};

MineSweep.buildBoard = function(){
  this.flagsArray                 = [];
  this.minesArray                 = [];
  this.gameInPlay                 = true;
  this.gameGrid.innerHTML         = '';
  MineSweep.heading.innerText     = 'Mine Sweeper';
  MineSweep.heading.style.color   = 'white';
  this.chooseMines();
  for (var i = 0; i < this.boardWidth*this.boardHeight; i++) {
    this.gameGrid.innerHTML += '<li id="square-' + (i+1) + '" class="grid-square"><button id="' + (i+1) + '" class="grid-button"></button></li>';
  }
  MineSweep.buttons = document.getElementsByClassName('grid-button');
  this.addListenersToButtons(MineSweep.buttons);
};

MineSweep.buildScoreBoard = function(){
  var count = 0;
  for (var i = 0; i < MineSweep.buttons.length; i++) {
    if (MineSweep.buttons[i].innerText === 'F'){
      count++;
    }
  }
  this.flagDisplay.innerText = MineSweep.mines - count;
  this.mineDisplay.innerText = this.mines;
  if (this.flagsArray.length === this.mines){
    this.checkForWin();
  }
};

MineSweep.addListenersToButtons = function(buttons){
  for (var i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', MineSweep.addFlag);
    buttons[i].addEventListener('dblclick', MineSweep.squareClick);
  }
  this.buildScoreBoard();
};

MineSweep.squareClick = function(){
  if(MineSweep.gameInPlay){
    if(MineSweep.minesArray.includes(this.id)){
      document.getElementById('square-' + this.id).innerText = 'M';
      MineSweep.heading.innerText = 'Game over!';
      MineSweep.heading.style.color = 'red';
      MineSweep.gameInPlay = false;
      this.style.display = 'none';
    } else {
      var newButton = document.getElementById(this.id);
      MineSweep.lookAtSurroundingSquares(newButton);
    }
    MineSweep.buildScoreBoard();
  }
};

MineSweep.addFlag = function(){
  if(MineSweep.gameInPlay){
    if (this.innerText === 'F'){
      this.innerText = '';
      MineSweep.flagsArray.splice(MineSweep.flagsArray.indexOf(this.id));
    } else if (MineSweep.flagsArray.length <= MineSweep.mines){
      this.innerText = 'F';
      MineSweep.flagsArray.push(this.id);
    }
    MineSweep.buildScoreBoard();
  }
};

MineSweep.lookAtSurroundingSquares = function(button){
  var array;
  if (button.id%MineSweep.boardWidth === 0){
    array = MineSweep.checkArrayColRight;
  } else if(button.id%MineSweep.boardWidth === 1){
    array = MineSweep.checkArrayColLeft;
  } else {
    array = MineSweep.checkArray;
  }
  MineSweep.runCheck(button, array);
};

MineSweep.runCheck = function(button, array){
  button.remove();
  var id = parseFloat(button.id);
  var count = 0;
  for (var i = 0; i < array.length; i++) {
    var cell = '' + (array[i] + id);
    if (MineSweep.minesArray.includes(cell)){
      count++;
    }
  }
  if (count > 0){
    var element = document.getElementById('square-' + id);
    element.innerText = count;
    element.className += (' color-' + count);
  } else {
    for (var j = 0; j < array.length; j++) {
      var hold = array[j] + id;
      var newButton = document.getElementById('' + hold);
      if (newButton){
        MineSweep.lookAtSurroundingSquares(newButton);
      }
    }
  }
};

MineSweep.checkForWin = function(){
  var isWin = true;
  for (var i = 0; i < MineSweep.flagsArray.length; i++) {
    if (MineSweep.minesArray.indexOf(MineSweep.flagsArray[i]) === -1){
      isWin = false;
      break;
    }
  }
  if (isWin){
    MineSweep.heading.innerText = 'You\'ve won!';
    MineSweep.heading.style.color = '#7fc97f';
    this.gameInPlay = false;
  }
};

window.addEventListener('DOMContentLoaded', MineSweep.startGame.bind(MineSweep));
