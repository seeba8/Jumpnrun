class Wall158 extends Tile {
    constructor() {
        super();
        this.collide = true;
        this.movable = false;
        const i = this.image.getContext("2d");
        i.fillStyle = "red";
        i.beginPath();
        i.moveTo(0, Tile.TS);
        i.lineTo(Tile.TS, Tile.TS);
        i.lineTo(Tile.TS, Tile.TS / 2);
        i.closePath();
        i.fill();
    }
    top(x) {
        return Tile.TS - (x / 2);
    }
}
//# sourceMappingURL=wall158.js.map