/**
 * @author Francisco Javier González Sabariego
 * 
 * TetrisGame Class:
 * 
 * La clase TetrisGame es la clase encarga de ejecutar el juego del Tetris.
 * 
 * Pude pausar o renudar el juego, limpia el tablero cuando se completa una o varias filas, 
 * realiza el conteo de líneas eliminadas y su respectivo conteo de puntose incrementa la velocidad
 * con el que caen las piezas conforme incrementa el nivel del jugador (1 nivel por cada 10 filas eliminadas).
 * 
 */

class TetrisGame {
    static #MAX_SCORE   = 0;
    static #LIMIT_SCORE = 999999;
    static #LIMIT_LEVEL = 10;

    #lines                 = 0;
    #score                 = 0;
    #idPlay                = 0;
    #difficulty            = 0;
    #boardGame             = [];
    #pieces                = [];
    #endGame               = false;
    #noRepeatPreviousPiece = false;
    #showShadowPieces      = false;

    /**
     * Constructor. Recibe como parámetros la puntuación máxima almacenada de partidas anteriores (cookie),
     * el número de filas y el número de columnas que componen el tablero de juego, la dificultad y si se
     * desea que no se repitan las piezas y que éstas además proyecten sombra.
     * 
     * @param {Number} maxScore               La puntuación máxima almacenada en una cookie.
     * @param {Number} numberOfRows           [Opcional] El número de filas que componen el tablero.
     * @param {Number} numberOfColumns        [Opcional] El número de columnas que componen el tablero.
     * @param {Boolean} noRepeatPreviousPiece [Opcional] Si se desea que no se repitan las piezas con las dos anteriores.
     * @param {Boolean} showShadowPieces      [Opcional] Si se desea que se dibuje la sombra de la pieza.
     * @param {Number} difficulty             [Opcional] El nivel de dificultad que tendrá el juego, por defecto 1 (normal).
     */
    constructor(maxScore, numberOfRows = 20, numberOfColumns = 10, noRepeatPreviousPiece = true, showShadowPieces = true, difficulty = 1) {
        TetrisGame.#MAX_SCORE       = maxScore;
        this.#boardGame             = this.#createBoardGame(numberOfRows,numberOfColumns);
        this.#noRepeatPreviousPiece = noRepeatPreviousPiece;
        this.#showShadowPieces      = showShadowPieces;
        this.#difficulty            = difficulty;
        for (let i = 0; i < 3; i++) 
            this.#pieces.push( this.#generateNextPiece() );
    }

    /**
     * Devuelve la puntuación máxima alcanzada.
     * 
     * @return {Number} Puntuación máxima alcanzada.
     */
    static getMaxScore = function() {
        return TetrisGame.#MAX_SCORE;
    }

    /**
     * Devuelve el tablero de juego.
     * 
     * @return {Array} Array bidimensional con el contenido del tablero.
     */
    getBoardGame = function() {
        return this.#boardGame;
    }

    /**
     * Devuelve el número de líneas eliminadas por el jugador.
     * 
     * @return {Number} Número de líneas.
     */
    getLines = function() {
        return this.#lines;
    }

    /**
     * Devuelve el nivel alcanzado por el jugador. Siendo el nivel 0 el inicial y 20 el máximo.
     * Se obtiene un nivel por cada 10 líneas eliminadas.
     * 
     * @return {Number} Nivel del jugador.
     */
    getLevel = function() {
        let currentLevel = 0;
        return (currentLevel = parseInt(this.#lines / 10)) > TetrisGame.#LIMIT_LEVEL ? TetrisGame.#LIMIT_LEVEL : currentLevel;
    }

    /**
     * Puntuación actual de la partida.
     * 
     * @return {Number} Puntuación actual.
     */
    getScore = function() {
        return this.#score;
    }

    /**
     * Devuelve si el juego ha finalizado.
     * 
     * @return {Boolean} Estado finalizado de la partida.
     */
    getEndGame = function() {
        return this.#endGame;
    }

    /**
     * Devuelve array bidimensional con la posición y los caracteres que conforman
     * la pieza que va a aparecer a continuación a la que actualmente estamos usando.
     * 
     * El uso principal de este método es poder renderizar la siguiente pieza en la
     * capa de presentación.
     * 
     * @return {Array} La forma de la siguiente pieza que va a aparecer.
     */
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

    /**
     * Pausa o reanuda la partida. (Inicialmente la partida comienza pausada)
     */
    togglePause = function() {
        if (this.#endGame) return;
        this.#idPlay == 0 ? (this.#idPlay = this.#play()) : this.#pause();
    }

    /**
     * Manda a rotar 90 grados a la derecha la pieza que estamos controlando actualmente.
     */
    rotatePiece = function() {
        if (this.#idPlay == 0) return;
        this.#pieces[0].rotate();
    }

    /**
     * Mueve en el eje horizontal, mientras sea posible, a la pieza que estamos controlando actualmente.
     * Recibe como parámetro la dirección, los valores válidos son 'LEFT' o 'RIGHT'.
     * 
     * @param {String} direction Dirección a la que queremos mover la pieza.
     *                              Valores válidos: 'LEFT' | 'RIGHT'
     */
    movePiece = function(direction) {
        direction = direction.toUpperCase();
        if (this.#idPlay == 0) return;
        if (!(direction == 'LEFT' || direction == 'RIGHT')) return;
        this.#pieces[0].move(0,direction == 'LEFT' ? -1 : 1);
    }

    /**
     * Desplaza a la pieza (por el control del jugador) hacia abajo.
     * 
     * Mientras la pieza se pueda seguir desplanzado ésta descenderá
     * más rápido e incrementará en 1 punto el score por cada línea
     * que descienda.
     * 
     * Si la pieza topa con el final del tablero o con otra pieza
     * que le impide el avance quedará inmediatamente fijada en esa
     * ubicación.
     */
    descendPiece = function() {
        if (this.#idPlay == 0) return;
        this.#pieces[0].move(1);
        if (this.#pieces[0].getUnderCollision()) this.#pieces[0].enableFixed();
        else this.#score = this.#score + 1 > TetrisGame.#LIMIT_SCORE ? TetrisGame.#LIMIT_SCORE : ++this.#score;
    }

    /**
     * Reinicia el juego.
     */
    reset = function() {
        this.#score = this.#lines = this.#idPlay = 0;
        this.#endGame   = false;
        this.#pieces    = [];
        this.#boardGame = this.#createBoardGame(this.#boardGame.length,this.#boardGame[0].length);
        for (let i = 0; i < 3; i++) 
            this.#pieces.push( this.#generateNextPiece() );
    }

    /**
     * Devuelve el intervalo de tiempo actual.
     * 
     * @return {Number} El intervalo de tiempo actual.
     */
    #getIntervalTime = function() {
        const TIME = { '0': 600, '1': 500, '2': 400 }
        return TIME[this.#difficulty] - 25 * this.getLevel();
    }

    /**
     * Selecciona aleatoriamente un pieza de entre las 7 piezas posibles
     * y devuelve el caracter que representa a dicha pieza.
     * 
     * @return {String} El caracter que representa a la pieza seleccionada aleatoriamente.
     */
    #selectRandomPiece = function() {
        const LETTER = {
            '0': 'L',
            '1': 'J',
            '2': 'Z',
            '3': 'S',
            '4': 'T',
            '5': 'O',
            '6': 'I'
        }
        return LETTER[ parseInt( Math.random() * 7 ) ];
    }

    /**
     * Genera la siguiente pieza que se va a insertar en el array de piezas.
     * 
     * Si al crear la instancia de TetrisGame especificamos que no se repitan las piezas anteriores
     * se generará una pieza que no coincida con las anteriores que haya, en ese momento, insertadas en el array.
     * 
     * @return {Object} La pieza creada: instancia de la clase Piece.
     */
    #generateNextPiece = function() {
        let nextPiece = '';
        if (!this.#noRepeatPreviousPiece) return new Piece(this.#selectRandomPiece(),this.#boardGame,this.#getIntervalTime(),this.#showShadowPieces);
        if (this.#pieces.length == 0) return new Piece(this.#selectRandomPiece(),this.#boardGame,this.#getIntervalTime(),this.#showShadowPieces);
        do {
            nextPiece = this.#selectRandomPiece();
        } while (this.#pieces.filter( e => e.getCharacter() == nextPiece ).length != 0);
        return new Piece(nextPiece,this.#boardGame,this.#getIntervalTime(),this.#showShadowPieces);
    }

    /**
     * Ejecuta el juego.
     * 
     * Devuelve el ID del setInterval que lo está ejecutando.
     * 
     * @return {Number} ID del setInterval que está ejecutando el juego.
     */
    #play = function() {
        let tetris = this;
        return setInterval(
            () => {
                if (tetris.#pieces[0].getFixed() && tetris.#pieces[0].getOverFlow()) {
                    tetris.#endGame = true;
                    tetris.#finishGame();
                }
                else if (tetris.#pieces[0].getFixed()) {
                    tetris.#pieces.shift();
                    tetris.#pieces.push( this.#generateNextPiece() );
                    tetris.#cleanboardGame();
                    tetris.#pause();
                    tetris.#idPlay = tetris.#play();
                }
                if (!tetris.#pieces[0].getUnderCollision())
                    tetris.#pieces[0].move(1);
            }, tetris.#getIntervalTime() );
    }

    /**
     * Pausa la ejecución del juego.
     */
    #pause = function() {
        clearInterval(this.#idPlay);
        this.#idPlay = 0;
    }

    /**
     * Finaliza el juego
     */
    #finishGame = function() {
        TetrisGame.#MAX_SCORE = this.#score > TetrisGame.#MAX_SCORE ? this.#score : TetrisGame.#MAX_SCORE;
        this.#pause();
    }

    /**
     * Realiza el conteo de puntos en función del número de filas que actualmente 
     * se estén limpiando por haberse completado.
     * 
     * Si se eliminan más de una se reciben puntos extra.
     * 
     * @param {Number} nRows El número de filas que se han completado.
     * 
     * @return {Number} El total de puntos a recibir tras el conteo de puntos.
     */
    #countPointsEarned = function(nRows) {
        const points = this.getLevel() == 0 ? 50 : 100 * this.getLevel();
        return nRows * points + (nRows - 1) * points;
    }

    /**
     * Crea el tablero de juego en base al número de filas y columnas pasados por parámetros.
     * 
     * @param {Number} numberRows    Número de filas que componen el tablero.
     * @param {Number} numberColumns Número de columnas que componen el tablero.
     * 
     * @return {Array} Array bidimensional con el tablero de juego.
     */
    #createBoardGame = function(numberRows,numberColumns) {
        let boardGame = [];
        for (let i = 0; i < numberRows; i++) {
            boardGame.push([]);
            for (let j = 0; j < numberColumns; j++) 
                boardGame[i].push(' ');
        }
        return boardGame;
    }

    /**
     * Verifica si la fila pasada como parámentro está completa
     * y, por tanto, debe ser limpiada.
     *  
     * @param {Array} row La fila que se va a comprobar.
     * 
     * @return {Boolean} Resultado de la comprobación.
     */
    #checkCleanRow = row => {
        for (let i = 0; i < row.length; i++) 
            if (row[i] == ' ') return false;
        return true;
    }


    /**
     * Reemplaza una línea que debe ser eliminada por estar completa, 
     * por la línea inmediatamente superior que no esté completa.
     * 
     * @param {Number} currentRow       El número de la fila completa a sustituir
     * @param {Number} replaceByThisRow El número de la fila no completa por la que será sustituída
     */
    #replaceRowByOtherRow = function (currentRow,replaceByThisRow) {
        this.#boardGame[currentRow] = replaceByThisRow < 0 ? [' ',' ',' ',' ',' ',' ',' ',' ',' ',' '] : this.#boardGame[replaceByThisRow];
    }


    /**
     * Limpia el tablero de todas aquellas filas completas e incrementa el número de líneas el total
     * de puntos obtenidos al hacerlo.
     */
    #cleanboardGame = function() {
        let rowToClean = [];
        let rowToCopy  = this.#boardGame.length;
        for (let i = this.#boardGame.length - 1; i > -1; i--) 
            this.#checkCleanRow(this.#boardGame[i]) ? rowToClean.push(i) : false;
        if (rowToClean.length == 0) return;
        this.#lines += rowToClean.length;
        this.#score = (this.#score += this.#countPointsEarned(rowToClean.length)) > TetrisGame.#LIMIT_SCORE ? TetrisGame.#LIMIT_SCORE : this.#score;
        for (let currentRow = this.#boardGame.length - 1; currentRow > -1; currentRow--) {
            if (currentRow > rowToClean[0]) continue;
            do {
                --rowToCopy;
            } while (rowToCopy > currentRow || rowToClean.includes(rowToCopy));
            this.#replaceRowByOtherRow(currentRow,rowToCopy);
        }
    }
}