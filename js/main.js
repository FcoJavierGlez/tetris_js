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
                elementsDOM[i][j].classList = array.length == 0 || array[i][j] == ' ' ? 'square' : `${array[i][j]}`;
    }

    const setMaxScoreIntoLocalStorage = maxScore => {
        if (!(maxScore > localStorage.getItem('tetris_max_score'))) return;
        localStorage.removeItem('tetris_max_score');
        localStorage.setItem('tetris_max_score',maxScore);
    }

    const init = () => {
        const board       = document.getElementById("board");
        const previewer   = document.getElementById("next-piece");
        const level       = document.getElementById("level");
        const lines       = document.getElementById("lines");
        const score       = document.getElementById("score");
        const pauseScreen = document.getElementById("pause-screen");
        const divPause    = document.getElementById("pause");
        const divGameOver = document.getElementById("game-over");
        const divMessage  = document.getElementById("content-message");
        const resetButton = document.getElementById("reset");
        const tetris      = new TetrisGame(localStorage.getItem('tetris_max_score') == null ? 0 : localStorage.getItem('tetris_max_score'),20,10);
        let [boardGame,fragment]             = createGrid(20,10,true);
        let [nextPieceDOM,fragmentPreviewer] = createGrid(2,4);
        let idPause = 0;

        level.innerHTML = tetris.getLevel();
        lines.innerHTML = tetris.getLines();
        score.innerHTML = tetris.getScore();

        const showPauseScreen = endGame => {
            pauseScreen.className = idPause == 0 || endGame ? 'pauseScreen' : 'hidden';
            endGame ? (
                divPause.className = 'hidden',
                divGameOver.className = 'game-over',
                divMessage.innerHTML = `
                    <p>Has obtenido ${tetris.getScore()} puntos.</p>
                    <p>Tu máxima puntuación obtenida ha sido de ${localStorage.getItem('tetris_max_score')} puntos.</p>
                    <p>¿Deseas volver a intentarlo?</p>`
            ) : (
                divPause.className = 'pause',
                divGameOver.className = 'hidden'
            );
        }

        const playRender = (boardGameDOM,nextPieceDOM,level,lines,score,game) => {
            return setInterval(
                () => {
                    if (game.getEndGame()) {
                        setMaxScoreIntoLocalStorage(TetrisGame.getMaxScore());
                        showPauseScreen(true);
                        pauseRender();
                        return;
                    }
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
            if (tetris.getEndGame()) return;
            if (e.code == 'Space') {
                tetris.togglePause();
                togglePause(boardGame,nextPieceDOM,level,lines,score,tetris);
                showPauseScreen();
            }
            else if (e.code == 'ArrowLeft' || e.code == 'ArrowRight')
                tetris.movePiece( e.code == 'ArrowLeft' ? 'LEFT' : 'RIGHT');
            else if (e.code == 'ArrowUp')
                tetris.rotatePiece();
            else if (e.code == 'ArrowDown')
                tetris.descendPiece();
        });

        resetButton.addEventListener("click", () => {
            tetris.reset();
            renderGrid(boardGame,tetris.getBoardGame());
            renderGrid(nextPieceDOM,[]);
            level.innerHTML = tetris.getLevel();
            lines.innerHTML = tetris.getLines();
            score.innerHTML = tetris.getScore();
            showPauseScreen();
        });

    }
    document.addEventListener("DOMContentLoaded",init);
}