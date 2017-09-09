class Wall07 extends Tile {
    constructor() {
        super();
        this.collide = true;
        this.movable = false;
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
    top(x) {
        return x / 2;
    }
}
//# sourceMappingURL=wall07.js.map