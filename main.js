
// Gameboard object
// contains array of board
// has a function to place markers on the board

const gameBoard = (function(){
    const boardArray = [[], [], []];
    const placeMarker = function(marker, position) {
        let [x, y] = [position[0] -1, position[1] - 1];
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
    return { placeMarker, getBoard, availableCells };
})();

// player object

function player(name, marker) {
    return {name, marker};
}

// game flow object
// each player takes a turn

const game = (function(){
    //Ask player for their name and marker of choice
    const createPlayer = function() {
        const playerName = prompt("What's your name?");
        const playerMarker = prompt("What's your marker? O or X");
        return player(playerName, playerMarker.toUpperCase());
    };
    // Ask player where to place the marker
    const playerChoice = function() {
        const playerChoiceX = prompt("Where to place the marker? Row 1 to 3");
        const playerChoiceY = prompt("Which column? 1-3");
        return [playerChoiceX, playerChoiceY];
    };
    // Take a turn, asking the player where to place marker and place it in the gameboard
    const turn = function(player) {
        gameBoard.placeMarker(player.marker, playerChoice());
    };
    // Play a round
    const playRound = function() {
        const player1 = createPlayer();
        const player2 = createPlayer();
        let activePlayer = player1;
        const switchPlayer = () => {
            activePlayer = activePlayer === player1 ? player2 : player1;
        };
        while(true) {
            console.table(gameBoard.getBoard());
            turn(activePlayer);
            if(isWin(activePlayer)) {
                console.log(`${activePlayer.name} wins!`);
                break;
            };
            // Check if all available cells are occupied for a tie
            if (isTie()) break;
            switchPlayer();
        };
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
            console.log(`It's a tie`);
            return true;
        };
    };
    return {playRound};
})();


const displayController = (function() {

});
