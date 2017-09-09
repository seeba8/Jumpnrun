class Air extends Tile {
    constructor() {
        super();
        this.collide = false;
        this.movable = false;
        const i = this.image.getContext("2d");
        i.fillStyle = "lightblue";
        i.fillRect(0, 0, 16, 16);
    }
}
//# sourceMappingURL=air.js.map