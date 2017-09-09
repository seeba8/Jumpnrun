class Air extends Tile {
    public collide = false;
    public movable = false;
    constructor() {
        super();
        const i = this.image.getContext("2d");
        i.fillStyle = "lightblue";
        i.fillRect(0, 0, 16, 16);
    }
}
