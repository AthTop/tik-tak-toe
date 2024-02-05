
// Gameboard object
// contains array of board
// has a function to place markers on the board

const gameBoard = (function(){
    let boardArray = [[], [], []];
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
        
    };
    // Winning condition
    const winCheck = function() {
        // Helper functions
        // Helper function to compare all elements in an array
        const allEqual = array => array.every(val => val === array[0]);
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
            if(allEqual(row)) return console.log(row[0] + `Row ${i}`);
            if(allEqual(columnArray)) return console.log(columnArray[0] + `Column ${i}`);
        };
        // Check Diagonals
        if(allEqual((diagonalRight))) return console.log(diagonalRight[0] + ' Diagonal from Right');
        if(allEqual((diagonalLeft))) return console.log(diagonalLeft[0] + ' Diagonal from Left');
    };
    return {winCheck, createPlayer, turn};
})();


const displayController = (function() {

});
