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
        if (input.length > 1 || !input.match(number)) {
            event.target.innerHTML = "";
        }

        // Check if the number placement makes sense
        document.querySelectorAll(".box").forEach((box) => {
            if (
                currentBox != box &&
                box.innerHTML == input &&
                box.innerHTML != "" &&
                (box.cellIndex == event.target.cellIndex ||
                    box.parentNode.rowIndex ==
                        event.target.parentNode.rowIndex ||
                    inSameSquare(currentBox, box))
            ) {
                // If there is, color the current box red
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

        // Check if the number already exists:
        document.querySelectorAll(".box").forEach((box) => {
            if (
                currentBox != box &&
                box.innerHTML == input &&
                box.innerHTML != "" &&
                (box.cellIndex == currentBox.cellIndex ||
                    box.parentNode.rowIndex == currentBox.parentNode.rowIndex ||
                    inSameSquare(currentBox, box))
            ) {
                // If there is, color the current box red
                box.style.background = "rgb(223, 159, 159)";
                currentBox.style.background = "rgb(231, 76, 76)";
                // console.log(
                //     "rows:" +
                //         currentBox.parentNode.rowIndex +
                //         "," +
                //         box.parentNode.rowIndex
                // );
                // console.log(
                //     "cols:" + currentBox.cellIndex + "," + box.cellIndex
                // );
            }
        });
    });
});

// Check if two boxes are in the same 3 x 3 square
function inSameSquare(currentBox, box) {
    let x1 = Math.floor(currentBox.cellIndex / 3) * 3;
    let y1 = Math.floor(currentBox.parentNode.rowIndex / 3) * 3;
    let x2 = Math.floor(box.cellIndex / 3) * 3;
    let y2 = Math.floor(box.parentNode.rowIndex / 3) * 3;

    if (x1 == x2 && y1 == y2) return true;
    else return false;
}

/* End of Box Responsiveness */

/* UI Buttons */
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

let check = document.getElementById("check");
check.addEventListener("click", () => {
    console.log("check");
});

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
