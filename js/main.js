/**
 * @author Francisco Javier González Sabariego
 * 
 * 
 */
{
    const createGrid = (rows,colunms,boardGame = false) => {
        const fragment = new DocumentFragment();
        let array = [];
        for (let i = 0; i < rows; i++) {
            array.push([]);
            for (let j = 0; j < colunms; j++) {
                const div = document.createElement("div");
                div.classList = boardGame ? 'square' : 'square';
                array[i].push(div);
                fragment.appendChild(div);
            }
        }
        return [array,fragment];
    }

    const renderGrid = (elementsDOM,array) => {
        for (let i = 0; i < elementsDOM.length; i++) 
            for (let j = 0; j < elementsDOM[0].length; j++) 
                elementsDOM[i][j].classList = array[i][j] == ' ' ? 'square' : `square ${array[i][j]}`;
    }

    const render = function(boardGameDOM,nextPieceDOM,score,game) {
        setInterval(
            () => {
                renderGrid(boardGameDOM,game.getBoardGame());
                renderGrid(nextPieceDOM,game.getInfoPreviewNextPiece());
                score.innerHTML = game.getScore();
            }, 50);
    }

    const init = () => {
        const board     = document.getElementById("board");
        const previewer = document.getElementById("next-piece");
        const score     = document.getElementById("score");
        const tetris    = new TetrisGame(20,10,localStorage.getItem('tetris_max_score') == null ? 0 : localStorage.getItem('tetris_max_score'));
        let [boardGame,fragment]             = createGrid(20,10,true);
        let [nextPieceDOM,fragmentPreviewer] = createGrid(2,4);

        board.appendChild(fragment);
        previewer.appendChild(fragmentPreviewer);

        render(boardGame,nextPieceDOM,score,tetris);

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