var Solitaire = Solitaire || {};

Solitaire.init = function(){
  this.suits = ['spades', 'hearts', 'diamonds', 'clubs'];
  this.faces = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'jack', 'queen', 'king', 'ace'];
  this.boardMoves = {
    'ace' : '2',
    '2': '3',
    '3': '4',
    '4': '5',
    '5': '6',
    '6': '7',
    '7': '8',
    '8': '9',
    '9': '10',
    '10': 'jack',
    'jack': 'queen',
    'queen': 'king'
  }
  this.homeZoneMoves = {}
  for (var key in this.boardMoves){
    this.homeZoneMoves[this.boardMoves[key]] = key;
  }
  this.boardMoves['king'] = '0'
  this.homeZoneMoves['ace'] = '0';
  this.suitMoves = {
    'hearts': ['spades', 'clubs', 'blank'],
    'diamonds': ['spades', 'clubs', 'blank'],
    'spades': ['hearts', 'diamonds', 'blank'],
    'clubs': ['hearts', 'diamonds', 'blank']
  }
  this.drawPile = [];
  this.currentDeckCard = document.getElementById('current-deck-card');
  this.setUpCards();
  this.setUpSuits();
}

Solitaire.setUpCards = function(){
  this.deck = [];
  for (var i = 0; i < this.suits.length; i++) {
    for (var j = 0; j < this.faces.length; j++) {
      this.deck.push([this.faces[j], this.suits[i]])
    }
  }
  this.deck = shuffle(this.deck);
  this.drawnCards = [];
  this.board = {
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
    6: [],
    7: []
  }
  this.setUpBoard();
}

Solitaire.setUpSuits = function(){
  this.suitZones = document.querySelectorAll('#home-zones > div');
  this.suitZones.forEach(function(el,i) {
    el.style.backgroundImage = 'url("images/suits/' + el.id + '.png")';
    el.setAttribute('class', 'card-zone suits-setup')
  });
}

Solitaire.setUpBoard = function(){
  for (var i = 1; i < 8; i++) {
    var j = i;
    while(j > 0){
      var card = this.deck.splice(0,1)[0].join('_of_');
      this.board[i].push(card);
      j--;
    }
  }

  this.setUpBuildArea(true);
}

Solitaire.setUpBuildArea = function(isFirstTime){
  this.clearColumns();
  for (var key in this.board){
    var column = document.getElementById('column-' + key);
    var length = this.board[key].length;
    var upturned = column.dataset.upturned;
    if (length){
      column.setAttribute('class', column.className.replace(/card-zone/g, ''));
      for (var i = 0; i < length; i++) {
        var card = this.board[key][i];
        var suit = card.split('_of_')[1]
        if(i < (length - upturned)){
          var cardEl = '<div data-column="' + key + '" data-suit="' + suit + '" data-value="' + card + '" class="card-selector card-back" style="top: ' + (25 * i) + 'px;"></div>';
        } else {
          var cardFace = 'images/card_faces/' + card + '.png';
          var cardEl = '<div data-column="' + key + '" data-suit="' + suit + '" data-value="' + card + '" class="card-selector upturned-card" style="top: ' + (25 * i) + 'px; background-image: url(' + cardFace + ')"></div>'
        }
        column.innerHTML += cardEl;
      }
    } else {
      column.setAttribute('class', 'build-column card-zone');
      column.setAttribute('data-column', key)
    }
  }
  this.setUpListeners(isFirstTime);
}

Solitaire.clearColumns = function(){
  var columns = document.getElementsByClassName('build-column');
  for (var i = 0; i < columns.length; i++) {
    columns[i].innerHTML = '';
  }
}

Solitaire.setUpListeners = function(isFirstTime){
  var cards = document.getElementsByClassName('upturned-card');
  for (var i = 0; i < cards.length; i++) {
    cards[i].addEventListener('click', this.makeSelection)
  }
  if (isFirstTime){
    document.addEventListener('click', function(event){
      if (event.target.id === 'deck'){
        Solitaire.drawNewCard();
      } else if (event.target.className.indexOf('upturned-card') === -1){
        Solitaire.checkLegitimateSelection(event);
      }
    })
  }
}

Solitaire.drawNewCard = function(){
  this.currentDeckCard.className = 'card-selector upturned-card';
  this.setUpListeners(false);
  if (this.deck.length){
    this.drawnCards.unshift(this.deck.splice(0,1)[0]);
    this.currentDeckCard.style.backgroundImage = 'url(images/card_faces/' + this.drawnCards[0].join('_of_') + '.png)';
    this.currentDeckCard.dataset.value = this.drawnCards[0].join('_of_');
    if (!this.deck.length) {
      document.getElementById('deck').className += ' empty-deck';
    }
  } else if (this.drawnCards.length){
    document.getElementById('deck').className = 'card-back card-zone';
    this.deck = this.drawnCards.reverse();
    this.drawnCards = [];
    this.drawNewCard()
  } else {
    alert('out of cards')
    return;
  }

};

Solitaire.makeSelection = function(event){
  if (Solitaire.selectedCard){
    Solitaire.checkLegitimateSelection(event);
  } else {
    Solitaire.clearSelections();
    this.setAttribute('class', this.className + ' selected');
    Solitaire.selectedCard = this;
  }
}

Solitaire.checkLegitimateSelection = function(event){
  var movingCard = this.selectedCard.dataset.value.split('_of_');
  var colElOriginal = document.getElementById('column-' + this.selectedCard.dataset.column);
  if (this.selectedCard && event.target.className.indexOf('build-column') > -1){
    var boardColumn = this.board[event.target.dataset.column];
    if (this.selectedCard.dataset.column === 'deck'){
      boardColumn.push(this.drawnCards.shift().join('_of_'));
      colElDestination.setAttribute('data-upturned', '' + (parseInt(colElDestination.dataset.upturned) + 1));
      if (this.drawnCards.length) {
        this.currentDeckCard.style.backgroundImage = 'url(images/card_faces/' + this.drawnCards[0].join('_of_') + '.png)';
        this.currentDeckCard.dataset.value = this.drawnCards[0].join('_of_');
      } else {
        this.currentDeckCard.style.backgroundImage = '';
        this.currentDeckCard.dataset.value = '';
      }
      this.clearSelections();
    } else {
      var colElOriginal = document.getElementById('column-' + this.selectedCard.dataset.column);
      var movingArray = this.board[this.selectedCard.dataset.column].splice(this.board[this.selectedCard.dataset.column].indexOf(this.selectedCard.dataset.value));
      for (var i = 0; i < movingArray.length; i++){
        boardColumn.push(movingArray[i]);
      }
      var colElDestination = document.getElementById('column-' + event.target.dataset.column);
      var updatedUpturned = '' + (parseInt(colElDestination.dataset.upturned) + movingArray.length);
      colElDestination.setAttribute('data-upturned', updatedUpturned);
      colElOriginal.setAttribute('data-upturned', '' + Math.max(colElOriginal.dataset.upturned - movingArray.length, 1));
    }
    this.setUpBuildArea(false);
  } else if (this.selectedCard && this.runTypeCheck(event)){
    this.setUpBuildArea(false);
    this.selectedCard = null;
    return;
  } else if(this.selectedCard) {
    this.selectedCard.setAttribute('class', this.selectedCard.className + ' errored');
    setTimeout(function(){
      if(Solitaire.selectedCard) {
        Solitaire.selectedCard.setAttribute('class', 'card-selector upturned-card');
        Solitaire.selectedCard = null;
      }
    }, 300)
  }
}

Solitaire.runTypeCheck = function(event){
  var movingCard = this.selectedCard.dataset.value.split('_of_');
  var colElOriginal = document.getElementById('column-' + this.selectedCard.dataset.column);
  if (event.target.dataset.column === 'deck'){
    return this.clearSelections();
  }
  if (event.target.dataset.column){
    var boardColumn = this.board[event.target.dataset.column];
    var cardToCheckAgainst = boardColumn[boardColumn.length - 1];
    cardToCheckAgainst = cardToCheckAgainst.split('_of_');
    if (this.boardMoves[movingCard[0]] === cardToCheckAgainst[0] && this.suitMoves[movingCard[1]].indexOf(cardToCheckAgainst[1]) > -1 && event.target.className.indexOf('empty-column') === -1){
    var colElDestination = document.getElementById('column-' + event.target.dataset.column);
      if (this.selectedCard.dataset.column === 'deck'){
        boardColumn.push(this.drawnCards.shift().join('_of_'));
        colElDestination.setAttribute('data-upturned', '' + (parseInt(colElDestination.dataset.upturned) + 1));
        if (this.drawnCards.length) {
          this.currentDeckCard.style.backgroundImage = 'url(images/card_faces/' + this.drawnCards[0].join('_of_') + '.png)';
          this.currentDeckCard.dataset.value = this.drawnCards[0].join('_of_');
        } else {
          this.currentDeckCard.style.backgroundImage = '';
          this.currentDeckCard.dataset.value = '';
        }

        this.clearSelections();
      } else {
        var movingArray = this.board[this.selectedCard.dataset.column].splice(this.board[this.selectedCard.dataset.column].indexOf(movingCard.join('_of_')));
        for (var i = 0; i < movingArray.length; i++){
          boardColumn.push(movingArray[i]);
        }
        var updatedUpturned = '' + (parseInt(colElDestination.dataset.upturned) + movingArray.length);
        colElDestination.setAttribute('data-upturned', updatedUpturned);
        colElOriginal.setAttribute('data-upturned', '' + Math.max(colElOriginal.dataset.upturned - movingArray.length, 1));
      }
    }
    return true;
  } else if (this.selectedCard.dataset.column !== 'deck' && event.target.getAttribute('data-suit') && this.board[this.selectedCard.dataset.column].indexOf(movingCard.join('_of_')) === this.board[this.selectedCard.dataset.column].length - 1){
    if (movingCard[1] === event.target.dataset.suit && this.homeZoneMoves[movingCard[0]] === event.target.dataset.value){
      this.board[this.selectedCard.dataset.column].splice(this.board[this.selectedCard.dataset.column].length - 1);
      colElOriginal.setAttribute('data-upturned', '' + Math.max(colElOriginal.dataset.upturned - 1, 1));
      var cardFace = 'images/card_faces/' + this.selectedCard.dataset.value + '.png';
      document.getElementById(movingCard[1]).innerHTML += '<div class="homezoned-card" data-suit="' + movingCard[1] + '" data-value="' + movingCard[0] + '" style="background-image: url(' + cardFace + ');" ></div>'
      document.getElementById(movingCard[1]).className += ' no-border';
      return true;
    }
  } else if (this.selectedCard.dataset.column === 'deck' && event.target.getAttribute('data-suit')) {
    if (movingCard[1] === event.target.dataset.suit && this.homeZoneMoves[movingCard[0]] === event.target.dataset.value){
      var cardFace = 'images/card_faces/' + this.selectedCard.dataset.value + '.png';
      document.getElementById(movingCard[1]).innerHTML += '<div class="homezoned-card" data-suit="' + movingCard[1] + '" data-value="' + movingCard[0] + '" style="background-image: url(' + cardFace + ');" ></div>'
      document.getElementById(movingCard[1]).className += ' no-border';
      this.drawnCards.shift();
      this.clearSelections();
      if (this.drawnCards.length) {
        this.currentDeckCard.style.backgroundImage = 'url(images/card_faces/' + this.drawnCards[0].join('_of_') + '.png)';
        this.currentDeckCard.dataset.value = this.drawnCards[0].join('_of_');
      } else {
        this.currentDeckCard.style.backgroundImage = '';
        this.currentDeckCard.dataset.value = '';
      }
    }
  }
  return false;
}

Solitaire.clearSelections = function(){
  var cards = document.getElementsByClassName('upturned-card');
  for (var i = 0; i < cards.length; i++) {
    cards[i].setAttribute('class', cards[i].className.replace(/selected/g, ''));
  }
  Solitaire.selectedCard = null;
}

window.addEventListener('DOMContentLoaded', Solitaire.init.bind(Solitaire))

function shuffle(array) {
  let counter = array.length;

  while (counter > 0) {
    let index = Math.floor(Math.random() * counter);
    counter--;
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}
