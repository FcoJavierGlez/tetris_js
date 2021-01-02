/**
 * @author Francisco Javier González Sabariego
 * 
 * 
 */
{
    const getNameLevel = level => {
        const LEVEL_NAME = { '0': 'RAINBOW','1': 'EASY','2': 'NORMAL','3': 'HARD','4': 'HEAVY METAL' }
        return LEVEL_NAME[level];
    }
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
        const board             = document.getElementById("board");
        const previewer         = document.getElementById("next-piece");
        const level             = document.getElementById("level");
        const lines             = document.getElementById("lines");
        const score             = document.getElementById("score");
        const pauseScreen       = document.getElementById("pause-screen");
        const divPause          = document.getElementById("pause");
        const divGameOver       = document.getElementById("game-over");
        const divMessage        = document.getElementById("content-message");
        const resetButton       = document.getElementById("reset");
        const difficultyText    = document.getElementById("difficulty-text");
        const optionsImage      = document.getElementById("options-image");
        const [...radioButton]  = document.getElementsByName("difficulty");
        const [noRepeat,shadow] = [document.getElementById("noRepeat"),document.getElementById("shadow")];
        let tetris              = null;
        let [boardGame,fragment]             = createGrid(20,10,true);
        let [nextPieceDOM,fragmentPreviewer] = createGrid(2,4);
        let idPause = 0;

        const showPauseScreen = endGame => {
            pauseScreen.className = idPause == 0 || endGame ? 'pauseScreen' : 'hidden';
            endGame ? (
                divPause.className    = 'hidden',
                divGameOver.className = 'game-over',
                divMessage.innerHTML  = `
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
                    level.innerHTML = `<div>${game.getLevel()}</div><div id="difficulty">${getNameLevel(game.getDifficulty())}</div>`;
                    lines.innerHTML = game.getLines();
                    score.innerHTML = game.getScore();
                }, 25);
        }
    
        const pauseRender = () => {
            clearInterval(idPause);
            idPause = 0;
        }
    
        const togglePause = (boardGameDOM,nextPieceDOM,level,lines,score,game) => idPause == 0 ? (idPause = playRender(boardGameDOM,nextPieceDOM,level,lines,score,game)) : pauseRender(idPause);

        const changeMessageDifficulty = () => {
            const DIFFICULTY = radioButton.find( e => e.checked ).value;
            switch (DIFFICULTY) {
                case '0':
                    difficultyText.innerHTML = `<h2>DIFFICULTY</h2><h3>\u{1F308}\u{1F308}\u{1F338}\u{1F338}\u{1F338}RAINBOW\u{1F338}\u{1F338}\u{1F338}\u{1F308}\u{1F308}</h3><p><b><u>RAINBOW</u>:</b> Puedes tomar el té mientras juegas.</p>`;
                    break;
                case '1':
                    difficultyText.innerHTML = `<h2>DIFFICULTY</h2><h3>\u{1F338}EASY\u{1F338}</h3><p><b><u>EASY</u>:</b> Para aquellos que se inician pero ya conocen el juego.</p>`;
                    break;
                case '2':
                    difficultyText.innerHTML = `<h2>DIFFICULTY</h2><h3>\u{1F3AE}NORMAL\u{1F3AE}</h3><p><b><u>NORMAL</u>:</b> Dificultad estándar para alguien acostumbrado a jugar al Tetris.</p>`;
                    break;
                case '3':
                    difficultyText.innerHTML = `<h2>DIFFICULTY</h2><h3>\u{1F525}HARD\u{1F525}</h3><p><b><u>HARD</u>:</b> ¿Te gustan los retos? Éste será duro.</p>`;
                    break;
                default:
                    difficultyText.innerHTML = `<h2>DIFFICULTY</h2><h3>\u{1F480}\u{1F3B8}\u{1F525}\u{1F525}\u{1F525}HEAVY METAL\u{1F525}\u{1F525}\u{1F525}\u{1F3B8}\u{1F480}</h3><p><b><u>HEAVY METAL</u>:</b> Larga vida al heavy metal.</p>`;
                    break;
            }
        }

        const changeImageOptions = () => {
            if (shadow.checked && noRepeat.checked) optionsImage.innerHTML = `<h2>MODERN VERSION</h2>
                                                                              <p>Juega sin repetir la siguiente pieza y mostrando la sombra de la misma.</p>
                                                                              <div class="backimage modern"></div>`;
            else if (!(shadow.checked || noRepeat.checked)) optionsImage.innerHTML = `<h2>CLASSIC VERSION</h2>
                                                                                      <p>Juega repitiendo piezas y sin ver la sombra de la posición en la que van a caer.</p>
                                                                                      <div class="backimage classic"></div>`;
            else if (noRepeat.checked) optionsImage.innerHTML = `<h2>NO REPEAT NEXT PIECE</h2>
                                                                <p>Juega sin repetir la siguiente pieza.</p>
                                                                <div class="backimage no-repeat"></div>`;
            else  optionsImage.innerHTML = `<h2>SHOW SHADOW</h2>
                                            <p>Juega mostrando la sombra de la posición final de la pieza.</p>
                                            <div class="backimage shadow"></div>`;
        }

        board.appendChild(fragment);
        previewer.appendChild(fragmentPreviewer);
        radioButton.forEach( e => e.addEventListener("click", changeMessageDifficulty) );
        noRepeat.addEventListener("click", changeImageOptions);
        shadow.addEventListener("click", changeImageOptions);
        
        document.addEventListener("keydown", e => {
            if (tetris == null || tetris.getEndGame()) return;
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
            level.innerHTML = `<div>${tetris.getLevel()}</div><div id="difficulty">${getNameLevel(tetris.getDifficulty())}</div>`;
            lines.innerHTML = tetris.getLines();
            score.innerHTML = tetris.getScore();
            showPauseScreen();
        });
        
        //Start game with inital config
        document.getElementById("start").addEventListener("click", () => {
            const DIFFICULTY = radioButton.find( e => e.checked ).value;
            const MAX_SCORE = localStorage.getItem('tetris_max_score') == null ? 0 : localStorage.getItem('tetris_max_score');
            tetris = new TetrisGame(MAX_SCORE,20,10,noRepeat.checked,shadow.checked,DIFFICULTY);
            level.innerHTML = `<div>${tetris.getLevel()}</div><div id="difficulty">${getNameLevel(tetris.getDifficulty())}</div>`;
            lines.innerHTML = tetris.getLines();
            score.innerHTML = tetris.getScore();
            document.getElementById("config-panel").classList = 'hidden';
        });

    }
    document.addEventListener("DOMContentLoaded",init);
}