/**
 * @author Francisco Javier González Sabariego
 * 
 * TetrisGame Class:
 * 
 * 
 */

class TetrisGame {
    static #MAX_SCORE = 0;
    #numRowsDeleted   = 0;
    #score            = 0;
    #idPlay           = 0;
    #boardGame        = [];
    #pieces           = [];

    constructor(numberOfRows = 20, numberOfColumns = 10) {
        this.#boardGame    = this.#createBoardGame(numberOfRows,numberOfColumns);
        this.#pieces.push( new Piece(this.#generatePiece(),this.#boardGame) );
        this.#pieces.push( new Piece(this.#generatePiece(),this.#boardGame) );
    }

    getBoardGame = function() {
        return this.#boardGame;
    }

    getCoordinatesNextPiece() {
        /* const coordinates = {
            'L': [],
            'J': [],
            'Z': [],
            'S': [],
            'T': [],
            'O': [],
            'I': []
        } */
        return this.#pieces[1].getCharacter();
    }

    togglePause = function() {
        this.#idPlay == 0 ? (this.#idPlay = this.#play()) : this.#pause();
    }

    rotatePiece = function() {
        if (this.#idPlay == 0) return;
        this.#pieces[0].rotate();
    }

    movePiece = function(direction) {
        if (this.#idPlay == 0) return;
        this.#pieces[0].move(0,direction == 'LEFT' ? -1 : 1);
    }

    descendPiece = function() {
        if (this.#idPlay == 0) return;
        this.#pieces[0].move(1);
    }

    #generatePiece = function() {
        const LETTER = {
            '0': 'L',
            '1': 'J',
            '2': 'Z',
            '3': 'S',
            '4': 'T',
            '5': 'O',
            '6': 'I'
        }
        return LETTER[ parseInt( Math.random() * 7 ) ]; //need * 7, but I must create 'I' piece rotation before
    }

    #play = function() {
        let tetris = this;
        return setInterval(
            () => {
                if (tetris.#pieces[0].getFixed()) {
                    tetris.#pieces.shift();
                    tetris.#pieces.push( new Piece(this.#generatePiece(),this.#boardGame) );
                    tetris.#cleanboardGame();
                }
                console.log(tetris.#pieces[1]);
                tetris.#pieces[0].move(1);
            }, 500);
    }

    #pause = function() {
        clearInterval(this.#idPlay);
        this.#idPlay = 0;
    }

    #createBoardGame = function(numberRows,numberColumns) {
        let boardGame = [];
        for (let i = 0; i < numberRows; i++) {
            boardGame.push([]);
            for (let j = 0; j < numberColumns; j++) 
                boardGame[i].push(' ');
        }
        return boardGame;
    }

    #checkCleanRow = row => {
        for (let i = 0; i < row.length; i++) 
            if (row[i] == ' ') return false;
        return true;
    }


    #replaceRowByOtherRow = function (currentRow,replaceByThisRow) {
        if (replaceByThisRow < 0)
            for (let i = 0; i < this.#boardGame[currentRow].length; i++)
                this.#boardGame[currentRow][i] = ' ';
        else
            for (let i = 0; i < this.#boardGame[currentRow].length; i++)
                this.#boardGame[currentRow][i] = this.#boardGame[replaceByThisRow][i];
    }


    #cleanboardGame = function() {
        let rowToClean = [];
        let rowToCopy  = this.#boardGame.length;
        for (let i = this.#boardGame.length - 1; i > -1; i--) 
            this.#checkCleanRow(this.#boardGame[i]) ? rowToClean.push(i) : false;
        if (rowToClean.length == 0) return;
        for (let currentRow = this.#boardGame.length - 1; currentRow > -1; currentRow--) {
            if (currentRow > rowToClean[0]) continue;
            do {
                --rowToCopy;
            } while (rowToCopy > currentRow || rowToClean.includes(rowToCopy));
            this.#replaceRowByOtherRow(currentRow,rowToCopy);
        }
    }
}