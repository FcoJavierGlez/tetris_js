/**
 * @author Francisco Javier González Sabariego
 * 
 * Piece Class:
 * 
 * 
 */

class Piece {
    #character        = '';
    #currentRotation  = 0;
    #coordinates      = [];
    #boardGame        = [];
    #underCollision   = false;
    #fixed            = false;
    #idCountdownFixed = 0;
    #timerToFixed     = 1000;

    constructor(character,boardGame) {
        this.#character = character;
        this.#boardGame = boardGame;
        this.#coordinates = this.#createInitialCoordinates(this.#character,this.#boardGame[0].length);
    }

    getCharacter = function() {
        return this.#character;
    }

    getUnderCollision = function() {
        return this.#underCollision;
    }

    getFixed = function() {
        return this.#fixed;
    }

    enableFixed = function() {
        this.#disableCountDownFixed();
        this.#fixed = true;
    }

    move = function(row,col = 0) {
        let newCoordinates = JSON.parse( JSON.stringify(this.#coordinates) );
        if (this.#fixed) return;
        newCoordinates = this.#calculateCoordinatesAfterMove(newCoordinates,row,col);
        this.#reLocatePiece(newCoordinates);
        this.#enableDisableFixedSystem();
    }

    rotate = function () {
        let newCoordinates = JSON.parse( JSON.stringify(this.#coordinates) );
        if (this.#fixed) return;
        if (this.#coordinates.length == 2 && this.#coordinates[0].length == 2) return;
        newCoordinates = this.#calculateCoordinatesAfterRotation(newCoordinates, newCoordinates.length == 1 ? 
            this.#getCoordinatesRotation(4) : this.#getCoordinatesRotation(this.#currentRotation));
        this.#reLocatePiece(newCoordinates);
        this.#enableDisableFixedSystem();
        this.#currentRotation = !this.#validateCoordinates(newCoordinates) ? this.#currentRotation : this.#currentRotation == 3 ? 0 : this.#currentRotation + 1;
    }

    #enableDisableFixedSystem = function() {
        this.#underCollision = this.#checkUnderCollision(this.#coordinates);
        this.#underCollision && this.#idCountdownFixed == 0 ? (this.#idCountdownFixed = this.#enableCountDownFixed()) : 0;
        !this.#underCollision ? this.#disableCountDownFixed() : 0;
    }

    #enableCountDownFixed = function() {
        const piece = this;
        return setInterval(
            () => {
                piece.#fixed = (piece.#timerToFixed -= 100) == 0;//500
                piece.#fixed ? piece.#disableCountDownFixed(piece.#idCountdownFixed) : false;
            }, 100);
    }

    #disableCountDownFixed = function() {
        clearInterval(this.#idCountdownFixed);
        this.#idCountdownFixed = 0;
    }

    #reLocatePiece = function(newCoordinates) {
        this.#cleanOrPrintPiece();
        this.#coordinates = this.#validateCoordinates(newCoordinates) ? newCoordinates : this.#coordinates;
        this.#cleanOrPrintPiece(true);
    }

    #calculateCoordinatesAfterMove = function(coordinates,row,col) {
        for (let i = 0; i < coordinates.length; i++){
            for (let j = 0; j < coordinates[0].length; j++) {
                if (!coordinates[i][j].length) continue;
                coordinates[i][j][0] += row;
                coordinates[i][j][1] += col;
            }
        }
        return coordinates;
    }

    #calculateCoordinatesAfterRotation = function(coordinates,rotation) {
        if (coordinates.length == 1)
            for (let j = 0; j < coordinates[0].length; j++) {
                coordinates[0][j][0] += this.#currentRotation % 2 ? -rotation[j][0] : rotation[j][0];
                coordinates[0][j][1] += this.#currentRotation % 2 ? -rotation[j][1] : rotation[j][1];
            }
        else
            for (let i = 0; i < coordinates.length; i++)
                for (let j = 0; j < coordinates[0].length; j++) {
                    if (!coordinates[i][j].length) continue;
                    coordinates[i][j][0] += rotation[i][j][0];
                    coordinates[i][j][1] += rotation[i][j][1];
                }
        return coordinates;
    }

    #checkCoordinateIsPieceSelf = function([checkRow,checkCol]) {
        for (let i = 0; i < this.#coordinates.length; i++) 
            for (let j = 0; j < this.#coordinates[0].length; j++) {
                if (!this.#coordinates[i][j].length) continue;
                const row = this.#coordinates[i][j][0];
                const col = this.#coordinates[i][j][1];
                if (checkRow == row && checkCol == col) return true;
            }
        return false;
    }

    #validateCoordinates = function(newCoordinates) {
        for (let i = 0; i < newCoordinates.length; i++) 
            for (let j = 0; j < newCoordinates[0].length; j++) {
                if (!newCoordinates[i][j].length) continue;
                const row = newCoordinates[i][j][0];
                const col = newCoordinates[i][j][1];
                if (row < 0) continue;
                if (row > this.#boardGame.length - 1 || col < 0 || col > this.#boardGame[0].length - 1) return false;
                if (this.#boardGame[row][col] != ' ' && !this.#checkCoordinateIsPieceSelf([row,col])) return false;
            }
        return true;
    }

    #checkUnderCollision = function(coordinates) {
        for (let i = 0; i < coordinates.length; i++) 
            for (let j = 0; j < coordinates[0].length; j++) {
                if (!coordinates[i][j].length) continue;
                const row = coordinates[i][j][0];
                const col = coordinates[i][j][1];
                if (row < 0 || col < 0 || col > this.#boardGame[0].length - 1) continue;
                if (row == this.#boardGame.length - 1) return true;
                if (this.#boardGame[row + 1][col] != ' ' && !this.#checkCoordinateIsPieceSelf([row + 1,col])) return true;
            }
        return false;
    }

    #getCoordinatesRotation = function(currentRotation) {
        const rotation = {
            0: [
                [[0,2],[1,1],[2,0]],
                [[-1,1],[0,0],[1,-1]]
            ],
            1: [
                [[2,0],[1,-1],[0,-2]],
                [[1,1],[0,0],[-1,-1]]
            ],
            2: [
                [[0,-2],[-1,-1],[-2,0]],
                [[1,-1],[0,0],[-1,1]]
            ],
            3: [
                [[-2,0],[-1,1],[0,2]],
                [[-1,-1],[0,0],[1,1]]
            ],
            4: [
                [-1,1],[0,0],[1,-1],[2,-2]
            ]
        }
        return rotation[currentRotation];
    }

    #cleanOrPrintPiece = function(print = false) {
        for (let i = 0; i < this.#coordinates.length; i++) 
            for (let j = 0; j < this.#coordinates[0].length; j++) {
                if (!this.#coordinates[i][j].length) continue;
                const row = this.#coordinates[i][j][0];
                const col = this.#coordinates[i][j][1];
                if (row < 0 || row > this.#boardGame.length || col < 0 || col > this.#boardGame[0].length) continue;
                this.#boardGame[row][col] = print ? this.#character : ' ';
            }
    }

    #createInitialCoordinates = function(character,boardGameRowLength) {
        boardGameRowLength = parseInt(boardGameRowLength / 2);
        const coordinates = {
            'L': [
                [[],[],[-2,boardGameRowLength + 1]],                                                //     []
                [[-1,boardGameRowLength - 1],[-1,boardGameRowLength],[-1,boardGameRowLength + 1]]   // [][][]
            ],
            'J': [
                [[-2,boardGameRowLength - 1],[],[]],                                                // []
                [[-1,boardGameRowLength - 1],[-1,boardGameRowLength],[-1,boardGameRowLength + 1]]   // [][][]
            ],
            'Z': [
                [[-2,boardGameRowLength - 1],[-2,boardGameRowLength],[]],                           // [][]
                [[],[-1,boardGameRowLength],[-1,boardGameRowLength + 1]]                            //   [][]
            ],
            'S': [
                [[],[-2,boardGameRowLength],[-2,boardGameRowLength + 1]],                           //   [][]
                [[-1,boardGameRowLength - 1],[-1,boardGameRowLength],[]]                            // [][]
            ],
            'T': [
                [[],[-2,boardGameRowLength],[]],                                                    //   []
                [[-1,boardGameRowLength - 1],[-1,boardGameRowLength],[-1,boardGameRowLength + 1]]   // [][][]
            ],
            'O': [
                [[-2,boardGameRowLength - 1],[-2,boardGameRowLength]],                              // [][]
                [[-1,boardGameRowLength - 1],[-1,boardGameRowLength]]                               // [][]
            ],
            'I': [                                                                                  // [][][][]
                [[-1,boardGameRowLength - 1],[-1,boardGameRowLength],[-1,boardGameRowLength + 1],[-1,boardGameRowLength + 2]]
            ]
        }
        return coordinates[character];
    }
}