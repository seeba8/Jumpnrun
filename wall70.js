class Wall70 extends Slope {
    constructor() {
        super();
        this.collide = true;
        this.movable = false;
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
    top(x) {
        return 0.5 * Tile.TS - (x / 2);
    }
}
//# sourceMappingURL=wall70.js.map