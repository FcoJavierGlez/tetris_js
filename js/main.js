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

    const render = function(boardGameDOM,nextPieceDOM,level,lines,score,game) {
        setInterval(
            () => {
                renderGrid(boardGameDOM,game.getBoardGame());
                renderGrid(nextPieceDOM,game.getInfoPreviewNextPiece());
                level.innerHTML = game.getLevel();
                lines.innerHTML = game.getLines();
                score.innerHTML = game.getScore();
            }, 50);
    }

    const init = () => {
        const board     = document.getElementById("board");
        const previewer = document.getElementById("next-piece");
        const level     = document.getElementById("level");
        const lines     = document.getElementById("lines");
        const score     = document.getElementById("score");
        const tetris    = new TetrisGame(20,10,localStorage.getItem('tetris_max_score') == null ? 0 : localStorage.getItem('tetris_max_score'));
        let [boardGame,fragment]             = createGrid(20,10,true);
        let [nextPieceDOM,fragmentPreviewer] = createGrid(2,4);
        let idPause = 0;

        const playRender = (boardGameDOM,nextPieceDOM,level,lines,score,game) => {
            return setInterval(
                () => {
                    renderGrid(boardGameDOM,game.getBoardGame());
                    renderGrid(nextPieceDOM,game.getInfoPreviewNextPiece());
                    level.innerHTML = game.getLevel();
                    lines.innerHTML = game.getLines();
                    score.innerHTML = game.getScore();
                }, 50);
        }
    
        const pauseRender = () => {
            clearInterval(idPause);
            idPause = 0;
        }
    
        const togglePause = (boardGameDOM,nextPieceDOM,level,lines,score,game) => idPause == 0 ? (idPause = playRender(boardGameDOM,nextPieceDOM,level,lines,score,game)) : pauseRender(idPause);

        board.appendChild(fragment);
        previewer.appendChild(fragmentPreviewer);
        
        document.addEventListener("keydown", e => {
            if (e.code == 'Space') {
                tetris.togglePause();
                togglePause(boardGame,nextPieceDOM,level,lines,score,tetris);
            }
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