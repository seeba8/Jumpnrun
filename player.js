"use strict";
class Player {
    constructor() {
        this.onGround = false;
        this.position = {
            x: 262.,
            y: 592.,
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
            x: 2,
            y: 8,
        };
        this.jumpSpeed = 6;
        this.acceleration = {
            x: .4,
            y: .2,
        };
    }
    get size() {
        return { x: Player.width, y: Player.height };
    }
}
Player.height = 32;
Player.width = 32;
//# sourceMappingURL=player.js.map