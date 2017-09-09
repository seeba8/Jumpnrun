abstract class Tile {
    public static TS = 16;

    public abstract collide: boolean;
    public abstract movable: boolean;
    public image: HTMLCanvasElement;

    constructor() {
        const cnv = document.createElement("canvas");
        cnv.width = Tile.TS;
        cnv.height = Tile.TS;
        this.image = cnv;
    }

    public top(x: number): number {
        return 0;
    }
}
