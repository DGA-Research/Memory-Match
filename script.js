let configData = null;
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let matchesFound = 0;
let missesCount = 0;
let cardsArray = [];  // This will be built based on config

const gameBoard = document.getElementById('gameBoard');
const restartBtn = document.getElementById('modalRestartBtn');
const matchesCountEl = document.getElementById('matchesCount');
const missesCountEl = document.getElementById('missesCount');
const winModal = document.getElementById('winModal');

// Fisher-Yates Shuffle
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function createBoard() {
  gameBoard.innerHTML = '';
  firstCard = null;
  secondCard = null;
  lockBoard = false;
  matchesFound = 0;
  missesCount = 0;
  matchesCountEl.textContent = matchesFound;
  missesCountEl.textContent = missesCount;
  winModal.style.display = "none";
  
  // Calculate number of pairs from totalCards (should be even)
  const pairsNeeded = configData.totalCards / 2;
  // Use the first pairsNeeded images from cardFaces
  let selectedFaces = configData.cardFaces.slice(0, pairsNeeded);
  
  // Duplicate to create pairs and shuffle
  cardsArray = selectedFaces.concat(selectedFaces);
  shuffle(cardsArray);
  
  // Create card elements
  cardsArray.forEach((faceSrc) => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.face = faceSrc;
    
    const cardInner = document.createElement('div');
    cardInner.classList.add('card-inner');
    
    // Card front: displays the face image
    const cardFront = document.createElement('div');
    cardFront.classList.add('card-front');
    const img = document.createElement('img');
    img.src = faceSrc;
    cardFront.appendChild(img);
    
    // Card back: choose a random back image from configData.backFaces
    const cardBack = document.createElement('div');
    cardBack.classList.add('card-back');
    const randomBackIndex = Math.floor(Math.random() * configData.backFaces.length);
    cardBack.style.backgroundImage = `url('${configData.backFaces[randomBackIndex]}')`;
    
    cardInner.appendChild(cardFront);
    cardInner.appendChild(cardBack);
    card.appendChild(cardInner);
    
    // Click event to flip card
    card.addEventListener('click', () => {
      if (lockBoard || card.classList.contains('flip')) return;
      card.classList.add('flip');
      
      if (!firstCard) {
        firstCard = card;
      } else {
        secondCard = card;
        lockBoard = true;
        checkForMatch();
      }
    });
    
    gameBoard.appendChild(card);
  });
}

function checkForMatch() {
  const isMatch = firstCard.dataset.face === secondCard.dataset.face;
  
  if (isMatch) {
    resetBoard();
    matchesFound++;
    matchesCountEl.textContent = matchesFound;
    if (matchesFound === configData.totalCards / 2) {
      setTimeout(showWinModal, 300);
    }
  } else {
    setTimeout(() => {
      firstCard.classList.remove('flip');
      secondCard.classList.remove('flip');
      resetBoard();
      missesCount++;
      missesCountEl.textContent = missesCount;
    }, 1000);
  }
}

function resetBoard() {
  [firstCard, secondCard] = [null, null];
  lockBoard = false;
}

function showWinModal() {
  winModal.style.display = "block";
}

document.addEventListener("DOMContentLoaded", () => {
  fetch('config.json')
    .then(response => response.json())
    .then(config => {
      configData = config;
      createBoard();
    })
    .catch(err => {
      console.error("Error loading config:", err);
    });
});

// Restart game using modal restart button
document.getElementById('modalRestartBtn').addEventListener('click', createBoard);
