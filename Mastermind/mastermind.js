var MasterMind = MasterMind || {};

MasterMind.init = function(){
  this.coloursArray = ['red','green','white','yellow','blue','pink'];
  this.currentRow   = 1;
  this.currentGuess = 1;
  this.solution     = [];
  this.gameInPlay   = true;
  this.solutionRack = document.getElementById('solution');
  this.guessGrid    = document.getElementById('guess-grid');
  this.setUpGuessGrid();
  this.setUpSolution();
};

MasterMind.setUpSolution = function(){
  for (var i = 1; i < 5; i++) {
    MasterMind.solutionRack.innerHTML += '<div class="peg solution-peg" id="solution-peg-' + i + '">?</div>';
    var randomColour = MasterMind.coloursArray.splice(Math.floor(Math.random()*MasterMind.coloursArray.length), 1)[0];
    document.getElementById('solution-peg-' + i).setAttribute('data-colour', randomColour);
    MasterMind.solution.push(randomColour);
  }
};

MasterMind.setUpGuessGrid = function(){
  for (var i = 8; i > 0; i--) {
    MasterMind.guessGrid.innerHTML += '<div class="row" id="row-' + i + '"><div class="guess" id="guess-' + i + '"></div><div class="score" id="score-' + i + '"></div><button class="clear" id="' + i + '">Clear</button></div>';
    var newGuess = document.getElementById('guess-'+i);
    var newScore = document.getElementById('score-'+i);
    for (var j = 1; j < 5; j++) {
      newGuess.innerHTML += '<div class="peg guess-peg" id="row-' + i + '-guess-' + j + '"></div>';
      newScore.innerHTML += '<div class="score-peg" id="row-' + i + ' -score-' + j + '"></div>';
    }
  }
  MasterMind.clearButtons = document.getElementsByClassName('clear');
  MasterMind.setUpClearButtons();
};

MasterMind.setUpClearButtons = function(){
  for (var i = 0; i < MasterMind.clearButtons.length; i++) {
    MasterMind.clearButtons[i].addEventListener('click', MasterMind.clearRow);
  }
  MasterMind.resetClearButtons();
  MasterMind.colourButtons = document.getElementsByClassName('colour');
  MasterMind.addColourButtons();
};

MasterMind.clearRow = function(){
  if(MasterMind.gameInPlay){
    MasterMind.currentRow = parseInt(this.id);
    MasterMind.currentGuess = 1;
    for (var i = 1; i <5; i++) {
      document.getElementById('row-'+MasterMind.currentRow+'-guess-'+i).style.backgroundColor = '';
    }
  }
  MasterMind.resetClearButtons();
};

MasterMind.resetClearButtons = function (){
  for (var i = 0; i < MasterMind.clearButtons.length; i++) {
    MasterMind.clearButtons[i].style.display = 'none';
  }
};

MasterMind.addColourButtons = function(){
  for (var i = 0; i < MasterMind.colourButtons.length; i++) {
    MasterMind.colourButtons[i].addEventListener('click', MasterMind.colourPicked);
    MasterMind.colourButtons[i].style.backgroundColor = MasterMind.colourButtons[i].id;
  }
};

MasterMind.colourPicked = function(){
  if(MasterMind.gameInPlay){
    document.getElementById('row-'+MasterMind.currentRow+'-guess-'+MasterMind.currentGuess).style.backgroundColor = this.id;
    MasterMind.currentGuess++;
    if(MasterMind.currentGuess === 5){
      MasterMind.showRowScore();
    }
    if(MasterMind.currentGuess === 2){
      document.getElementById(MasterMind.currentRow).style.display = 'inline';
    }
  }
};

MasterMind.rowFinished = function(status=false){
  if(status){
    MasterMind.showSolution();
    MasterMind.gameInPlay = false;
    document.getElementById('heading').innerText = 'Well done!';
  } else {
    MasterMind.currentGuess = 1;
    MasterMind.currentRow++;
    if(MasterMind.currentRow < 10){
      MasterMind.resetClearButtons();
    } else {
      MasterMind.gameInPlay = false;
      MasterMind.showSolution();
      document.getElementById('heading').innerText = 'Game Over';
    }
  }
};

MasterMind.showRowScore = function(){
  var whiteCount = 0;
  var redCount   = 0;
  var coloursArray = ['red','green','white','yellow','blue','pink'];
  for (var i = 1; i < 5; i++) {
    var colourCheck = document.getElementById('row-'+MasterMind.currentRow+'-guess-'+i).style.backgroundColor;
    if(colourCheck === MasterMind.solution[i-1]){
      redCount++;
      coloursArray.splice(coloursArray.indexOf(colourCheck), 1);
    }
  }
  for (var j = 1; j < 5; j++) {
    var secondColourCheck = document.getElementById('row-'+MasterMind.currentRow+'-guess-'+j).style.backgroundColor;
    if(MasterMind.solution.indexOf(secondColourCheck) > -1 && coloursArray.indexOf(secondColourCheck) > -1){
      whiteCount++;
      coloursArray.splice(coloursArray.indexOf(secondColourCheck), 1);
    }
  }
  for (var k = 1; k < redCount+1; k++) {
    document.getElementById('row-' + MasterMind.currentRow + ' -score-' + k).style.backgroundColor = 'red';
  }
  for (var l = redCount+1; l < redCount+whiteCount+1; l++) {
    document.getElementById('row-' + MasterMind.currentRow + ' -score-' + l).style.backgroundColor = 'white';
  }
  MasterMind.rowFinished(redCount === 4);
};

MasterMind.showSolution = function(){
  var solutionBlocks = document.getElementsByClassName('solution-peg');
  for (var i = 0; i < solutionBlocks.length; i++) {
    solutionBlocks[i].style.backgroundColor = MasterMind.solution[i];
    solutionBlocks[i].innerText = '';
  }
  for (var j = 0; j < MasterMind.clearButtons.length; j++) {
    MasterMind.clearButtons[j].style.display = 'none';
  }
};

document.addEventListener('DOMContentLoaded', MasterMind.init.bind(MasterMind));
