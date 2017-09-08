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
        this.jumpSpeed = 4;
        this.acceleration = {
            x: .2,
            y: .1,
        };
        this.height = 20;
        this.width = 10;
        this.size = { x: this.width, y: this.height };
    }
}
//# sourceMappingURL=player.js.map