"use strict";
class Player {
    public static height = 32;
    public static width = 32;

    public onGround: boolean = false;

    public position = {
        x: 262.,
        y: 592.,
    };
    public speed = {
        x: 0.,
        y: 0.,
    };
    public targetSpeed = {
        x: 0.,
        y: 0.,
    };
    public maxSpeed = {
        x: 2,
        y: 8,
    };
    public jumpSpeed = 6;
    public acceleration = {
        x: .4,
        y: .2,
    };
    get size() {
        return {x: Player.width, y: Player.height};
    }
}
