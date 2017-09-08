"use strict";
class Player {
    public position = {
        x: 100.,
        y: 100.,
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
        x: 8,
        y: 8,
    };
    public jumpSpeed = 4;
    public acceleration = {
        x: .2,
        y: .1,
    };
    public height = 20;
    public width = 10;
    public size = {x: this.width, y: this.height};
}
