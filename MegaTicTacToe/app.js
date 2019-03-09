var TicTac = TicTac || {};

TicTac.init = function(){
  this.isXTurn = true;
  this.solutionArray = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  this.moves = {
    x: {},
    o: {}
  }
  this.wonBoards = {
    x: [],
    o: []
  }
  this.activeBoard = null;
  this.activeBoardChosen = false;
  this.drawBoard();
}

TicTac.drawBoard = function(){
  this.overallBoard = document.getElementById('overall-game-board');
  // we need to add nine mini-boards to the game
  for (var i = 0; i < 9; i++) {
    this.overallBoard.innerHTML += '<li class="mini-board-container"><ul class="mini-board" id="mini-board-1"></ul></li>';
    this.moves.x[i] = [];
    this.moves.o[i] = [];
  }
  this.miniBoards = document.getElementsByClassName('mini-board');
  for (var i = 0; i < this.miniBoards.length; i++) {
    for (var j = 0; j < 9; j++) {
      this.miniBoards[i].innerHTML += '<li class="mini-board-square" data-board="' + i + '" data-square="' + j + '"></li>'
    }
  }
  this.setUpListeners();
}

TicTac.setUpListeners = function(){
  this.squares = document.getElementsByClassName('mini-board-square');
  for (var i = 0; i < this.squares.length; i++) {
    this.squares[i].addEventListener('click', this.squareClick.bind(this))
  }
}

TicTac.squareClick = function(e){
  if(this.checkLegalMove(e)){
    var whoseTurn = this.isXTurn ? 'x' : 'o';
    e.target.className += ' filled-' + whoseTurn;
    e.target.innerHTML += this.isXTurn ? 'x' : 'o';
    this.updateMoves(e, whoseTurn);
  } else {
    alert('try again')
  }
}

TicTac.checkLegalMove = function(e){
  // don't let it happen if it has innerHTML - this means the square is taken
  // don't let it happend if it's not in the right board
  if (e.target.innerHTML.length){
    return false;
  } else if (this.activeBoardChosen && parseInt(e.target.dataset.board) !== this.activeBoard){
    return false;
  }
  return true;
}

TicTac.updateMoves = function(e, whoseTurn){
  var whichBoard = parseInt(e.target.dataset.board);
  var whichSquare = parseInt(e.target.dataset.square);
  this.moves[whoseTurn][whichBoard].push(whichSquare);
  this.makeActiveBoard(whichSquare, whoseTurn);
}

TicTac.makeActiveBoard = function(whichSquare, whoseTurn){
  this.activeBoard = whichSquare;
  this.activeBoardChosen = true;
  for (var i = 0; i < this.miniBoards.length; i++) {
    this.miniBoards[i].className = 'mini-board';
  }
  this.miniBoards[whichSquare].className += ' active';
  this.checkBoard(whoseTurn);
}

TicTac.checkBoard = function(whoseTurn){
  for (var key in this.moves[whoseTurn]){
    
  }
  this.isXTurn = !this.isXTurn;
}

document.addEventListener('DOMContentLoaded', TicTac.init.bind(TicTac))
