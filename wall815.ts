class Wall815 extends Tile {
    public collide = true;
    public movable = false;
    constructor() {
        super();
        const i = this.image.getContext("2d");
        i.fillStyle = "red";
        i.beginPath();
        i.moveTo(0, 8);
        i.lineTo(0, 16);
        i.lineTo(16, 16);
        i.closePath();
        i.fill();
    }

    public top(x: number): number {
        return Tile.TS / 2 + x / 2;
    }
}
