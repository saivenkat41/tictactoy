const urlParams = new URLSearchParams(window.location.search);
const player1Name = urlParams.get('player1') || 'Player 1';
const player1Mark = urlParams.get('player1Mark') || 'X';
const player2Name = urlParams.get('mode') === 'ai' ? 'AI' : (urlParams.get('player2') || 'Player 2');
const player2Mark = urlParams.get('player2Mark') || 'O';
const isAIPlayer = urlParams.get('mode') === 'ai'; 
let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = player1Mark;
let currentPlayerName = player1Name;
let gameActive = true;
const statusDisplay = document.getElementById("game-status");
const boardElement = document.getElementById("board");
const cells = document.querySelectorAll(".cell");
const restartBtn = document.getElementById("restart-btn");
const winConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];
const winLine = document.createElement('div');
winLine.classList.add('win-line');
boardElement.appendChild(winLine);
const updateStatus = () => {
    statusDisplay.textContent = `${currentPlayerName}'s turn (${currentPlayer})`;
};
const handleClick = (e) => {
    const clickedCell = e.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute("data-index"));

    if (board[clickedCellIndex] !== "" || !gameActive) {
        return;
    }
    handleCellPlayed(clickedCell, clickedCellIndex);
    handleResultValidation();
    if (isAIPlayer && currentPlayer === player2Mark && gameActive) {
        setTimeout(handleAIMove, 500);  
    }
};
const handleCellPlayed = (clickedCell, index) => {
    board[index] = currentPlayer;
    clickedCell.textContent = currentPlayer;
};
const handleResultValidation = () => {
    let roundWon = false;
    let winningLine = [];
    
    for (let i = 0; i < winConditions.length; i++) {
        const [a, b, c] = winConditions[i];
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            roundWon = true;
            winningLine = winConditions[i];
            break;
        }
    }
    if (roundWon) {
        drawWinLine(winningLine);
        statusDisplay.textContent = `${currentPlayerName} wins! Congratulations!`;
        gameActive = false;
        return;
    }
    if (!board.includes("")) {
        statusDisplay.textContent = "Game is a draw!";
        gameActive = false;
        return;
    }
    currentPlayer = currentPlayer === player1Mark ? player2Mark : player1Mark;
    currentPlayerName = currentPlayer === player1Mark ? player1Name : player2Name;
    updateStatus();
};
const handleAIMove = () => {
    if (!gameActive) return;  
    const emptyCells = board.map((cell, index) => cell === "" ? index : null).filter(index => index !== null);
    if (emptyCells.length > 0) {
        const aiMoveIndex = emptyCells[0];  
        const clickedCell = cells[aiMoveIndex];
        handleCellPlayed(clickedCell, aiMoveIndex);
        handleResultValidation();
    }
};
const drawWinLine = (winningLine) => {
    const firstCell = cells[winningLine[0]].getBoundingClientRect();
    const lastCell = cells[winningLine[2]].getBoundingClientRect();
    const boardRect = boardElement.getBoundingClientRect();
    const startX = firstCell.left + firstCell.width / 2 - boardRect.left;
    const startY = firstCell.top + firstCell.height / 2 - boardRect.top;
    const endX = lastCell.left + lastCell.width / 2 - boardRect.left;
    const endY = lastCell.top + lastCell.height / 2 - boardRect.top;
    const angle = Math.atan2(endY - startY, endX - startX) * 180 / Math.PI;
    const length = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
    winLine.style.width = `${length}px`;
    winLine.style.height = '5px';
    winLine.style.backgroundColor = 'red';
    winLine.style.position = 'absolute';
    winLine.style.transformOrigin = '0 0'; 
    winLine.style.transform = `translate(${startX}px, ${startY}px) rotate(${angle}deg)`;
};
const restartGame = () => {
    board = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = player1Mark;
    currentPlayerName = player1Name;
    gameActive = true;
    statusDisplay.textContent = "";
    cells.forEach(cell => (cell.textContent = ""));
    updateStatus(); 
    winLine.style.width = '0';  
};
cells.forEach(cell => cell.addEventListener("click", handleClick));
restartBtn.addEventListener("click", restartGame);
updateStatus();

