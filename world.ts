"use strict";
class World {
    public width;
    public height;
    public gravity;
    public grid = Array<Tile[]>();
    public movables = Array<Tile>();
    public tilesize = 17;

    get pixelWidth(){
        return this.width * this.tilesize;
    }

    get pixelHeight() {
        return this.height * this.tilesize;
    }

    public size = {x: this.width, y: this.height};
    constructor(width: number = 60, height: number= 40, gravity: number = 8) {
        this.width = width;
        this.height = height;
        this.gravity = gravity;
        for (let y = 0; y < this.height; y++) {
            this.grid[y] = [];
            for ( let x = 0; x < this.width; x++) {
                if (x === 0 || x === this.width - 1 || y === 0 || y === this.height - 1) {
                    this.grid[y][x] = new Wall();
                } else if (x > 30 && x < 40 && y === 35) {
                    this.grid[y][x] = new Wall();
                } else {
                    this.grid[y][x] = new Air();
                }
            }
        }
    }
}
