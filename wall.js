class Wall extends Tile {
    constructor() {
        super();
        this.collide = true;
        this.movable = false;
        const i = this.image.getContext("2d");
        i.fillStyle = "green";
        i.fillRect(0, 0, 16, 16);
    }
}
//# sourceMappingURL=wall.js.map