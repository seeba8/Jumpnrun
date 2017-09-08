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
    public jumpSpeed = 6;
    public acceleration = {
        x: .4,
        y: .2,
    };
    public height = 29;
    public width = 20;
    public size = {x: this.width, y: this.height};
}
