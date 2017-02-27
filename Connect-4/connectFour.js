var ConnectFour = ConnectFour || {};

ConnectFour.init = function(){
  this.grid                = document.getElementById('game-grid');
  this.lastSquareChosen    = null;
  this.boardWidth          = 9;
  this.boardHeight         = 6;
  this.heading             = document.getElementById('heading');
  this.buildBoard();
  document.getElementById('reset').addEventListener('click', ConnectFour.buildBoard.bind(ConnectFour));
};

ConnectFour.buildBoard = function(){
  this.gameInPlay          = true;
  this.heading.style.color = '#978fbf';
  this.heading.innerText   = 'CONNECT 4';
  this.isRedTurn           = true;
  this.grid.innerHTML      = '';
  for (var i = 0; i < (this.boardHeight*this.boardWidth); i++) {
    this.grid.innerHTML += '<li class="hole" id="' + i + '"></li>';
  }
  this.addListenersToHoles();
};

ConnectFour.addListenersToHoles = function(){
  this.holes = document.getElementsByClassName('hole');
  for (var i = 0; i < 9; i++) {
    this.holes[i].addEventListener('click', ConnectFour.takeTurn);
  }
};

ConnectFour.takeTurn = function(){
  if (ConnectFour.gameInPlay && ConnectFour.checkVacancy(parseInt(this.id))){
    var colour = ConnectFour.isRedTurn ? 'Red' : 'Yellow';
    ConnectFour.fillHole(this, colour);
    ConnectFour.isRedTurn = !ConnectFour.isRedTurn;
  }
};

ConnectFour.fillHole = function(hole, colour){
  hole.className = 'hole ' + colour;
  var id = parseFloat(hole.id);
  setTimeout(function(){
    hole.className = 'hole';
    if(ConnectFour.holes[id+ConnectFour.boardWidth] && ConnectFour.checkVacancy(id+ConnectFour.boardWidth)){
      hole = ConnectFour.holes[id+ConnectFour.boardWidth];
      ConnectFour.fillHole(hole, colour);
    } else {
      hole.className = 'hole ' + colour;
      ConnectFour.checkForWin(colour);
    }
  }, 200);
};

ConnectFour.checkVacancy = function(id){
  return (ConnectFour.holes[id].className.indexOf('Red') === -1 && ConnectFour.holes[id].className.indexOf('Yellow') === -1);
};

ConnectFour.checkForWin = function(colour){
  if (ConnectFour.gameInPlay) {
    ConnectFour.checkColumns(colour);
  }
};

ConnectFour.checkColumns = function(colour){
  var isWin = false;
  for (var i = 0; i < 27; i++) {
    var array = [];
    for (var j = 0; j < 36; j += 9) {
      if (ConnectFour.holes[i+j] && ConnectFour.holes[i+j].className.indexOf(colour) !== -1){
        array.push(ConnectFour.holes[i+j]);
      }
    }
    if(array.length === 4){
      isWin = true;
      break;
    }
  }
  if (isWin){
    ConnectFour.alertWin(colour, array);
  } else {
    ConnectFour.checkRows(colour);
  }
};

ConnectFour.checkRows = function(colour){
  var isWin = false;
  for (var i = 0; i < 46; i += 9) {
    for (var j = 0; j < 6; j ++) {
      var array = [];
      for (var k = 0; k < 4; k++) {
        if (ConnectFour.holes[i+j+k] && ConnectFour.holes[i+j+k].className.indexOf(colour) !== -1){
          array.push(ConnectFour.holes[i+j+k]);
        }
      }
      if(array.length === 4){
        isWin = true;
        break;
      }
    }
    if(isWin){
      break;
    }
  }
  if (isWin){
    ConnectFour.alertWin(colour, array);
  } else {
    ConnectFour.checkDownDiagonals(colour);
  }
};

ConnectFour.checkDownDiagonals = function(colour){
  var isWin = false;
  for (var i = 0; i < 19; i += 9) {
    for (var j = 0; j < 6; j ++) {
      var array = [];
      for (var k = 0; k < 40; k += 10) {
        if (ConnectFour.holes[i+j+k] && ConnectFour.holes[i+j+k].className.indexOf(colour) !== -1){
          array.push(ConnectFour.holes[i+j+k]);
        }
      }
      if(array.length === 4){
        isWin = true;
        break;
      }
    }
    if(isWin){
      break;
    }
  }
  if (isWin){
    ConnectFour.alertWin(colour, array);
  } else {
    ConnectFour.checkUpDiagonals(colour);
  }
};

ConnectFour.checkUpDiagonals = function(colour){
  var isWin = false;
  for (var i = 27; i < 46; i += 9) {
    for (var j = 0; j < 6; j ++) {
      var array = [];
      for (var k = 0; k > - 33 ; k -= 8) {
        if (ConnectFour.holes[i+j+k] && ConnectFour.holes[i+j+k].className.indexOf(colour) !== -1){
          array.push(ConnectFour.holes[i+j+k]);
        }
      }
      if(array.length === 4){
        isWin = true;
        break;
      }
    }
    if(isWin){
      break;
    }
  }
  if (isWin){
    ConnectFour.alertWin(colour, array);
  }
};

ConnectFour.alertWin = function(colour, array){
  for (var i = 0; i < array.length; i++) {
    array[i].className = 'hole Orange';
  }
  ConnectFour.heading.style.color = colour.toLowerCase();
  ConnectFour.heading.innerText   = '' + colour + ' wins!';
  ConnectFour.gameInPlay = false;
};



window.addEventListener('DOMContentLoaded', ConnectFour.init.bind(ConnectFour));
