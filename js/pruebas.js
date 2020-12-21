

{
    const init = () => {
        const boardDOM = document.getElementById("board");
        const pruebaButton = document.getElementById("prueba");
        let [boardElements,fragment] = [undefined,undefined];
        let boardGame = [
            [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
            [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
            [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
            [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
            [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
            [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
            [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
            [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
            [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
            [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
            [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
            [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
            [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
            ['N', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'I'],
            ['N', 'N', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'I'],
            ['L', 'N', 'N', 'N', ' ', ' ', ' ', ' ', 'L', 'I'],
            ['L', 'N', 'N', 'I', 'I', 'I', 'I', 'Z', 'L', 'I'],
            ['L', 'L', 'T', ' ', ' ', ' ', 'Z', 'Z', 'L', 'L'],
            ['L', 'T', 'T', 'T', 'N', 'N', 'Z', 'J', 'D', 'D'],
            ['L', 'L', 'L', 'N', 'N', 'J', 'J', 'J', 'D', 'D']
        ];
        let boardGameFinal = [];

        const createBoardGame = () => {
            const fragment = new DocumentFragment();
            let array = [];
            for (let i = 0; i < 20; i++) {
                array.push([]);
                for (let j = 0; j < 10; j++) {
                    const div = document.createElement("div");
                    div.classList = 'square empty';
                    array[i].push(div);
                    fragment.appendChild(div);
                }
            }
            return [array,fragment];
        }

        [boardElements,fragment] = createBoardGame();

        boardDOM.appendChild(fragment);

        const checkCleanRow = row => {
            for (let i = 0; i < row.length; i++) 
                if (row[i] == ' ') return false;
            return true;
        }


        const replaceRowByOtherRow = (boardGame,currentRow,replaceByThisRow) => {
            if (replaceByThisRow < 0)
                for (let i = 0; i < boardGame[currentRow].length; i++)
                    boardGame[currentRow][i] = ' ';
            else
                for (let i = 0; i < boardGame[currentRow].length; i++)
                    boardGame[currentRow][i] = boardGame[replaceByThisRow][i];
        }


        const cleanboardGame = boardGame => {
            let rowToClean = [];
            let rowToCopy  = boardGame.length;
            for (let i = boardGame.length - 1; i > -1; i--) 
                checkCleanRow(boardGame[i]) ? rowToClean.push(i) : false;
            if (rowToClean.length == 0) return;
            for (let currentRow = boardGame.length - 1; currentRow > -1; currentRow--) {
                if (currentRow > rowToClean[0]) continue;
                do {
                    --rowToCopy;
                } while (rowToCopy > currentRow || rowToClean.includes(rowToCopy));
                replaceRowByOtherRow(boardGame,currentRow,rowToCopy);
            }
        }

        const renderBoardGame = () => {
            console.log(boardElements);
            for (let i = 0; i < boardElements.length; i++) 
                for (let j = 0; j < boardElements[0].length; j++) 
                    boardElements[i][j].classList = boardGame[i][j] == ' ' ? 'square empty' : `square ${boardGame[i][j]}`;
        }

        renderBoardGame();

        pruebaButton.addEventListener("click", () => {
            cleanboardGame(boardGame);
            renderBoardGame();
        })
    }
    document.addEventListener("DOMContentLoaded", init);
}




