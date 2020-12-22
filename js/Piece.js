/**
 * 
 */

class Piece {
    #character       = '';
    #currentRotation = 0;
    #coordinates     = [];
    #boardGame       = [];

    constructor(character,boardGame = null) { //retirar null
        this.#character = character;
        this.#boardGame = boardGame;
        this.#coordinates = [
            [[],[0,1],[]],
            [[1,0],[1,1],[1,2]]
            /* [[0,0],[0,1],[]],
            [[],[1,1],[1,2]] */
            /* [[],[],[0,2]],
            [[1,0],[1,1],[1,2]] */
            /* [[0,0],[0,1],[0,2]],
            [[1,0],[1,1],[1,2]] */
        ]; //= this.#createInitialCoordinates(this.#character,this.#boardGame[0].length);
        this.#printPiece();
    }

    getCoordinates = function() {
        return this.#coordinates;
    }

    rotate = function () {
        if (this.#coordinates.length == 2 && this.#coordinates[0].length == 2) return;
        const rotation = this.#getCoordinatesRotation(this.#currentRotation);
        this.#cleanPiece();
        for (let i = 0; i < this.#coordinates.length; i++) {
            for (let j = 0; j < this.#coordinates[0].length; j++) {
                if (!this.#coordinates[i][j].length) continue;
                this.#coordinates[i][j][0] += rotation[i][j][0];
                this.#coordinates[i][j][1] += rotation[i][j][1];
            }
        }
        this.#currentRotation = this.#currentRotation == 3 ? 0 : this.#currentRotation + 1;
        this.#printPiece();
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
            ]
        }
        return rotation[currentRotation];
    }

    #cleanPiece = function() {
        for (let i = 0; i < this.#coordinates.length; i++) 
            for (let j = 0; j < this.#coordinates[0].length; j++) {
                if (!this.#coordinates[i][j].length) continue;
                const row = this.#coordinates[i][j][0];
                const col = this.#coordinates[i][j][1];
                this.#boardGame[row][col] = ' ';
            }
    }

    #printPiece = function() {
        for (let i = 0; i < this.#coordinates.length; i++) 
            for (let j = 0; j < this.#coordinates[0].length; j++) {
                if (!this.#coordinates[i][j].length) continue;
                const row = this.#coordinates[i][j][0];
                const col = this.#coordinates[i][j][1];
                this.#boardGame[row][col] = this.#character;
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
            'I': [                                                                                  // [][][][]
                /* [[-1,boardGameRowLength - 1],[-1,boardGameRowLength],[-1,boardGameRowLength + 1],[-1,boardGameRowLength + 2]] */
            ]
        }
        return coordinates[character];
    }
}