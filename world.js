"use strict";
class World {
    constructor(width = 60, height = 40, gravity = 8) {
        this.grid = Array();
        this.movables = Array();
        this.tilesize = 17;
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
    }
    get pixelWidth() {
        return this.width * this.tilesize;
    }
    get pixelHeight() {
        return this.height * this.tilesize;
    }
}
//# sourceMappingURL=world.js.map