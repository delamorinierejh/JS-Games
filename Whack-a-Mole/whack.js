var Whack = Whack || {};

Whack.init = function(){
  this.heading = document.getElementById('heading');
  this.gameGrid = document.getElementById('grid');
  this.scoreDisplay = document.getElementById('score');
  this.livesDisplay = document.getElementById('lives');
  this.width = 4;
  this.height = 4;
  this.interval = 1;
  this.score = 0;
  this.lives = 3;
  this.setUpGrid();
};

Whack.setUpGrid = function(){
  var num = Whack.width*Whack.height;
  for (var i = 0; i < num; i++) {
    Whack.gameGrid.innerHTML += '<li class="game-square" id="'+ i +'"></li>';
  }
  Whack.setUpSquareListeners();
};

Whack.setUpSquareListeners = function(){
  Whack.squares = document.getElementsByClassName('game-square');
  for (var i = 0; i < Whack.squares.length; i++) {
    Whack.squares[i].addEventListener('click', Whack.squareClicked);
  }
  Whack.addToBoard();
};

Whack.squareClicked = function(){
  if(this.innerHTML){
    this.innerHTML = '';
    Whack.score++;
  }
  Whack.scoreDisplay.innerText = Whack.score;
  Whack.livesDisplay.innerText = Whack.lives;
};

Whack.addToBoard = function(){
  var gameInterval = setInterval(function(){
    var random = Math.floor(Math.random()*16);
    Whack.squares[random].innerHTML = '<div class="mole"><div class="eye"></div><div class="eye"></div><div class="mouth"></div></div>';
    setTimeout(function(){
      if(Whack.squares[random].innerHTML){
        Whack.squares[random].innerHTML = '';
        Whack.lives--;
        Whack.livesDisplay.innerText = Whack.lives;
      }
      if(!Whack.lives){
        clearInterval(gameInterval);
        Whack.heading.innerText= 'Game Over. Final Score: ' + Whack.score;
      }
    }, 800);
  }, 1000);
};

document.addEventListener('DOMContentLoaded', Whack.init.bind(Whack));
