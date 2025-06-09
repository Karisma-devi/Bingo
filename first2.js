const bingoBoard = document.getElementById('bingo');
const gridSize = 5;
let state = [];
let linesCompleted = new Set();

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function createBingoGrid() {
  const numbers = shuffle([...Array(25).keys()].map(n => n + 1));
  state = Array.from({ length: gridSize }, () => Array(gridSize).fill(false));
  linesCompleted.clear();
  bingoBoard.innerHTML = '';

  numbers.forEach((number, index) => {
    const row = Math.floor(index / gridSize);
    const col = index % gridSize;
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.textContent = number;
    cell.dataset.row = row;
    cell.dataset.col = col;
    bingoBoard.appendChild(cell);

    cell.addEventListener('click', () => {
      if (!cell.classList.contains('crossed')) {
        cell.classList.add('crossed');
        cell.textContent = '❌';
        state[row][col] = true;
        checkAndMarkLines();
        if (linesCompleted.size >= 5) {
          setTimeout(() => alert("🎉 Bingo! You Win!"), 100);
        }
      }
    });
  });
}

function checkAndMarkLines() {
  const getCell = (r, c) =>
    document.querySelector(`.cell[data-row="${r}"][data-col="${c}"]`);

  // Rows
  for (let i = 0; i < gridSize; i++) {
    if (!linesCompleted.has(`row-${i}`) && state[i].every(v => v)) {
      linesCompleted.add(`row-${i}`);
      for (let j = 0; j < gridSize; j++) {
        getCell(i, j).classList.add('line');
      }
    }
  }

  // Columns
  for (let j = 0; j < gridSize; j++) {
    let colWin = true;
    for (let i = 0; i < gridSize; i++) {
      if (!state[i][j]) {
        colWin = false;
        break;
      }
    }
    if (colWin && !linesCompleted.has(`col-${j}`)) {
      linesCompleted.add(`col-${j}`);
      for (let i = 0; i < gridSize; i++) {
        getCell(i, j).classList.add('line');
      }
    }
  }

  // Diagonal: top-left to bottom-right
  let diag1 = true;
  for (let i = 0; i < gridSize; i++) {
    if (!state[i][i]) diag1 = false;
  }
  if (diag1 && !linesCompleted.has('diag1')) {
    linesCompleted.add('diag1');
    for (let i = 0; i < gridSize; i++) {
      getCell(i, i).classList.add('line');
    }
  }

  // Diagonal: top-right to bottom-left
  let diag2 = true;
  for (let i = 0; i < gridSize; i++) {
    if (!state[i][gridSize - 1 - i]) diag2 = false;
  }
  if (diag2 && !linesCompleted.has('diag2')) {
    linesCompleted.add('diag2');
    for (let i = 0; i < gridSize; i++) {
      getCell(i, gridSize - 1 - i).classList.add('line');
    }
  }
}

function startNewGame() {
  createBingoGrid();
}

// Start game on page load
startNewGame();
