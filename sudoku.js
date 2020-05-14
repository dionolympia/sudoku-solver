/* Importing Sudoku boards data */
let picked;

// Start the game when DOM's loaded
document.addEventListener("DOMContentLoaded", function (event) {
    startGame(false);
});

// Starting function
function startGame(isRestart) {
    let file = "sudoku.csv";
    readTextFile(file, isRestart);
}

// Reading the csv file
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

// Process data into lines
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
    let random = Math.floor(Math.random() * (49999 + 1));
    picked = lines[random];

    // Show & create the board after a random line/puzzle is picked
    loaded();
    createBoard(isRestart, false);
}

// Remove loading bar and show the board
function loaded() {
    let loading = document.getElementsByClassName("loader-container")[0];
    loading.style.display = "none";
    let board = document.getElementById("board");
    board.style.display = "block";
}

// Creating a blank board
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
    }

    for (number in unsolved) {
        let row = Math.floor(number / 9);
        let col = number - row * 9;
        unsolvedBoardMatrix[row][col] = unsolved[number];
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
            let classes = document.createAttribute("class");
            let inputMode = document.createAttribute("inputmode");
            classes.value = "box";
            inputMode.value = "decimal";

            // Add vertical dividers
            if (col == 2 || col == 5) {
                classes.value = classes.value + " " + "right-border";
            }

            // Add horizontal dividers
            if (row == 2 || row == 5) {
                classes.value = classes.value + " " + "bottom-border";
            }

            // Add the attributes/properties for the row
            td.setAttributeNode(classes);

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
                td.setAttributeNode(inputMode);
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
            console.log(event.target.value);
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
let checkMsg = document.getElementById("check-msg");

// New Game Button
newGame.addEventListener("click", () => {
    confirmNewGame.style.display = "block";
    confirmSolve.style.display = "none";
    checkMsg.style.display = "none";
});
yesNewGame.addEventListener("click", () => {
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
    let newGame = document.getElementById("confirm-new-game");
    let solve = document.getElementById("confirm-solve");
    let checkMsg = document.getElementById("check-msg");
    let correct = document.getElementById("check-correct");
    let wrong = document.getElementById("check-wrong");
    let errorCount = document.getElementById("error-count");
    let checking = checkBoard();

    newGame.style.display = "none";
    solve.style.display = "none";
    checkMsg.style.display = "flex";

    if (checking.result) {
        correct.style.display = "block";
        wrong.style.display = "none";
    } else {
        wrong.style.display = "block";
        correct.style.display = "none";
        errorCount.innerHTML = checking.errors;
    }
});

check.addEventListener("blur", () => {
    let checkMsg = document.getElementById("check-msg");
    let correct = document.getElementById("check-correct");
    let wrong = document.getElementById("check-wrong");
    checkMsg.style.display = "none";
    correct.style.display = "none";
    wrong.style.display = "none";
});

// Solve button
solve.addEventListener("click", () => {
    confirmSolve.style.display = "block";
    confirmNewGame.style.display = "none";
    checkMsg.style.display = "none";
});
yesSolve.addEventListener("click", () => {
    createBoard(false, true);
    confirmSolve.style.display = "none";
});
noSolve.addEventListener("click", () => {
    confirmSolve.style.display = "none";
});

// Check if the board is correct
function checkBoard() {
    let solved = picked.solved;
    let foundError = false;
    let board = document.getElementById("board");
    let rows = board.childNodes;
    let errorCount = 0;

    // For each row
    rows.forEach((row, rowIndex) => {
        let columns = row.childNodes;

        // For each column
        columns.forEach((box, colIndex) => {
            let currentVal = box.innerHTML;
            let solvedIndex = rowIndex * 9 + colIndex;

            // If box is correct
            if (currentVal == solved[solvedIndex]) {
                // Color it green (if it's editable)
                if (
                    box.style.background != "rgb(221, 221, 221)" &&
                    box.style.background != "rgb(223, 159, 159)"
                ) {
                    box.style.background = "#88c999";
                }

                if (box.style.background == "rgb(223, 159, 159)") {
                    box.style.background = "rgb(221, 221, 221)";
                }
            } else {
                box.style.background = "rgb(223, 159, 159)";

                // And keep track of the error
                errorCount += 1;
                foundError = true;
            }
        });
    });

    if (foundError) return { result: false, errors: errorCount };
    else return { result: true, errors: errorCount };
}

/* END of UI Buttons */
