class Wall07 extends Tile {
    public collide = true;
    public movable = false;
    constructor() {
        super();
        const i = this.image.getContext("2d");
        i.fillStyle = "red";
        i.beginPath();
        i.moveTo(0, 0);
        i.lineTo(0, Tile.TS);
        i.lineTo(16, 16);
        i.lineTo(16, 8);
        i.closePath();
        i.fill();
    }

    public top(x: number): number {
        return x / 2;
    }
}
