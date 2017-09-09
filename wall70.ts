class Wall70 extends Tile {
    public collide = true;
    public movable = false;
    constructor() {
        super();
        const i = this.image.getContext("2d");
        i.fillStyle = "red";
        i.beginPath();
        i.moveTo(Tile.TS, 0);
        i.lineTo(Tile.TS, Tile.TS);
        i.lineTo(0, Tile.TS);
        i.lineTo(0, Tile.TS / 2);
        i.closePath();
        i.fill();
    }

    public top(x: number): number {
        return 0.5 * Tile.TS - (x / 2);
    }
}
