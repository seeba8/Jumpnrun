class World {
    constructor(width = 80, height = 60, gravity = 8) {
        this.grid = Array();
        this.movables = Array();
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
                else if (x > 40 && x < 60 && y === 55) {
                    this.grid[y][x] = new Wall();
                }
                else {
                    this.grid[y][x] = new Air();
                }
            }
        }
    }
    getTileWidth() {
        return 10;
    }
}
//# sourceMappingURL=world.js.map