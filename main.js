
// Gameboard object
// contains array of board
// has a function to place markers on the board

const gameBoard = (function(){
    let boardArray = [['', '', '',], [], []];
    const placeMarker = function(marker, position) {
        let [x, y] = [position[0] -1, position[1] - 1];
        boardArray[x][y] = marker;
    };
    const board = function() {
        return boardArray.map((v) => (v));
    };
    return { placeMarker, board };
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
        let playerName = prompt("What's your name?");
        let playerMarker = prompt("What's your marker? O or X");
        return player(playerName, playerMarker.toUpperCase());
    };
    // Ask player where to place the marker
    const playerChoice = function() {
        let playerChoiceX = prompt("Where to place the marker? Row 1 to 3");
        let playerChoiceY = prompt("Which column? 1-3");
        return [playerChoiceX, playerChoiceY];
    };
    // Take a turn, asking the player where to place marker and place it in the gameboard
    const turn = function(player) {
        gameBoard.placeMarker(player.marker, playerChoice());
    };
    // Game loop
    const gameLoop = function() {
        let player1 = createPlayer();
        do {
            turn(player1);
        }
        while (!winCheck(player1.marker));
        console.log(`${player1.name} wins.`);
    };
    // Winning condition
    const winCheck = function(marker) {
        // Helper functions
        // Helper function to compare elements in array to marker
        const compareMarker = function(array) {
            let count = 0;
            for (let i = 0; i < array.length; i++) {
                if (array[i] === marker) count++;
                if (count === 3) return true;
            };
        };
        // Helper function to get diagonal arrays 
        const diagonalArray = array => array.map((value, index) => value[index]);
        // Helper arrays for diagonals
        let diagonalRight = diagonalArray(gameBoard.board().reverse());
        let diagonalLeft = diagonalArray(gameBoard.board());
        // Check Rows and Columns  
        for (let i = 0; i < gameBoard.board().length; i++) {
            let row = gameBoard.board()[i];
            // Helper array for columns
            let columnArray = gameBoard.board().map(column => column[i]);
            if(compareMarker(row)) return true;
            if(compareMarker(columnArray)) return true;
        };
        // Check Diagonals
        if(compareMarker((diagonalRight))) return true;
        if(compareMarker((diagonalLeft))) return true;
        return false;
    };
    return {gameLoop};
})();


const displayController = (function() {

});
