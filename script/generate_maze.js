function generateMaze(size) {
    let maze = Array.from({ length: size }, () => Array(size).fill(1));

    function carvePath(x, y) {
        maze[y][x] = 0;

        let directions = [
            [2, 0],
            [-2, 0],
            [0, 2],
            [0, -2]
        ];

        directions.sort(() => Math.random() - 0.5);

        for (let [changeX, changeY] of directions) {
            let nextX = x + changeX;
            let nextY = y + changeY;

            if (
                nextX > 0 &&
                nextX < size - 1 &&
                nextY > 0 &&
                nextY < size - 1 &&
                maze[nextY][nextX] === 1
            ) {
                maze[y + changeY / 2][x + changeX / 2] = 0;
                carvePath(nextX, nextY);
            }
        }
    }

    let middle = Math.floor(size / 2);

    if (middle % 2 === 0) {
        middle--;
    }

    carvePath(middle, 1);

    maze[0][Math.floor(size / 2)] = 0;
    maze[1][Math.floor(size / 2)] = 0;

    maze[size - 1][Math.floor(size / 2)] = 0;
    maze[size - 2][Math.floor(size / 2)] = 0;

    return maze;
}