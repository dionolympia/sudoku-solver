/* Importing Sudoku boards data */
let picked;

document.addEventListener("DOMContentLoaded", function (event) {
    startGame(false);
});

function startGame(isRestart) {
    let file = "sudoku.csv";
    readTextFile(file, isRestart);
}

function readTextFile(file, isRestart) {
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function () {
        if (rawFile.readyState === 4) {
            if (rawFile.status === 200 || rawFile.status == 0) {
                var allText = rawFile.responseText;
                processData(allText, isRestart);
            }
        }
    };
    rawFile.send(null);
}

function processData(allText, isRestart) {
    var allTextLines = allText.split(/\r\n|\n/);
    var headers = allTextLines[0].split(",");
    var lines = [];

    for (var i = 1; i < allTextLines.length; i++) {
        var data = allTextLines[i].split(",");
        if (data.length == headers.length) {
            let puzzle;
            puzzle = { unsolved: data[0], solved: data[1] };
            lines.push(puzzle);
        }
    }
    let random = Math.floor(Math.random() * (499999 + 1));
    picked = lines[random];
    console.log(picked);
    loaded();
    createBoard(isRestart, false);
}

function loaded() {
    console.log("loaded");
    let loading = document.getElementsByClassName("loader-container")[0];
    loading.style.display = "none";
    let board = document.getElementById("board");
    board.style.display = "block";
}

function initializeBoard() {
    return {
        board: [
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
        ],
    };
}

/* Board Creation */
function createBoard(isRestart, isSolve) {
    let solvedBoardMatrix = initializeBoard().board;
    let unsolvedBoardMatrix = initializeBoard().board;
    let solved = picked.solved;
    let unsolved = picked.unsolved;

    for (number in solved) {
        let row = Math.floor(number / 9);
        let col = number - row * 9;
        solvedBoardMatrix[row][col] = solved[number];
        console.log(solvedBoardMatrix);
    }

    for (number in unsolved) {
        let row = Math.floor(number / 9);
        let col = number - row * 9;
        unsolvedBoardMatrix[row][col] = unsolved[number];
        console.log(unsolvedBoardMatrix);
    }

    let board = document.getElementById("board");

    // Execute if this is a restart
    if (isRestart || isSolve) {
        board.innerHTML = "";
    }

    var currentBoard = unsolvedBoardMatrix;

    // Convert matrix into an HTML table
    for (row in currentBoard) {
        // Create a row
        let tr = document.createElement("tr");
        tr.contentEditable = "false";
        board.appendChild(tr);

        // Create the data cells
        for (col in currentBoard[row]) {
            let td = document.createElement("td");
            let att = document.createAttribute("class");
            att.value = "box";

            // Add vertical dividers
            if (col == 2 || col == 5) {
                att.value = att.value + " " + "right-border";
            }

            // Add horizontal dividers
            if (row == 2 || row == 5) {
                att.value = att.value + " " + "bottom-border";
            }

            // Add the attributes/properties for the row
            td.setAttributeNode(att);

            // Add text to data cell
            let text;
            if (
                currentBoard[row][col] != 0 &&
                unsolvedBoardMatrix[row][col] != 0
            ) {
                text = document.createTextNode(currentBoard[row][col]);
                td.style.background = "#dddddd";
                td.contentEditable = "false";
            } else {
                if (isSolve) {
                    text = document.createTextNode(solvedBoardMatrix[row][col]);
                } else text = document.createTextNode("");
                td.contentEditable = "true";
            }

            td.appendChild(text);

            // Add data cell to row
            tr.appendChild(td);
        }
    }

    /* Box responsiveness */

    // When a box is filled
    document.querySelectorAll(".box").forEach((item) => {
        // When a box is blurred
        item.addEventListener("blur", (event) => {
            let number = /^[0-9][A-Za-z0-9 -]*$/;

            // For every box on the board
            document.querySelectorAll(".box").forEach((box) => {
                let input = box.innerHTML;

                // // Clear colors
                // box.style.background = "white";

                // Remove any invalid inputs
                if (input.length > 1 || !input.match(number)) {
                    box.innerHTML = "";
                }
            });
        });

        // When a box is filled
        item.addEventListener("keyup", (event) => {
            // Clear colors
            document.querySelectorAll(".box").forEach((box) => {
                if (box.contentEditable == "true")
                    box.style.background = "white";
                else box.style.background = "#dddddd";
            });

            let currentBox = event.target;
            let input = currentBox.innerHTML;
            let number = /^[0-9][A-Za-z0-9 -]*$/;

            currentBox.style.background = "rgb(197, 223, 251)";

            if (input.length > 1 || !input.match(number)) {
                event.target.innerHTML = "";
            }

            // Check if the input is possible
            document.querySelectorAll(".box").forEach((box) => {
                if (!isPossible(event, box)) {
                    // If not, color the current box red
                    box.style.background = "rgb(223, 159, 159)";
                    currentBox.style.background = "rgb(231, 76, 76)";
                }
            });
        });

        // When a box is clicked
        item.addEventListener("click", (event) => {
            // Clear colors
            document.querySelectorAll(".box").forEach((box) => {
                if (box.contentEditable == "true") {
                    box.style.background = "white";
                } else box.style.background = "#dddddd";
            });

            let currentBox = event.target;
            let input = currentBox.innerHTML;
            if (event.target.contentEditable == "true") {
                currentBox.style.background = "rgb(197, 223, 251)";
            }

            // Check if the input is possible
            document.querySelectorAll(".box").forEach((box) => {
                if (!isPossible(event, box)) {
                    // If not, color the current box red
                    box.style.background = "rgb(223, 159, 159)";
                    currentBox.style.background = "rgb(231, 76, 76)";
                }
            });
        });
    });

    // Check if the current input is possible
    function isPossible(event, box) {
        let currentBox = event.target;
        let input = currentBox.innerHTML;
        if (
            currentBox != box &&
            box.innerHTML == input &&
            box.innerHTML != "" &&
            (box.cellIndex == event.target.cellIndex ||
                box.parentNode.rowIndex == event.target.parentNode.rowIndex ||
                inSameSquare(currentBox, box))
        ) {
            return false;
        } else return true;
    }

    // Check if two boxes are in the same 3 x 3 square
    function inSameSquare(currentBox, box) {
        let x1 = Math.floor(currentBox.cellIndex / 3) * 3;
        let y1 = Math.floor(currentBox.parentNode.rowIndex / 3) * 3;
        let x2 = Math.floor(box.cellIndex / 3) * 3;
        let y2 = Math.floor(box.parentNode.rowIndex / 3) * 3;

        if (x1 == x2 && y1 == y2) return true;
        else return false;
    }

    /* END of Box Responsiveness */
}

/* END of Board Creation */

/* END of Importing Sudoku boards data */

/* UI Buttons */

// Button elements
let newGame = document.getElementById("new-game");
let confirmNewGame = document.getElementById("confirm-new-game");
let yesNewGame = document.getElementById("yes-new-game");
let noNewGame = document.getElementById("no-new-game");
let check = document.getElementById("check");
let solve = document.getElementById("solve");
let yesSolve = document.getElementById("yes-solve");
let noSolve = document.getElementById("no-solve");
let confirmSolve = document.getElementById("confirm-solve");

// New Game Button
newGame.addEventListener("click", () => {
    console.log("new game");
    confirmNewGame.style.display = "block";
    confirmSolve.style.display = "none";
});
yesNewGame.addEventListener("click", () => {
    console.log("changed to new game");
    let board = document.getElementById("board");
    let loading = document.getElementsByClassName("loader-container")[0];
    board.style.display = "none";
    loading.style.display = "flex";
    startGame(true);
    confirmNewGame.style.display = "none";
});
noNewGame.addEventListener("click", () => {
    confirmNewGame.style.display = "none";
});

// Check button
check.addEventListener("click", () => {
    console.log("checking...");
    if (checkBoard()) {
        console.log("The current board is correct.");
    } else {
        console.log("The current board is not possible.");
    }
});

// Solve button
solve.addEventListener("click", () => {
    console.log("solve");
    confirmSolve.style.display = "block";
    confirmNewGame.style.display = "none";
});
yesSolve.addEventListener("click", () => {
    console.log("solved the current game");
    console.log({ picked });
    createBoard(false, true);
    confirmSolve.style.display = "none";
});
noSolve.addEventListener("click", () => {
    confirmSolve.style.display = "none";
});

function checkBoard() {
    return true;
}

/* END of UI Buttons */
