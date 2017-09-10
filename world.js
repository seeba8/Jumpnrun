"use strict";
class World {
    constructor(width = 60, height = 40, gravity = 8) {
        this.grid = Array();
        this.movables = Array();
        this.tilesize = 16;
        this.size = { x: this.width, y: this.height };
        this.width = width;
        this.height = height;
        this.gravity = gravity;
        for (let y = 0; y < this.height; y++) {
            this.grid[y] = [];
            for (let x = 0; x < this.width; x++) {
                if (x === 0 || x === this.width - 1 || y === 0 || y === this.height - 1) {
                    this.grid[y][x] = new Wall();
                }
                else if (x > 30 && x < 40 && y === 35) {
                    this.grid[y][x] = new Wall();
                }
                else {
                    this.grid[y][x] = new Air();
                }
            }
        }
        this.grid[this.height - 2][10] = new Wall07();
        this.grid[this.height - 2][11] = new Wall815();
        this.grid[this.height - 2][9] = new Wall();
        this.grid[this.height - 2][20] = new Wall158();
        this.grid[this.height - 2][21] = new Wall70();
        this.grid[this.height - 3][22] = new Wall158();
        this.grid[this.height - 3][23] = new Wall70();
        this.grid[this.height - 4][24] = new Wall158();
        this.grid[this.height - 4][25] = new Wall70();
        this.grid[this.height - 4][26] = new Wall();
    }
    get pixelWidth() {
        return this.width * this.tilesize;
    }
    get pixelHeight() {
        return this.height * this.tilesize;
    }
}
//# sourceMappingURL=world.js.map