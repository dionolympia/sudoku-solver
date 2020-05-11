/* <tr>
    <td id="test" class="box" contenteditable></td>
    <td class="box" contenteditable></td>
    <td class="box right-border" contenteditable></td>
    <td class="box" contenteditable></td>
    <td class="box" contenteditable></td>
    <td class="box right-border" contenteditable></td>
    <td class="box" contenteditable></td>
    <td class="box" contenteditable></td>
    <td class="box" contenteditable></td>
</tr> */

/* Board Creation */

let boardMatrix = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
];

let board = document.getElementById("board");

// Convert matrix into an HTML table
for (row in boardMatrix) {
    // Create a row
    let tr = document.createElement("tr");
    board.appendChild(tr);

    // Create the data cells
    for (col in boardMatrix[row]) {
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
        tr.appendChild(td);
        td.contentEditable = "true";
    }
}

/* End of Board Creation */

/* Box responsiveness */

// When a box is filled
document.querySelectorAll(".box").forEach((item) => {
    // When a box is blurred
    item.addEventListener("blur", (event) => {
        let number = /^[0-9][A-Za-z0-9 -]*$/;

        // For every box on the board
        document.querySelectorAll(".box").forEach((box) => {
            let input = box.innerHTML;

            // Clear colors
            box.style.background = "white";

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
            box.style.background = "white";
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
            box.style.background = "white";
        });

        let currentBox = event.target;
        let input = currentBox.innerHTML;

        currentBox.style.background = "rgb(197, 223, 251)";

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

function checkBoard() {
    let foundError = false;
    // Check if the input is possible
    document.querySelectorAll(".box").forEach((box1) => {
        document.querySelectorAll(".box").forEach((box2) => {
            if (
                box1 != box2 &&
                box2.innerHTML == box1.innerHTML &&
                box2.innerHTML != "" &&
                (box1.parentNode.cellIndex == box2.parentNode.cellIndex ||
                    box1.parentNode.rowIndex == box2.parentNode.rowIndex ||
                    inSameSquare(box1, box2))
            ) {
                foundError = true;
            }
        });
    });

    if (foundError) return false;
    else return true;
}

/* End of Box Responsiveness */

/* UI Buttons */

// New Game button
let newGame = document.getElementById("new-game");
let confirmNewGame = document.getElementById("confirm-new-game");
newGame.addEventListener("click", () => {
    console.log("new game");
    confirmNewGame.style.display = "block";
});
let yesNewGame = document.getElementById("yes-new-game");
yesNewGame.addEventListener("click", () => {
    console.log("changed to new game");
    confirmNewGame.style.display = "none";
});
let noNewGame = document.getElementById("no-new-game");
noNewGame.addEventListener("click", () => {
    confirmNewGame.style.display = "none";
});

// Check button
let check = document.getElementById("check");
check.addEventListener("click", () => {
    console.log("checking...");
    if (checkBoard()) {
        console.log("The current board ");
    } else {
        console.log("The current board is not possible.");
    }
});

// Solve button
let solve = document.getElementById("solve");
let confirmSolve = document.getElementById("confirm-solve");
solve.addEventListener("click", () => {
    console.log("solve");
    confirmSolve.style.display = "block";
});
let yesSolve = document.getElementById("yes-solve");
yesSolve.addEventListener("click", () => {
    console.log("solved the current game");
    confirmSolve.style.display = "none";
});

let noSolve = document.getElementById("no-solve");
noSolve.addEventListener("click", () => {
    confirmSolve.style.display = "none";
});

/* End of UI Buttons */
