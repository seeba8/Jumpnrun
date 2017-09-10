class Wall158 extends Slope {
    public collide = true;
    public movable = false;
    constructor() {
        super();
        const i = this.image.getContext("2d");
        i.fillStyle = "red";
        i.beginPath();
        i.moveTo(0, Tile.TS);
        i.lineTo(Tile.TS, Tile.TS);
        i.lineTo(Tile.TS, Tile.TS / 2);
        i.closePath();
        i.fill();
    }

    public top(x: number): number {
        return Tile.TS - (x / 2);
    }
}
