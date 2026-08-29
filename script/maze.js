const joystick = document.querySelector(".joystick");
const winMessage = document.getElementById("win_message");
const homeButton = document.getElementById("home_button");

const upButton = document.querySelector(".up");
const downButton = document.querySelector(".down");
const leftButton = document.querySelector(".left");
const rightButton = document.querySelector(".right");

const size = Number(sessionStorage.getItem("mazeSize")) || 15;
const maze = generateMaze(size);

const startRow = 0;
const startCol = Math.floor(size / 2);
const endRow = size - 1;
const endCol = Math.floor(size / 2);

drawMaze(maze);
placeSprite("../assets/finish_flag.png", endRow, endCol);
const player = placeSprite("../assets/Caracter.png", startRow, startCol);

let playerRow = startRow;
let playerCol = startCol;

function movePlayer(rowChange, colChange) {
    let nextRow = playerRow + rowChange;
    let nextCol = playerCol + colChange;

    if (nextRow < 0 || nextRow >= size || nextCol < 0 || nextCol >= size) {
        return;
    }

    if (maze[nextRow][nextCol] === 1) {
        return;
    }

    playerRow = nextRow;
    playerCol = nextCol;

    player.style.gridRowStart = playerRow + 1;
    player.style.gridColumnStart = playerCol + 1;

    if (playerRow === endRow && playerCol === endCol) {
        joystick.style.display = "none";
        winMessage.style.display = "flex";
    }
}

upButton.addEventListener("click", () => movePlayer(-1, 0));
downButton.addEventListener("click", () => movePlayer(1, 0));
leftButton.addEventListener("click", () => movePlayer(0, -1));
rightButton.addEventListener("click", () => movePlayer(0, 1));

homeButton.addEventListener("click", () => {
    window.location.href = "../index.html";
});
