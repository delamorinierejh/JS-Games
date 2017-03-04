var Othello = Othello || {};

Othello.init = function(){
  this.turnCount          = 0;
  this.grid               = document.getElementById('game-grid');
  this.heading            = document.getElementById('heading');
  this.boardWidth         = 8;
  this.boardHeight        = 8;
  this.blackTurn          = true;
  for (var i = 0; i < this.boardHeight*this.boardWidth; i++) {
    this.grid.innerHTML += '<li class="square" id="' + i + '"></li>';
  }
  this.squares = document.getElementsByClassName('square');
  this.addListeners();
};

Othello.addListeners = function(){
  for (var i = 0; i < this.squares.length; i++) {
    this.squares[i].addEventListener('click', Othello.squareClick);
  }
  this.setUpGame();
};

Othello.squareClick = function(){
  var opponent = Othello.blackTurn ? 'White' : 'Black';
  var player = Othello.blackTurn ? 'Black' : 'White';
  if (!this.innerHTML && Othello.changeCounters(this, opponent, player, true)){
    Othello.turnCount++;
    this.className += ' occupied';
    this.innerHTML = '<div class="' + (Othello.blackTurn ? 'Black' : 'White') + '"></div>';
    Othello.blackTurn = !Othello.blackTurn;
    if(Othello.turnCount === (Othello.boardHeight*Othello.boardWidth - 4)){
      Othello.gameOver();
    } else {
      Othello.heading.innerText = (Othello.blackTurn ? 'Black' : 'White') + '\'s turn' ;
      Othello.heading.style.color = (Othello.blackTurn ? 'Black' : 'White');
    }
    setTimeout(function(){
      console.log('running check for no moves for', opponent);
      var nextPlayerCanGo = false;
      for (var i = 0; i < Othello.squares.length; i++) {
        if (!Othello.squares[i].innerHTML && Othello.changeCounters(Othello.squares[i], player, opponent, false)){
          nextPlayerCanGo = true;
          break;
        }
      }
      if (!nextPlayerCanGo && Othello.turnCount < 60){
        Othello.blackTurn = !Othello.blackTurn;
        Othello.heading.innerText = (Othello.blackTurn ? 'Black' : 'White') + '\'s turn. ' + (Othello.blackTurn ? 'White' : 'Black') + ' unable to go';
        Othello.heading.style.color = (Othello.blackTurn ? 'Black' : 'White');
      }
    }, 500);
  }
};

Othello.setUpGame = function(){
  this.squares[27].innerHTML = '<div class="Black"></div>';
  this.squares[27].className += ' occupied';
  this.squares[36].innerHTML = '<div class="Black"></div>';
  this.squares[36].className += ' occupied';
  this.squares[28].innerHTML = '<div class="White"></div>';
  this.squares[28].className += ' occupied';
  this.squares[35].innerHTML = '<div class="White"></div>';
  this.squares[35].className += ' occupied';
};

Othello.changeCounters = function(square, opponent, player, runChanges){
  var hold1  = Othello.checkDirection(square, -9, 'upleft', opponent, player, runChanges);
  var hold2  = Othello.checkDirection(square, -8, 'up', opponent, player, runChanges);
  var hold3  = Othello.checkDirection(square, -7, 'upright', opponent, player, runChanges);
  var hold4  = Othello.checkDirection(square, -1, 'left', opponent, player, runChanges);
  var hold5  = Othello.checkDirection(square, 1, 'right', opponent, player, runChanges);
  var hold6  = Othello.checkDirection(square, 7, 'downleft', opponent, player, runChanges);
  var hold7  = Othello.checkDirection(square, 8, 'down', opponent, player, runChanges);
  var hold8  = Othello.checkDirection(square, 9, 'downright', opponent, player, runChanges);
  return ((hold1 || hold2 || hold3 || hold4 || hold5 || hold6 || hold7 || hold8));
};

Othello.checkDirection = function(square, count, direction, opponent, player, runChanges){
  var truthy = false;
  var limitOk = true;
  var squaresChanged = 0;
  var array = [];
  while(Othello.squares[parseInt(square.id)+count] && Othello.squares[parseInt(square.id)+count].innerHTML && Othello.squares[parseInt(square.id)+count].innerHTML.indexOf(opponent) !== -1){
    if (direction === 'right' || direction === 'left'){
      var rowSame = true;
    }
    if (direction === 'up' || direction === 'down'){
      var colSame = true;
    }
    if (direction === 'upright' || direction === 'downright'){
      var colBigger = true;
    }
    if (direction === 'upleft' || direction === 'downleft'){
      var colSmaller = true;
    }
    var currentCol = ((parseInt(square.id)+1)%8) -1;
    var nextCol = (parseInt(square.id)+count+1)%8 -1;
    if (currentCol === -1){
      currentCol = 7;
    }
    if (nextCol === -1){
      nextCol = 7;
    }
    var currentRow    = Math.floor((parseInt(square.id))/8);
    var nextRow       = Math.floor((parseInt(square.id) + count)/8);
    if (nextRow !== currentRow && rowSame || nextCol !== currentCol && colSame || nextCol >= currentCol && colSmaller || nextCol <= currentCol && colBigger){
      limitOk = false;
      break;
    }
    squaresChanged++;
    square = Othello.squares[parseInt(square.id)+count];
    array.push(square);
  }
  if (Othello.squares[parseInt(square.id)+count] && Othello.squares[parseInt(square.id)+count].innerHTML && Othello.squares[parseInt(square.id)+count].innerHTML.indexOf(player) !== -1 && limitOk){
    truthy = true;
    if (runChanges){
      for (var i = 0; i < array.length; i++) {
        array[i].className += ' occupied';
        array[i].innerHTML = '<div class="' + player + 'X"></div>';
      }
    }
  }
  return truthy && squaresChanged;
};

Othello.gameOver = function(){
  var whiteCount = 0;
  var blackCount = 0;
  var winner;
  var draw = false;
  for (var i = 0; i < Othello.squares.length; i++) {
    if (Othello.squares[i].innerHTML.indexOf('White') > -1){
      whiteCount++;
    } else if (Othello.squares[i].innerHTML.indexOf('Black') > -1){
      blackCount++;
    }
  }
  if (blackCount > whiteCount){
    winner = 'Black';
  } else if (blackCount === whiteCount){
    draw = true;
  } else {
    winner = 'White';
  }
  if (draw){
    Othello.heading.innerText = 'Game over. It\'s a draw';
  } else {
    Othello.heading.innerText = winner + ' wins! ' + Math.max(blackCount, whiteCount) + ':' + Math.min(blackCount, whiteCount);
  }
  Othello.heading.style.color = '#ddd';
};

document.addEventListener('DOMContentLoaded', Othello.init.bind(Othello));
