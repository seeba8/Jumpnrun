class Tile {
    constructor() {
        const cnv = document.createElement("canvas");
        cnv.width = Tile.TS;
        cnv.height = Tile.TS;
        this.image = cnv;
    }
    top(x) {
        return 0;
    }
}
Tile.TS = 16;
//# sourceMappingURL=tile.js.map