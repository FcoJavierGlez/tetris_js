/**
 * @author Francisco Javier González Sabariego
 * 
 * Piece Class:
 * 
 * La clase Piece es la clase cuyas instancias representan, cada una de ellas, una de las piezas del Tetris.
 * 
 * Esta clase se encarga de la gestión del movimiento y rotación de la pieza, verificando que nunca se superpongan
 * dos piezas, que no se salgan del tablero o que, en caso de topar con el final del tablero o con otra pieza por
 * la parte inferior de la pieza en activo fijarla pasado un tiempo x, dando margen a una ligera maniobra.
 */

class Piece {
    #character          = '';
    #currentRotation    = 0;
    #coordinates        = [];
    #shadowCoordinates  = [];
    #boardGame          = [];
    #underCollision     = false;
    #fixed              = false;
    #idCountdownFixed   = 0;
    #timerToFixed       = 0;
    #overFlow           = false;

    /**
     * Constructor. Recibe como parámetro el tipo de pieza a construir (en forma de caracter),
     * el tablero del juego y el intervalo de tiempo del juego en su estado actual al crearse
     * la pieza.
     * 
     * @param {String} character 
     * @param {Array} boardGame 
     * @param {Number} gameIntervalTime 
     */
    constructor(character,boardGame,gameIntervalTime) {
        this.#character         = character;
        this.#boardGame         = boardGame;
        this.#timerToFixed      = 500 + gameIntervalTime;
        this.#coordinates       = this.#createInitialCoordinates(this.#character,this.#boardGame[0].length);
        this.#shadowCoordinates = this.#createInitialCoordinates(this.#character,this.#boardGame[0].length);
    }

    /**
     * Devuelve el caracter que representa la forma de la pieza.
     * 
     * @return {String} El caracter que representa a la pieza.
     */
    getCharacter = function() {
        return this.#character;
    }

    /**
     * Devuelve si la pieza está actualmente topando con algún elemento inmediatamente bajo su posición actual.
     * 
     * @return {Boolean} Si la pieza topa con algún elemento bajo suyo.
     */
    getUnderCollision = function() {
        return this.#underCollision;
    }

    /**
     * Devuelve si la pieza está fija en las coordenadas actuales.
     * 
     * @return {Boolean} Si la pieza está fijada en las coordenadas actuales.
     */
    getFixed = function() {
        return this.#fixed;
    }

    /**
     * Devuelve si algún elemento que conforma la pieza está desbordando el tablero por la parte superior.
     * 
     * @return {Boolean} Si la pieza está desbordando el tablero.
     */
    getOverFlow = function() {
        return this.#overFlow;
    }

    /**
     * Fija inmediatamente una pieza en la coordenada actual.
     */
    enableFixed = function() {
        this.#disableCountDownFixed();
        this.#fixed = true;
    }

    /**
     * Desplaza la pieza desde su posición actual en caso de ser posible tal desplazamiento.
     * 
     * @param {*} row Incremento de la fila, si es 1 la pieza desciende. Si es 0 la pieza no desciende.
     * @param {*} col Incremento de la columna:
     *                  -1 la pieza se desplaza a la izquierda. 
     *                   1 la pieza se desplaza a la derecha.
     *                   0 la pieza no se desplaza en horizontal.
     */
    move = function(row,col = 0,showShadow = false) {
        let newCoordinates = JSON.parse( JSON.stringify(this.#coordinates) );
        if (this.#fixed) return;
        newCoordinates = this.#calculateCoordinatesAfterMove(newCoordinates,row,col);
        this.#reLocatePiece(newCoordinates);
        this.#enableDisableFixedSystem();
        this.#overFlow = this.#checkOverFlow();
        let coordinatesShadow = [];
        coordinatesShadow = this.#calculateCoordinatesShadow(this.#coordinates);
        console.log(coordinatesShadow);
        /* if (showShadow)
            this.#showShadowPiece(); */
    }

    /**
     * Rota la pieza 90 grados en sentido horario siempre y cuando la rotación sea posible.
     */
    rotate = function (showShadow = false) {
        let newCoordinates = JSON.parse( JSON.stringify(this.#coordinates) );
        if (this.#fixed) return;
        if (this.#coordinates.length == 2 && this.#coordinates[0].length == 2) return;
        newCoordinates = this.#calculateCoordinatesAfterRotation(newCoordinates, newCoordinates.length == 1 ? 
            this.#getCoordinatesRotation(4) : this.#getCoordinatesRotation(this.#currentRotation));
        this.#reLocatePiece(newCoordinates);
        this.#enableDisableFixedSystem();
        this.#currentRotation = !this.#validateCoordinates(newCoordinates) ? this.#currentRotation : this.#currentRotation == 3 ? 0 : this.#currentRotation + 1;
        /* if (showShadow)
            this.#showShadowPiece(); */
    }

    /**
     * Muestra la sombra de la pieza, es decir, muestra la ubicación final
     * de la pieza activa si sigue descendiendo en la columna actual.
     */
    #showShadowPiece = function() {
        let coordinatesShadow = [];
        coordinatesShadow = this.#calculateCoordinatesShadow(this.#coordinates);

    }

    /**
     * Calcula las coordenadas de la sombra de la pieza, es decir, la ubicación final 
     * que obtendrá la pieza activa si sigue desciendiendo en la columna actual.
     * 
     * @param {Array} coordinates Las coordenadas actuales de las que parte el cálculo
     * 
     * @return 
     */
    #calculateCoordinatesShadow = function(coordinates) {
        let newCoordinates = JSON.parse( JSON.stringify(coordinates) );
        newCoordinates = this.#calculateCoordinatesAfterMove(newCoordinates,1,0);
        if (!this.#validateCoordinates(newCoordinates))
            return coordinates;
        return this.#calculateCoordinatesShadow(newCoordinates);
    }

    /**
     * Activa o desactiva el sistema de fijado de la pieza.
     */
    #enableDisableFixedSystem = function() {
        this.#underCollision = this.#checkUnderCollision(this.#coordinates);
        this.#underCollision && this.#idCountdownFixed == 0 ? (this.#idCountdownFixed = this.#enableCountDownFixed()) : 0;
        !this.#underCollision ? this.#disableCountDownFixed() : 0;
    }

    /**
     * Activa la cuenta atrás para fijar la pieza en el momento de agotar su tiempo de maniobra.
     * 
     * @return {Number} ID del intervalo que se activa cuando comienza la cuenta atrás.
     */
    #enableCountDownFixed = function() {
        const piece = this;
        return setInterval(
            () => {
                piece.#fixed = (piece.#timerToFixed -= 100) <= 0;//500
                piece.#fixed ? piece.#disableCountDownFixed(piece.#idCountdownFixed) : false;
            }, 100);
    }

    /**
     * Desactiva la cuenta atrás para fijar la pieza.
     */
    #disableCountDownFixed = function() {
        clearInterval(this.#idCountdownFixed);
        this.#idCountdownFixed = 0;
    }

    /**
     * Reubica a la pieza en las nuevas coordenadas.
     * 
     * @param {Array} newCoordinates Array bidimensional compuesto por arrays con las coordendas de la pieza [row,col]
     */
    #reLocatePiece = function(newCoordinates) {
        this.#cleanOrPrintPiece();
        this.#coordinates = this.#validateCoordinates(newCoordinates) ? newCoordinates : this.#coordinates;
        this.#cleanOrPrintPiece(true);
    }

    /**
     * Calcula las nuevas coordendas de la piezas tras el movimiento que pretende realizar.
     * 
     * @param {Array} coordinates Array bidimensional compuesto por arrays con las coordendas de la pieza [row,col]
     * @param {Number} row        Incremento fila: 1 desciende, 0 no desciende.
     * @param {Number} col        Incremento columna: -1 izquierda, 1 derecha, 0 no se mueve en horizontal.
     * 
     * @return {Array}            Array bidimensional compuesto por arrays con las nuevas coordendas
     */
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

    /**
     * Calcula las nuevas coordendas de la piezas tras la rotación que pretende realizar.
     * 
     * @param {Array} coordinates Array bidimensional compuesto por arrays con las coordendas de la pieza [row,col]
     * @param {Number} rotation   Valor de la rotación actual. Valores permitidos: [0-3] || 4 en caso de una pieza de tipo 'I'
     * 
     * @return {Array}            Array bidimensional compuesto por arrays con las nuevas coordendas
     */
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

    /**
     * Comprueba si las coordenadas [row,col] pasadas como parametro pertenecen a la propia pieza.
     * 
     * @param {Array} coordinates Array compuesto por la coordenda fila y columna a comprobar. [row,col]
     * 
     * @return {Boolean}          Verdadero si las coordendas pertenecen a la pieza, falso en caso de que no.
     */
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

    /**
     * Vallida que las nuevas coordenadas, tras un desplazamiento o rotación, son válidas y no se superponen a otra
     * pieza o se sale del tablero.
     * 
     * @param {Array} newCoordinates Array bidimensional compuesto por arrays con las coordendas a comprobar [row,col]
     * 
     * @return {Boolean}             Verdadero si las coordendas son válidas, false si no lo son.
     */
    #validateCoordinates = function(newCoordinates) {
        for (let i = 0; i < newCoordinates.length; i++) 
            for (let j = 0; j < newCoordinates[0].length; j++) {
                if (!newCoordinates[i][j].length) continue;
                const row = newCoordinates[i][j][0];
                const col = newCoordinates[i][j][1];
                if (col < 0 || col > this.#boardGame[0].length - 1) return false;
                if (row < 0) continue;
                if (row > this.#boardGame.length - 1) return false;
                if (this.#boardGame[row][col] != ' ' && !this.#checkCoordinateIsPieceSelf([row,col])) return false;
            }
        return true;
    }

    /**
     * Comprueba si bajo las coordenadas pasasdas como parametro hay colisión 
     * con otra pieza o con el final del tablero.
     * 
     * @param {Array} coordinates Array bidimensional compuesto por arrays con las coordendas a comprobar [row,col]
     * 
     * @return {Boolean}          Verdadero si hay colisión, falso en caso contrario.
     */
    #checkUnderCollision = function(coordinates) {
        for (let i = 0; i < coordinates.length; i++) 
            for (let j = 0; j < coordinates[0].length; j++) {
                if (!coordinates[i][j].length) continue;
                const row = coordinates[i][j][0];
                const col = coordinates[i][j][1];
                if (row < -1 || col < 0 || col > this.#boardGame[0].length - 1) continue;
                if (row == this.#boardGame.length - 1) return true;
                if (this.#boardGame[row + 1][col] != ' ' && !this.#checkCoordinateIsPieceSelf([row + 1,col])) return true;
            }
        return false;
    }

    /**
     * Comprueba si la pieza está desbordando el tablero por la parte superior.
     * 
     * @return {Boolean}  Resultado de la comprobación.
     */
    #checkOverFlow = function() {
        for (let i = 0; i < this.#coordinates.length; i++) 
            for (let j = 0; j < this.#coordinates[0].length; j++) {
                if (!this.#coordinates[i][j].length) continue;
                if (this.#coordinates[i][j][0] < 0) return true; //if row < 0
            }
        return false;
    }

    /**
     * Las coordendas que se deben aplicar a las coordenadas actuales de la pieza para ejecutar
     * la siguiente rotación de 90 grados.
     * 
     * @param {Number} currentRotation Número de la rotación actual. Rangos válidos [0-3] || 4 si la pieza es del tipo 'I'
     * 
     * @return {Array}                 Las coordenadas a aplicar para la siguiente rotación.
     */
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

    /**
     * Borra la pieza del tablero en las coordenadas actuales o 
     * la coloca en función del booleano pasado por parámetro.
     * 
     * @param {Boolean} print Si es false (por defecto) elimina la pieza del tablero,
     *                          si es true la vuelve a colocar.
     */
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

    /**
     * Crea las coordenadas iniciales de una pieza en función del tipo de pieza y 
     * del número de columnas del tablero.
     * 
     * @param {String} character            Tipo de pieza: 'L','J','Z','S','T','O','I'
     * @param {Number} boardGameRowLength   Longitud de columnas del tablero.
     * 
     * @return {Array}                      Coordenadas iniciales de la pieza. 
     */
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