const mazeGrid = document.getElementById("maze_grid");

let currentMazeSize = 0;
function applyGridSize() {
    if (!currentMazeSize) {
        return;
    }

    const vmin = Math.min(window.innerWidth, window.innerHeight);
    const cell = Math.max(1, Math.floor((vmin * 0.9) / currentMazeSize));
    const total = cell * currentMazeSize;

    mazeGrid.style.width = `${total}px`;
    mazeGrid.style.height = `${total}px`;
    mazeGrid.style.gridTemplateColumns = `repeat(${currentMazeSize}, ${cell}px)`;
    mazeGrid.style.gridTemplateRows = `repeat(${currentMazeSize}, ${cell}px)`;
}

function drawMaze(maze) {
    currentMazeSize = maze.length;
    applyGridSize();

    for (let row = 0; row < maze.length; row++) {
        for (let col = 0; col < maze.length; col++) {
            let tile = document.createElement("img");
            tile.src = maze[row][col] === 1 ? "../assets/wall.png" : "../assets/grass.png";
            tile.style.gridRowStart = row + 1;
            tile.style.gridColumnStart = col + 1;
            mazeGrid.appendChild(tile);
        }
    }
}

function placeSprite(src, row, col) {
    let sprite = document.createElement("img");
    sprite.src = src;
    sprite.style.gridRowStart = row + 1;
    sprite.style.gridColumnStart = col + 1;
    mazeGrid.appendChild(sprite);
    return sprite;
}

window.addEventListener("resize", applyGridSize);
