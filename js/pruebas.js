

{
    const init = () => {
        boardGame = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [7, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [6, 6, 0, 0, 0, 0, 0, 0, 6, 0],
            [5, 5, 5, 0, 0, 0, 0, 5, 5, 0],
            [4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
            [3, 3, 3, 3, 0, 3, 3, 3, 3, 3],
            [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
        ];
        let boardGameFinal = [];

        const checkCleanRow = row => {
            for (let i = 0; i < row.length; i++) 
                if (row[i] == 0) return false;
            return true;
        }

        const replaceRowByOtherRow = (boardGame,currentRow,replaceByThisRow) => {
            if (replaceByThisRow < 0)
                for (let i = 0; i < boardGame[currentRow].length; i++)
                    boardGame[currentRow][i] = 0;
            else
                for (let i = 0; i < boardGame[currentRow].length; i++)
                    boardGame[currentRow][i] = boardGame[replaceByThisRow][i];
        }

        const cleanboardGame = boardGame => {
            let rowToClean = [];
            let lastRowAlgo = 20;
            for (let i = boardGame.length - 1; i > -1; i--) 
                checkCleanRow(boardGame[i]) ? rowToClean.push(i) : false;
            if (rowToClean.length == 0) return;
            console.log('Debes limpiar',rowToClean);
            for (let i = boardGame.length - 1; i > -1; i--) {
                if (i > rowToClean[0]) continue;
                do {
                    --lastRowAlgo;
                    console.log(lastRowAlgo);
                } while (lastRowAlgo > i || rowToClean.includes(lastRowAlgo));
                console.log(`Reemplazo la línea ${i} por la línea ${lastRowAlgo}`);
                replaceRowByOtherRow(boardGame,i,lastRowAlgo);
            }
        }

        console.log(`Tablero: `,boardGame);
        boardGameFinal = JSON.parse( JSON.stringify(boardGame) );
        cleanboardGame(boardGameFinal);
        console.log(`Tablero: `,boardGameFinal);
    }
    document.addEventListener("DOMContentLoaded", init);
}




