"use strict";
class Player {
    constructor() {
        this.position = {
            x: 100.,
            y: 100.,
        };
        this.speed = {
            x: 0.,
            y: 0.,
        };
        this.targetSpeed = {
            x: 0.,
            y: 0.,
        };
        this.maxSpeed = {
            x: 8,
            y: 8,
        };
        this.jumpSpeed = 6;
        this.acceleration = {
            x: .4,
            y: .2,
        };
        this.height = 29;
        this.width = 20;
        this.size = { x: this.width, y: this.height };
    }
}
//# sourceMappingURL=player.js.map