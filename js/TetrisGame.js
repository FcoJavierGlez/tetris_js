/**
 * @author Francisco Javier González Sabariego
 * 
 * TetrisGame Class:
 * 
 * 
 */

class TetrisGame {
    static #MAX_SCORE   = 0;
    static #LIMIT_SCORE = 999999;
    static #LIMIT_LEVEL = 20;

    #lines              = 0;
    #score              = 0;//999999
    #idPlay             = 0;
    #boardGame          = [];
    #pieces             = [];
    #endGame            = false;

    constructor(numberOfRows = 20, numberOfColumns = 10,maxScore) {
        TetrisGame.#MAX_SCORE = maxScore;
        this.#boardGame       = this.#createBoardGame(numberOfRows,numberOfColumns);
        this.#pieces.push( new Piece(this.#generatePiece(),this.#boardGame) );
        this.#pieces.push( new Piece(this.#generatePiece(),this.#boardGame) );
    }

    getBoardGame = function() {
        return this.#boardGame;
    }

    getLines = function() {
        return this.#lines;
    }

    getLevel = function() {
        let currentLevel = 0;
        return (currentLevel = parseInt(this.#lines / 10)) > TetrisGame.#LIMIT_LEVEL ? TetrisGame.#LIMIT_LEVEL : currentLevel;
    }

    getScore = function() {
        return this.#score;
    }

    getInfoPreviewNextPiece() {
        const coordinates = {
            'L': [[' ',' ','L',' '],['L','L','L',' ']],
            'J': [['J',' ',' ',' '],['J','J','J',' ']],
            'Z': [['Z','Z',' ',' '],[' ','Z','Z',' ']],
            'S': [[' ','S','S',' '],['S','S',' ',' ']],
            'T': [[' ','T',' ',' '],['T','T','T',' ']],
            'O': [['O','O',' ',' '],['O','O',' ',' ']],
            'I': [[' ',' ',' ',' '],['I','I','I','I']]
        }
        return coordinates[this.#pieces[1].getCharacter()];
    }

    togglePause = function() {
        if (this.#endGame) return;
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
        if (this.#pieces[0].getUnderCollision()) this.#pieces[0].enableFixed();
        else this.#score = this.#score + 1 > TetrisGame.#LIMIT_SCORE ? TetrisGame.#LIMIT_SCORE : ++this.#score;
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
                if (tetris.#pieces[0].getFixed() && tetris.#pieces[0].getOverFlow()) {
                    tetris.#endGame = true;
                    tetris.#pause();
                    console.log('Has perdido');
                }
                else if (tetris.#pieces[0].getFixed()) {
                    tetris.#pieces.shift();
                    tetris.#pieces.push( new Piece(this.#generatePiece(),this.#boardGame) );
                    tetris.#cleanboardGame();
                }
                if (!tetris.#pieces[0].getUnderCollision())
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
        this.#lines += rowToClean.length;
        for (let currentRow = this.#boardGame.length - 1; currentRow > -1; currentRow--) {
            if (currentRow > rowToClean[0]) continue;
            do {
                --rowToCopy;
            } while (rowToCopy > currentRow || rowToClean.includes(rowToCopy));
            this.#replaceRowByOtherRow(currentRow,rowToCopy);
        }
    }
}