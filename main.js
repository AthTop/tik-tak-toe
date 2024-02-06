
// Gameboard object
// contains array of board
// has a function to place markers on the board

const gameBoard = (function(){
    let boardArray = [];
    const boardArrayInit = function(){
        boardArray = []
        for(let i = 0; i < 3; i++){
            boardArray[i] = [];
            for (let j = 0; j < 3; j++) {
                boardArray[i].push('');
            };
        };
    };
    const resetBoard = function() {
        boardArrayInit();
    };
    // If cell is occupied with another marker, return false for UI
    const placeMarker = function(marker, selectedCell) {
        [x, y] = arrayToInt(selectedCell);
        boardArray[x][y] = marker;
    };
    const getBoard = function() {
        return boardArray.map((v) => (v));
    };
    const boardCells = function() {
        let cells = 0;
        boardArray.forEach((row) => {
            row.forEach((item) => {
                if(item === 'X' || item === 'O') {
                    cells++;
                };
            });
        });
        return cells;
    };
    const availableCells = function() {
        return (9 - boardCells());
    };
    const isCellOccupied = function(selectedCell) {
        [x, y] = arrayToInt(selectedCell);
        if(boardArray[x][y] === 'X' || boardArray[x][y] === 'O'){
            return true;
        };
        return false;
    };
    const arrayToInt = function(array) {
        let [x, y] = array;
        return [parseInt(x), parseInt(y)];
    }
    return { placeMarker, getBoard, availableCells, isCellOccupied, resetBoard };
})();

function player(name, marker, score) {
    return {name, marker, score};
}

const game = (function(){
    const players = [];
    let activePlayer = players[0];
    let roundState = '';
    //Ask player for their name and marker of choice
    const createPlayer = function(playerName) {
        const score = 0;
        let playerMarker = 'X';
        if (!(players[0] === undefined) ) playerMarker = 'O';
        players.push(player(playerName, playerMarker, score));
    };
    // Take a turn, asking the player where to place marker and place it in the gameboard
    // Reccursively check if cell is occupied
    const turn = function(player, selectedCell) {
        if (gameBoard.isCellOccupied(selectedCell)) {
            return false;
        };
        gameBoard.placeMarker(player.marker, selectedCell);
    };
    // Returns players info
    const getPlayers = function() {
        return players;
    };
    const switchPlayer = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };
    const getActivePlayer = function() {
        return activePlayer.name;
    };
    // init game
    const initGame = function() {
        activePlayer = players[0];
        roundStateChange('');
        gameBoard.resetBoard();
    };
    // Play a round
    const playRound = function(selectedCell) {
        while(true) {
            if(!turn(activePlayer, selectedCell)){
                if(isWin(activePlayer)) {
                    activePlayer.score++;
                    roundStateChange('win');
                    return;
                };
                // Check if all available cells are occupied for a tie
                if (isTie()) {
                    roundStateChange('tie');
                    return;
                };
                switchPlayer();
                break;
            };
        };
    };
    const roundStateChange = function(condition){
        roundState = condition;
    };
    const roundStateStatus = function(){
        return roundState;
    };
    // Winning condition
    const isWin = function(player) {
        // Helper function to compare elements in array to marker
        const compareMarker = function(array) {
            let count = 0;
            for (let i = 0; i < array.length; i++) {
                if (array[i] === player.marker) count++;
                if (count === 3) return true;
            };
        };
        // Helper function to get diagonal arrays 
        const diagonalArray = array => array.map((value, index) => value[index]);
        // Helper arrays for diagonals
        const diagonalRight = diagonalArray(gameBoard.getBoard().reverse());
        const diagonalLeft = diagonalArray(gameBoard.getBoard());
        // Check Rows and Columns  
        for (let i = 0; i < gameBoard.getBoard().length; i++) {
            const row = gameBoard.getBoard()[i];
            // Helper array for columns
            const columnArray = gameBoard.getBoard().map(column => column[i]);
            if(compareMarker(row)) return true;
            if(compareMarker(columnArray)) return true;
        };
        // Check Diagonals
        if(compareMarker((diagonalRight))) return true;
        if(compareMarker((diagonalLeft))) return true;
        return false;
    };
    const isTie = function() {
        if (gameBoard.availableCells() === 0){
            return true;
        };
    };
    return { initGame, playRound, getPlayers, createPlayer, getActivePlayer, roundStateStatus };
})();


const displayController = (function() {
    const containerDiv = document.querySelector('.container');
    const boardDiv = document.createElement('div');
    boardDiv.classList.add('board');
    const infoDiv = document.createElement('div');
    infoDiv.classList.add('info');
    const updateScreen = function() {
        boardDiv.textContent = '';
        infoDiv.textContent = '';
        containerDiv.classList.add('game');
        const board = gameBoard.getBoard();
        const players = game.getPlayers();
        // Display players info
        for (const player of players) {
            const playerDiv = document.createElement('div');
            playerDiv.classList.add('player');
            if(player.name === game.getActivePlayer()){
                playerDiv.classList.add('active-player');
            };
            for (const prop in player) {
                const p = document.createElement('p');
                p.textContent = `${prop} : ${player[prop]}`;
                playerDiv.append(p);
            };
            infoDiv.append(playerDiv);
        };
        const resetButton = document.createElement('button');
        resetButton.classList.add('reset');
        resetButton.textContent = 'Reset';
        infoDiv.append(resetButton);
        // Display the board
        board.forEach((row, i) => {
            row.forEach((cell, j) => {
                const cellButton = document.createElement('button');
                cellButton.classList.add('cell');
                cellButton.dataset.row = i;
                cellButton.dataset.column = j;
                cellButton.textContent = cell;
                boardDiv.appendChild(cellButton);
            });
        });
        // Append the divs to the container 
        containerDiv.appendChild(infoDiv);
        containerDiv.appendChild(boardDiv);
    };
    function clickCellHandler(e){
        if (e.target.classList.contains('cell')){
            const selectedCell = [e.target.dataset.row, e.target.dataset.column];
            if(!selectedCell) return;
            game.playRound(selectedCell)
            if(game.roundStateStatus() === 'win' || game.roundStateStatus() === 'tie') {
                displayStatus();
                game.initGame();
            };
            updateScreen();
        };   
    };
    const displayStatus = function() {
        const dialog = document.createElement('dialog');
        const p = document.createElement('p');
        p.classList.add('message');
        dialog.open = true;
        if(game.roundStateStatus() === 'win') {
            p.textContent = `${game.getActivePlayer()} wins this round!`;
        };
        if(game.roundStateStatus() === 'tie') {
            p.textContent = `It's a tie!`;
        };
        dialog.appendChild(p);
        containerDiv.appendChild(dialog);
        setTimeout(() => {
            dialog.remove();
        }, 3000);
    };
    // Player Info Intereaction
    const playerInputInfo = function() {
        const modal = document.querySelector('dialog');
        const player1 = document.querySelector('#player-1');
        const player2 = document.querySelector('#player-2');
        modal.showModal();
        modal.addEventListener('click', (e) => {
            if (e.target.classList.contains('submit-names')) {
                e.preventDefault();
                game.createPlayer(player1.value);
                game.createPlayer(player2.value);
                modal.close();
                game.initGame();
                updateScreen();
            };
        });
    };
    // Create a begin game screen
    const startScreen = function() {
        const startScreentDiv = document.createElement('div');
        const startButton = document.createElement('button');
        startButton.classList.add('start-button');
        startScreentDiv.classList.add('start-screen');
        startButton.textContent = 'Select Players';
        startScreentDiv.append(startButton);
        containerDiv.append(startScreentDiv);
    };
    function clickStartHandler(e){
        if (e.target.classList.contains('start-button')){
            containerDiv.textContent = '';
            playerInputInfo();
        };
    };
    function resetHandler(e) {
        if(e.target.classList.contains('reset')){
            gameBoard.resetBoard();
            updateScreen();
        };
    };
    containerDiv.addEventListener('click', clickStartHandler);
    containerDiv.addEventListener('click', clickCellHandler);
    containerDiv.addEventListener('click', resetHandler);
    return { startScreen };
})();

displayController.startScreen();