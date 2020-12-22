/**
 * @author Francisco Javier González Sabariego
 * 
 * 
 */
{
    const NUMBER_ROWS    = 20;
    const NUMBER_COLUMNS = 10;

    const createBoardGame = () => {
        const fragment = new DocumentFragment();
        let array = [];
        for (let i = 0; i < NUMBER_ROWS; i++) {
            array.push([]);
            for (let j = 0; j < NUMBER_COLUMNS; j++) {
                const div = document.createElement("div");
                div.classList = 'square empty';
                array[i].push(div);
                fragment.appendChild(div);
            }
        }
        return [array,fragment];
    }

    const render = function(boardGameDOM,boardGame) {
        setInterval(
            () => {
                for (let i = 0; i < boardGameDOM.length; i++) 
                    for (let j = 0; j < boardGameDOM[0].length; j++) 
                        boardGameDOM[i][j].classList = boardGame[i][j] == ' ' ? 'square empty' : `square ${boardGame[i][j]}`;
            }, 50);
    }

    const init = () => {
        const board = document.getElementById("board");
        let [boardGame,fragment] = createBoardGame();
        const tetris = new TetrisGame(20,10);

        board.appendChild(fragment);

        render(boardGame,tetris.getBoardGame());

        document.addEventListener("keydown", e => {
            if (e.code == 'Space')
                tetris.togglePause();
            else if (e.code == 'ArrowLeft' || e.code == 'ArrowRight')
                tetris.movePiece( e.code == 'ArrowLeft' ? 'LEFT' : 'RIGHT');
            else if (e.code == 'ArrowUp')
                tetris.rotatePiece();
            else if (e.code == 'ArrowDown')
                tetris.descendPiece();
        })

    }
    document.addEventListener("DOMContentLoaded",init);
}