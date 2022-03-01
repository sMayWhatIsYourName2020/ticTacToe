const field = document.querySelector('.table')
const startButton = document.querySelector('.player__start');
const resetButton = document.querySelector('.player__reset');
const againButton = document.querySelector('.player__again');
const winnerStrategy = {
  1: [1, 2, 3],
  2: [4, 5, 6],
  3: [7, 8, 9],
  4: [1, 4, 7],
  5: [2, 5, 8],
  6: [3, 6, 9],
  7: [1, 5, 9],
  8: [3, 5, 7],
};
const playersWins = {
  first: 0,
  second: 0,
}
const movesPlayer1 = [];
const movesPlayer2 = [];
let firstMove = 'second';

let flag = firstMove === 'first';
firstMove = firstMove === 'first' ? 'second' : 'first';
let hasWinner = null;
let movesCount = 0;

const func = (event) => {
  movesCount += 1;
  if (hasWinner !== null) {
    return;
  }
  const cell = event.target;
  flag = !flag;
  if (cell.textContent !== '') {
    return;
  }
  if (flag) {
    document.querySelector('.player__first__name').classList.remove('active');
    document.querySelector('.player__second__name').classList.add('active');
    cell.textContent = 'X';
    movesPlayer1.push(+cell.dataset.cellNumber);
    console.log(checkWinner(movesPlayer1, 'first'));
  } else {
    document.querySelector('.player__second__name').classList.remove('active');
    document.querySelector('.player__first__name').classList.add('active');
    cell.textContent = 'O';
    movesPlayer2.push(+cell.dataset.cellNumber);
    console.log(checkWinner(movesPlayer2, 'second'));
  }
  field.removeEventListener('click', func);
};

const checkWinner = (arr, name) => {
  if (arr.length < 3) {
    return;
  }
  for (const value of Object.values(winnerStrategy)) {
    const result = [];
    arr.forEach((item) => value.includes(item) ? result.push(item) : null);
    if (result.length === 3) {
      styleWinners(result, name)
      hasWinner = true;
      return true;
    }
  }
  if (movesCount === 9) {
    // movesCount = 0;
    document.querySelector('.active').classList.remove('active');
    styleDraw();
    return true;
  }
  return null;
};

const styleWinners = (arr, winner) => {
  const loser = winner === 'first' ? 'second' : 'first';
  for (const item of arr) {
    document.querySelector(`*[data-cell-number="${item}"]`).classList.add('winnerCombination');
    document.querySelector(`.player__${winner}__name`).classList.add('winnerCombination');
    document.querySelector(`.player__${loser}__name`).classList.remove('active');
  }
  const score = document.querySelector(`.player__${winner}__score`);
  score.textContent = ++playersWins[winner];
};

const styleDraw = () => {
  const names = document.querySelectorAll('.player__name');
  names.forEach((name) => name.classList.add('drawCombination'));
}

startButton.addEventListener('click', (e) => {
  field.addEventListener('click', func, true);
  e.currentTarget.remove();
  againButton.classList.remove('invisible');
  resetButton.classList.remove('invisible');
});

const clear = () => {
  const elements = document.querySelectorAll('.table__cell');
  elements.forEach((elem) => {
    elem.innerHTML = '';
    elem.classList.remove('winnerCombination');
  });
  const winner = document.querySelector('.winnerCombination');
  if (winner) {
    document.querySelector('.winnerCombination').classList.remove('winnerCombination');
  }
  const drawElements = document.querySelectorAll('.drawCombination');
  if (drawElements) {
    drawElements.forEach((elem) => elem.classList.remove('drawCombination'));
  }
}

againButton.addEventListener('click', (e) => {
  movesCount = 0;
  // field.removeEventListener('click', func);
  movesPlayer1.length = 0;
  movesPlayer2.length = 0;
  field.addEventListener('click', func, true);
  hasWinner = null
  clear();
});

resetButton.addEventListener('click', (e) => {
  movesCount = 0;
  movesPlayer1.length = 0;
  movesPlayer2.length = 0;
  for (const key of Object.keys(playersWins)) {
    playersWins[key] = 0;
    const score = document.querySelector(`.player__${key}__score`);
    score.textContent = 0;
  }
  field.addEventListener('click', func, true);
  hasWinner = null
  clear();
});