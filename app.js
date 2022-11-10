const grid = document.querySelector(".grid"); // define the main grid div
let currentShooterIndex = 218; //this sets the default index for the shooter. The index number will change as the player moves the shooter
const width = 15;
let direction = 1;
let squirrelsId;
let goingRight = true;
let results = document.querySelector("body");
let squirrelsRemoved = [];
let score = 0;
let woofsId;

//this loop creates 225 divs and nestles them within the main grid div
for (let i = 0; i < 225; i++) {
    const square = document.createElement("div");
    grid.appendChild(square);
}

//this makes an array of all the available squares, assigning each an individual index that we can use to identify positions
const squares = Array.from(document.querySelectorAll(".grid div"));

//this array stipulates where the squirrels will start on the grid
const squirrels = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 17, 19, 20, 22, 23, 25, 26, 33, 34, 35, 36, 37,
    38, 39, 42,
];

//this function sets the squirrels in position by looping through and adding a class to each index in the squirrels array
function addSquirrels() {
    for (let i = 0; i < squirrels.length; i++) {
        if (!squirrelsRemoved.includes(i)) {
            squares[squirrels[i]].classList.add("squirrel");
        }
    }
}
addSquirrels();

//this sets the shooter in position by adding the shooter class to the current shooter index div//
squares[currentShooterIndex].classList.add("shooter");

//this function moves the shooter by first removing the class, then either adding or subtracting a number from the currentshooterindex
//the if statement checks whether the shooter is in-bounds of the grid, only allowing movement if there is a grid square available
//modulus operator -> if the currentshooterindex returns a decimal number when divided by width, it is within bounds. if it divides evenly then it is not
function moveShooter(e) {
    squares[currentShooterIndex].classList.remove("shooter");
    switch (
        e.key //e key = read-only event created when the keyup or keydown event is fired.//
    ) {
        case "ArrowLeft":
            if (currentShooterIndex % width !== 0) currentShooterIndex -= 1;
            break;
        case "ArrowRight":
            if (currentShooterIndex % width < width - 1)
                currentShooterIndex += 1;
            break;
    }
    squares[currentShooterIndex].classList.add("shooter");
}
document.addEventListener("keydown", moveShooter);

function removeSquirrels() {
    for (let i = 0; i < squirrels.length; i++) {
        squares[squirrels[i]].classList.remove("squirrel");
    }
}

function moveSquirrels() {
    const leftEdge = squirrels[0] % width === 0;
    const rightEdge = squirrels[squirrels.length - 1] % width === width - 1;
    removeSquirrels();

    if (rightEdge && goingRight) {
        for (let i = 0; i < squirrels.length; i++) {
            squirrels[i] += width + 1; //this moves them down a row by adding 16 to the index
            direction = -1; //this changes direction
            goingRight = false;
        }
    }

    if (leftEdge && !goingRight) {
        for (let i = 0; i < squirrels.length; i++) {
            squirrels[i] += width - 1;
            direction = 1;
            goingRight = true;
        }
    }
    for (let i = 0; i < squirrels.length; i++) {
        squirrels[i] += direction;
    }

    addSquirrels();
    if (squirrels[squirrels.length - 1] > 220) {
        clearInterval(squirrelsId);
        results.innerText = "Game Over, the squirrel reached the bottom";
    }

    //this sends a game over and stops the interval if any square contains both the squirrel and shooter classes simulataneously

    if (
        squares[currentShooterIndex].classList.contains("squirrel", "shooter")
    ) {
        clearInterval(squirrelsId);
        results.innerText = "Game Over, the squirrel ate you!";
    }
    if (squirrelsRemoved.length === squirrels.length) {
        clearInterval(squirrelsId);
        clearInterval(woofsId);

        results.innerText = "You win";
    }
}

//this runs the mve squirrels function on an interval of 500ms
squirrelsId = setInterval(moveSquirrels, 500);

function woofs(e) {
    let woofsId;
    let currentWoofsIndex = currentShooterIndex;

    function moveWoofs() {
        squares[currentWoofsIndex].classList.remove("woof");
        if (currentWoofsIndex > width) {
            currentWoofsIndex -= width;
            squares[currentWoofsIndex].classList.add("woof");
        } //this moves it up one line

        if (squares[currentWoofsIndex].classList.contains("squirrel")) {
            squares[currentWoofsIndex].classList.remove("woof");
            squares[currentWoofsIndex].classList.remove("squirrel");
            clearInterval(woofsId);

            const squirrelRemoved = squirrels.indexOf(currentWoofsIndex);
            squirrelsRemoved.push(squirrelRemoved);
            updateScore();
        }
    }

    woofsId = setInterval(moveWoofs, 100);
}

document.addEventListener("keydown", woofs);

// function updateScore() {
//     let showScore = document.querySelector(".score");
//     score++;
//     showScore.innerText = score;
// }
