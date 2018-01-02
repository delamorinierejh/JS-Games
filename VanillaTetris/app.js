var Tetris = Tetris || {};

Tetris.init = function(){

  // DOM elements
  this.gameGrid = document.getElementById('game-grid');
  this.scoreDisplay = document.getElementById('score-display');
  this.levelDisplay = document.getElementById('level-display');
  this.nextUpImgDisplay = document.getElementById('next-up-img');

  // Key variables for controlling the game
  this.shapeObjects   =  {
    iShape: {
      colour: '#F9C80E',
      rotations: [[1,11,21,31],[10,11,12,13],[1,11,21,31],[10,11,12,13]]
    },
    jShape: {
      colour: '#70D6FF',
      rotations: [[1,2,11,21],[10,11,12,22],[1,11,20,21],[0,10,11,12]]
    },
    oShape: {
      colour: '#FC440F',
      rotations: [[11,12,21,22],[11,12,21,22],[11,12,21,22],[11,12,21,22]]
    },
    lShape: {
      colour: '#4AFF05',
      rotations: [[0,1,11,21],[2,10,11,12],[1,11,21,22],[10,11,12,20]]
    },
    tShape: {
      colour: '#FF9800',
      rotations: [[1,10,11,12],[1,11,12,21],[10,11,12,21],[1,10,11,21]]
    },
    zShape: {
      colour: '#DD38FF',
      rotations: [[1,10,11,20],[0,1,11,12],[1,10,11,20],[0,1,11,12]]
    },
    sShape: {
      colour: '#44FFE9',
      rotations: [[0,10,11,21],[1,2,10,11],[0,10,11,21],[1,2,10,11]]
    }
  };
  this.currentShapeRotation = 0;
  this.currentSquare = 3;
  this.level = 1;
  this.score = 0;
  this.gameIsInPlay = true;
  this.numOfBlocksPlaced = 0;

  this.setUpGrid();
}

Tetris.setUpGrid = function(){
  for (var i = 0; i < 240; i++) {
    var li = '<li class="grid-cell blank-cell"></li>';
    this.gameGrid.innerHTML += li;
  }
  this.cells = document.getElementsByClassName('grid-cell');
  this.startGame();
}

Tetris.startGame = function(){
  this.setUpShapesArray(true);
  this.gameTimerSetup();
  this.setUpControls();
}

Tetris.gameTimerSetup = function(){
  this.gameTimer = setInterval(this.incrementRow.bind(this), 50 + ((40 - this.level) * 10));
}

Tetris.incrementRow = function(){
  if(this.checkShapeCanDescend()){
    this.currentSquare += 10;
    this.drawShape();
  } else {
    this.lockInShape();
  }
}

Tetris.updateScore = function(){
  this.scoreDisplay.innerText = this.score;
}

Tetris.pickNewShape = function(proceed){
  if (proceed){
    this.currentShape = this.nextUp;
  }
  this.currentSquare = 3;
  if(this.shapesArray.length){
    var shapeName = this.shapesArray.splice(Math.floor(Math.random() * this.shapesArray.length), 1)[0];
    this.nextUp = this.shapeObjects[shapeName];
    this.nextUpImgDisplay.setAttribute('src', 'images/' + shapeName + '.png');
  } else {
    this.setUpShapesArray(false);
  }
  this.setCoordinates();
  this.drawShape();
}

Tetris.setUpShapesArray = function(isFirstTime){
  this.shapesArray = Object.keys(this.shapeObjects);
  var shapeName = this.shapesArray.splice(Math.floor(Math.random() * this.shapesArray.length), 1)[0];
  this.nextUp = this.shapeObjects[shapeName];
  this.nextUpImgDisplay.setAttribute('src', 'images/' + shapeName + '.png');
  this.pickNewShape(isFirstTime);
}

Tetris.setCoordinates = function(){
  this.currentShapeCoords = this.currentShape.rotations[this.currentShapeRotation];
}

Tetris.drawShape = function(){
  this.clearBankCells();
  for (var i = 0; i < this.currentShapeCoords.length; i++) {
    this.illuminateSquare(this.currentShapeCoords[i], this.currentShape.colour)
  }
}

Tetris.lockInShape = function(){
  for (var i = 0; i < this.currentShapeCoords.length; i++) {
    var index = this.currentShapeCoords[i] + this.currentSquare;
    if (index > 40){
      this.cells[index].className = 'grid-cell filled-cell';
    } else {
      this.alertLoss();
    }
  }
  if(this.gameIsInPlay){
    this.score += this.level;
    this.updateScore();
    this.pickNewShape(true);
    this.checkFullRows();
    this.numOfBlocksPlaced++;
    if(this.numOfBlocksPlaced % 12 == 0){
      this.updateLevel();
    }
  }
}

Tetris.updateLevel = function(){
  this.level = Math.min(40, this.level + 1);
  this.levelDisplay.innerText = this.level;
  this.gameTimerSetup();
};

Tetris.checkFullRows = function(){
  var startSquare = 0;
  for (var i = 0; i < 24; i++) {
    var clearRowFlag = true;
    startSquare = 10*i;
    for (var j = 0; j < 10; j++) {
      if(this.cells[startSquare + j].className.indexOf('blank') > -1){
        clearRowFlag = false;
        break;
      }
    }
    if (clearRowFlag){
      this.clearRow(startSquare);
      i--;
    }
    clearRowFlag = true;
  }
}


Tetris.clearRow = function(start){
  for (var i = 0; i < 10; i++) {
    this.cells[start + i].remove();
    this.gameGrid.innerHTML = '<li class="grid-cell blank-cell"></li>' + this.gameGrid.innerHTML;
  }
  this.score += 10;
  this.updateScore();
}

Tetris.alertLoss = function(){
  if (this.gameIsInPlay){
    this.gameIsInPlay = false;
    clearInterval(this.gameTimer);
    document.getElementById('game-over').style.display = 'block';
  }
}

Tetris.clearBankCells = function(){
  var blanks = document.getElementsByClassName('blank-cell');
  for (var i = 0; i < blanks.length; i++) {
    blanks[i].style.backgroundColor = 'transparent';
  }
}

Tetris.illuminateSquare = function(index, colour){
  this.cells[index + this.currentSquare].style.backgroundColor = colour;
}

// Spatial awareness methods
Tetris.checkShapeCanDescend = function(){
  // return true if the lowest illuminated square from the shape is not in the last row
  // and it is not going to hit another shape
  for (var i = 0; i < this.currentShapeCoords.length; i++) {
    var indexToCheck = this.currentShapeCoords[i] + this.currentSquare + 10;
    if(this.cells[indexToCheck] && this.cells[indexToCheck].className.indexOf('filled') > -1){
      return false;
      break;
    }
  }
  var lastSquare =  this.currentSquare + this.currentShapeCoords[3];
  return lastSquare < 230;
}

Tetris.checkCanMoveRight = function(){
  // first we need to check if the shape has reached the right hand side of the grid
  // then we need to check that is isn't going to clash with filled in cells by moving
  for (var i = 0; i < this.currentShapeCoords.length; i++) {
    var squareBeingChecked = this.currentSquare + this.currentShapeCoords[i];
    if (squareBeingChecked % 10 === 9 || this.cells[squareBeingChecked + 1].className.indexOf('filled') > -1){
      return false;
      break;
    }
  }
  return true;
}

Tetris.checkCanMoveLeft = function(){
  // first we need to check if the shape has reached the right hand side of the grid
  // then we need to check that is isn't going to clash with filled in cells by moving
  var clearFlag = true;
  for (var i = 0; i < this.currentShapeCoords.length; i++) {
    var squareBeingChecked = this.currentSquare + this.currentShapeCoords[i];
    if (squareBeingChecked % 10 === 0 || this.cells[squareBeingChecked - 1].className.indexOf('filled') > -1){
      return false;
      break;
    }
  }

  return true;
}

Tetris.checkCanRotate = function(){
  // shapes should not be allowed to rotate if it means that they will impact
  // with any squares that are already filled in
  var rotationToCheck = this.currentShape.rotations[(this.currentShapeRotation + 1) % 4];
  for (var i = 0; i < rotationToCheck.length; i++) {
    if(this.cells[this.currentSquare + rotationToCheck[i]].className.indexOf('filled') > -1){
      // we should also make sure that we are not stopping the rotation if the squares in question
      // are actually on the other side of the grid
      if (!this.shapeIsOverlappingEdge(rotationToCheck)){
        return false
      }
    }
  }

  return true;
}

Tetris.adjustForEdges = function(){
  if (this.currentSquare % 10 > 6 && this.currentSquare % 10 < 9) {
    while(this.shapeIsOverlappingEdge(this.currentShapeCoords)){
      this.currentSquare--;
    }
  } else {
    while(this.shapeIsOverlappingEdge(this.currentShapeCoords)){
      this.currentSquare++;
    }
  }
}

Tetris.shapeIsOverlappingEdge = function(coords){
  var currentSquare = this.currentSquare;
  var mappedCoords = coords.map(function(el, i){
    return (el + currentSquare) % 10;
  }).sort(function(a,b){ return a > b});
  return mappedCoords[3] - mappedCoords[0] === 9;
}


// Controls
Tetris.setUpControls = function(){
  document.addEventListener('keydown', this.readKeyPress.bind(this))
}

Tetris.readKeyPress = function(event){
  if (this.gameIsInPlay){
    switch(event.key){
      case 'ArrowLeft':
        this.moveLeft();
        break;
      case 'ArrowRight':
        this.moveRight();
        break;
      case 'ArrowDown':
        this.incrementRow();
        break;
      case 'ArrowUp':
        this.rotateShape();
        break;
      default:
        return;
    }
  }
};

Tetris.moveRight = function(){
  if(this.checkCanMoveRight()){
    this.currentSquare++;
    this.drawShape();
  }
}

Tetris.moveLeft= function(){
  if(this.checkCanMoveLeft()){
    this.currentSquare--;
    this.drawShape();
  }
}

Tetris.rotateShape = function(){
  if(this.checkCanRotate()){
    this.currentShapeRotation = (this.currentShapeRotation + 1) % 4;
    this.currentShapeCoords = this.currentShape.rotations[this.currentShapeRotation];
    this.adjustForEdges();
    this.drawShape();
  }
}


window.addEventListener('DOMContentLoaded', Tetris.init.bind(Tetris));
