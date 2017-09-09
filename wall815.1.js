class Wall815 extends Tile {
    constructor() {
        super();
        this.collide = true;
        this.movable = false;
        const i = this.image.getContext("2d");
        i.fillStyle = "red";
        i.beginPath();
        i.moveTo(0, 8);
        i.lineTo(0, 16);
        i.lineTo(16, 16);
        i.closePath();
        i.fill();
    }
    top(x) {
        return Tile.TS / 2 + x / 2;
    }
}
//# sourceMappingURL=wall815.1.js.map