class Wall extends Tile {
    public collide = true;
    public movable = false;
    constructor() {
        super();
        const i = this.image.getContext("2d");
        i.fillStyle = "green";
        i.fillRect(0, 0, 16, 16);
    }
}
