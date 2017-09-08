class World {
    public width;
    public height;
    public gravity;
    public grid = Array<Tile[]>();
    public movables = Array<Tile>();
    public size = {x: this.width, y: this.height};
    constructor(width: number = 80, height: number= 60, gravity: number = 8) {
        this.width = width;
        this.height = height;
        this.gravity = gravity;
        for (let y = 0; y < this.height; y++) {
            this.grid[y] = [];
            for ( let x = 0; x < this.width; x++) {
                if (x === 0 || x === this.width - 1 || y === 0 || y === this.height - 1) {
                    this.grid[y][x] = new Wall();
                } else if (x > 40 && x < 60 && y === 55) {
                    this.grid[y][x] = new Wall();
                } else {
                    this.grid[y][x] = new Air();
                }
            }
        }
    }

    public getTileWidth() {
        return 10;
    }
}
