"use strict";
/**
 * TODO:
 * Add slopes
 * - ts/4
 * - ts/2
 * Add maps > canvas (scrolling)
 * Add traction for slowing down / accelerating (ice/mud)
 * Add ladders
 * Add wind
 * Add water (underwater lower gravity)
 * Add semipermeable elements:
 * - only up
 * - press down to go down
 * Add movable objects
 * Add spikes
 * Add monsters (AI)
 */
let MyGame = { lastTick: 0, stopMain: 0 };
const DEBUGDIV = document.getElementById("debugdiv");
const CANVASES = {
    MOVABLE: document.getElementById("canvas-movable"),
    STATIC: document.getElementById("canvas-static"),
};
const CTX = {
    mov: CANVASES.MOVABLE.getContext("2d"),
    static: CANVASES.STATIC.getContext("2d"),
};
for (const canvas in CANVASES) {
    if (CANVASES.hasOwnProperty(canvas)) {
        CANVASES[canvas].width = document.documentElement.clientWidth;
        CANVASES[canvas].height = document.documentElement.clientHeight;
    }
}
let player = new Player();
let world = new World();
let keymap = {};
let lastTick = 0;
(() => {
    let debugQueue = [];
    function keyHandler(e) {
        keymap[e.keyCode] = e.type === "keydown";
    }
    function clearMovable() {
        // tslint:disable-next-line:no-bitwise
        CTX.mov.clearRect(~~player.position.x, ~~player.position.y, player.size.x, player.size.y);
    }
    function renderMovable() {
        // CTX.mov.clearRect(0, 0, world.pixelWidth, world.pixelHeight);
        // Double bitwise negation ~~ is the same as Math.trunc
        // tslint:disable-next-line:no-bitwise
        CTX.mov.fillRect(~~player.position.x, ~~player.position.y, player.size.x, player.size.y);
    }
    function renderStatic() {
        const ts = world.tilesize;
        for (let y = 0; y < world.height; y++) {
            for (let x = 0; x < world.width; x++) {
                if (world.grid[y][x] instanceof Wall) {
                    CTX.static.fillStyle = "green";
                    CTX.static.fillRect(x * ts, y * ts, ts, ts);
                    CTX.static.fillStyle = "black";
                    CTX.static.fillText(x % 10 + "", x * ts, y * ts + 10);
                }
            }
        }
    }
    function renderDebug() {
        DEBUGDIV.textContent = "";
        for (const msg of debugQueue) {
            DEBUGDIV.textContent += msg + "\r\n";
        }
    }
    function playerIsGrounded() {
        const ts = world.tilesize;
        // Possible as long as we have no slopes
        if ((player.position.y + player.size.y) % ts !== 0) {
            return false;
        }
        const leftTile = Math.floor(player.position.x / ts);
        // If the player is only in one tile, then we only need to look at one tile
        const rightTile = (player.position.x % ts === 0 ? leftTile :
            Math.ceil((player.position.x + player.size.x) / ts) - 1);
        // tslint:disable-next-line:no-bitwise
        const y = ~~((player.position.y + player.size.y) / ts);
        return world.grid[y][leftTile].collide || world.grid[y][rightTile].collide;
    }
    function movePlayer(dt = 1) {
        function movePlayerOnAxis(axis) {
            const other = (axis === "x" ? "y" : "x");
            const obstacles = Array();
            const tilesize = world.tilesize;
            const forwardEdge = player.speed[axis] > 0 ? player.position[axis] + player.size[axis] : player.position[axis];
            const rowmin = Math.floor(player.position[other] / tilesize);
            const rowmax = Math.ceil((player.position[other] + player.size[other]) / tilesize) - 1;
            /**
             * Needs separate code for X and Y axis, as we nee to loop the other axis first,
             * in order to be able to break after the first hit.
             * For example:
             * -----------W break
             * -------W break
             * ---------------W break
             * This would not work if we approach it column-wise
             */
            if (axis === "x") {
                for (let y = rowmin; y <= rowmax; y++) {
                    for (let x = Math.floor(forwardEdge / tilesize); x < world.width && x > -1; x += Math.sign(player.speed.x)) {
                        if (world.grid[y][x].collide) {
                            obstacles.push({ x, y });
                            break;
                        }
                    }
                }
            }
            else {
                for (let x = rowmin; x <= rowmax; x++) {
                    for (let y = Math.floor(forwardEdge / tilesize); y < world.height && y > -1; y += Math.sign(player.speed.y)) {
                        if (world.grid[y][x].collide) {
                            obstacles.push({ x, y });
                            break;
                        }
                    }
                }
            }
            let closestObstacle;
            for (const o of obstacles) {
                if (closestObstacle === undefined) {
                    closestObstacle = o;
                }
                else {
                    if (Math.abs(o[axis] * tilesize - forwardEdge) <
                        Math.abs(closestObstacle[axis] * tilesize - forwardEdge)) {
                        closestObstacle = o;
                    }
                }
            }
            for (const obstacle of world.movables) {
                // Check if it is closer
            }
            const distToWall = Math.abs(closestObstacle[axis] * tilesize + (player.speed[axis] < 0 ? tilesize : 0) -
                (player.position[axis] + (player.speed[axis] > 0 ? player.size[axis] : 0)));
            const walkDistance = Math.abs(player.speed[axis] * dt);
            if (distToWall < walkDistance) {
                player.position[axis] = (player.position[axis] +
                    Math.sign(player.speed[axis]) * distToWall) /* * 100) / 100*/;
                player.speed[axis] = 0;
            }
            else {
                player.position[axis] = (player.position[axis] +
                    Math.sign(player.speed[axis]) * walkDistance) /* * 100) / 100*/;
            }
        }
        if (player.speed.x !== 0) {
            movePlayerOnAxis("x");
        }
        if (player.speed.y !== 0) {
            movePlayerOnAxis("y");
        }
    }
    function update(tick) {
        if (tick === undefined || lastTick === undefined) {
            return;
        }
        const dt = (tick - lastTick) / (1000 / 60);
        player.targetSpeed.y = world.gravity;
        if (keymap[65]) {
            player.targetSpeed.x = -4;
        }
        else if (keymap[68]) {
            player.targetSpeed.x = 4;
        }
        else {
            player.targetSpeed.x = 0;
        }
        if (keymap[32] && playerIsGrounded()) {
            player.speed.y = -player.jumpSpeed;
        }
        else if (!keymap[32] && player.speed.y < -player.jumpSpeed / 2) {
            player.speed.y = -player.jumpSpeed / 2;
        }
        const accelDirection = {
            x: Math.sign(player.targetSpeed.x - player.speed.x),
            y: Math.sign(player.targetSpeed.y - player.speed.y),
        };
        player.speed.x += player.acceleration.x * accelDirection.x * dt;
        player.speed.y += player.acceleration.y * accelDirection.y * dt;
        if (Math.sign(player.targetSpeed.x - player.speed.x) !== accelDirection.x) {
            player.speed.x = player.targetSpeed.x;
        }
        if (Math.sign(player.targetSpeed.y - player.speed.y) !== accelDirection.y) {
            player.speed.y = player.targetSpeed.y;
        }
        movePlayer(dt);
    }
    function debug(...args) {
        debugQueue.push(args.join());
    }
    function addDefaultDebug(tFrame) {
        debugQueue.push(`Pos: ${Math.trunc(player.position.x)}, ${Number(player.position.y).toFixed(2)}`);
        debugQueue.push(`Speed: ${Number(player.speed.x).toFixed(2)}, ${Number(player.speed.y).toFixed(2)}`);
        debugQueue.push(`TargSpeed: ${Number(player.targetSpeed.x).toFixed(2)},` +
            ` ${Number(player.targetSpeed.y).toFixed(2)}`);
        debugQueue.push("Grounded: " + playerIsGrounded());
        // tslint:disable-next-line:no-bitwise
        const fps = ~~(1000 / (tFrame - lastTick));
        debugQueue.push("FPS: " + fps);
    }
    function main(tFrame) {
        clearMovable();
        debugQueue = [];
        addDefaultDebug(tFrame);
        MyGame.stopMain = window.requestAnimationFrame(main);
        update(tFrame);
        renderMovable();
        renderDebug();
        lastTick = tFrame;
    }
    renderStatic();
    main(0);
    window.addEventListener("keydown", keyHandler);
    window.addEventListener("keyup", keyHandler);
    window.addEventListener("blur", () => {
        console.log("PAUSE");
        window.cancelAnimationFrame(MyGame.stopMain);
        lastTick = undefined;
    });
    window.addEventListener("focus", () => {
        console.log("CONTINUE");
        MyGame.stopMain = window.requestAnimationFrame(main);
    });
})();
//# sourceMappingURL=game.js.map