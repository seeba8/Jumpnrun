"use strict";

let MyGame = { lastTick: 0, stopMain: 0 };
const CANVAS = (document.getElementById("canvas") as HTMLCanvasElement);
CANVAS.width = document.documentElement.clientWidth - 25;
CANVAS.height = document.documentElement.clientHeight - 25;
let player = new Player();
let world = new World();
const ctx = CANVAS.getContext("2d");
let keymap = {};
let lastTick = 0;

(() => {
  let debugQueue = [];
  function keyHandler(e) {
    keymap[e.keyCode] = e.type === "keydown";
  }

  function render() {
    const ts = world.getTileWidth();
    ctx.clearRect(0, 0, world.width * world.getTileWidth(), world.height * world.getTileWidth());

    for (let y = 0; y < world.height; y++) {
      for (let x = 0; x < world.width; x++) {
        if (world.grid[y][x] instanceof Wall) {
          ctx.fillStyle = "green";
          ctx.fillRect(x * ts, y * ts, ts, ts);
          ctx.fillStyle = "black";
          ctx.fillText(x % 10 + "", x * ts, y * ts + 10);
        }
      }
    }
    // Double bitwise negation ~~ is the same as Math.trunc
    // tslint:disable-next-line:no-bitwise
    ctx.fillRect(~~player.position.x, ~~player.position.y, player.width, player.height);
  }

  function playerIsGrounded(): boolean {
    const ts = world.getTileWidth();
    // Possible as long as we have no slopes
    if (player.position.y % ts !== 0) {
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

  function movePlayer(dt: number = 1): void {
    // function movePlayerX() {
    //   const obstacles = Array<{ x: number, y: number }>();
    //   const tilesize = world.getTileWidth();
    //   const forwardEdge = player.speed.x > 0 ? player.position.x + player.width : player.position.x;
    //   const rowmin = Math.floor(player.position.y / tilesize);
    //   const rowmax = Math.ceil((player.position.y + player.height) / tilesize) - 1;
    //   for (let y = rowmin; y <= rowmax; y++) {
    //     for (let x = Math.floor(forwardEdge / tilesize);
    //       x < world.width && x > -1;
    //       x += Math.sign(player.speed.x)) {
    //       if (world.grid[y][x].collide) {
    //         obstacles.push({ x, y });
    //         break;
    //       }
    //     }
    //   }

    //   let closestObstacle: { x: number, y: number };
    //   for (const o of obstacles) {
    //     if (closestObstacle === undefined) {
    //       closestObstacle = o;
    //     } else {
    //       if (Math.abs(o.x * tilesize - forwardEdge) <
    //         Math.abs(closestObstacle.x * tilesize - forwardEdge)) {
    //         closestObstacle = o;
    //       }
    //     }
    //   }
    //   for (const obstacle of world.movables) {
    //     // Check if it is closer
    //   }
    //   const distToWall = Math.abs(closestObstacle.x * tilesize + (player.speed.x < 0 ? tilesize : 0) -
    //     (player.position.x + (player.speed.x > 0 ? player.width : 0)));
    //   const walkDistance = Math.abs(player.speed.x * dt);
    //   if (distToWall < walkDistance) {
    //     player.position.x += Math.sign(player.speed.x) * distToWall;
    //     player.speed.x = 0;
    //   } else {
    //     player.position.x += Math.sign(player.speed.x) * walkDistance;
    //   }
    // }

    function movePlayerOnAxis(axis: "x" | "y") {
      const other = (axis === "x" ? "y" : "x");
      const obstacles = Array<{ x: number, y: number }>();
      const tilesize = world.getTileWidth();
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
          for (let x = Math.floor(forwardEdge / tilesize);
            x < world.width && x > -1;
            x += Math.sign(player.speed.x)) {
            if (world.grid[y][x].collide) {
              obstacles.push({ x, y });
              break;
            }
          }
        }
      } else {
        for (let x = rowmin; x <= rowmax; x++) {
          for (let y = Math.floor(forwardEdge / tilesize);
            y < world.height && y > -1;
            y += Math.sign(player.speed.y)) {
            if (world.grid[y][x].collide) {
              obstacles.push({ x, y });
              break;
            }
          }
        }
      }
      debug(JSON.stringify(obstacles));

      let closestObstacle: { x: number, y: number };
      for (const o of obstacles) {
        if (closestObstacle === undefined) {
          closestObstacle = o;
        } else {
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
        player.position[axis] += Math.sign(player.speed[axis]) * distToWall;
        player.speed[axis] = 0;
      } else {
        player.position[axis] += Math.sign(player.speed[axis]) * walkDistance;
      }
    }
    // function movePlayerY() {
    //   const obstacles = Array<{ x: number, y: number }>();
    //   const tilesize = world.getTileWidth();
    //   const forwardEdge = player.speed.y > 0 ? player.position.y + player.height : player.position.y;
    //   const colmin = Math.floor(player.position.x / tilesize);
    //   const colmax = Math.ceil((player.position.x + player.width) / tilesize) - 1;
    //   for (let x = colmin; x <= colmax; x++) {
    //     for (let y = Math.floor(forwardEdge / tilesize);
    //       y < world.height && y > -1;
    //       y += Math.sign(player.speed.y)) {
    //       if (world.grid[y][x].collide) {
    //         obstacles.push({ x, y });
    //         break;
    //       }
    //     }
    //   }

    //   let closestObstacle: { x: number, y: number };
    //   for (const o of obstacles) {
    //     if (closestObstacle === undefined) {
    //       closestObstacle = o;
    //     } else {
    //       if (Math.abs(o.y * tilesize - forwardEdge) <
    //         Math.abs(closestObstacle.y * tilesize - forwardEdge)) {
    //         closestObstacle = o;
    //       }
    //     }
    //   }
    //   for (const obstacle of world.movables) {
    //     // Check if it is closer
    //   }
    //   const distToWall = Math.abs(closestObstacle.y * tilesize + (player.speed.y < 0 ? tilesize : 0) -
    //     (player.position.y + (player.speed.y > 0 ? player.height : 0)));
    //   const walkDistance = Math.abs(player.speed.y * dt);
    //   if (distToWall < walkDistance) {
    //     player.position.y += Math.sign(player.speed.y) * distToWall;
    //     player.speed.y = 0;
    //   } else {
    //     player.position.y += Math.sign(player.speed.y) * walkDistance;
    //   }
    // }

    if (player.speed.x !== 0) {
      movePlayerOnAxis("x");
    }
    if (player.speed.y !== 0) {
      movePlayerOnAxis("y");
    }
  }

  function update(tick) {
    if (tick === undefined) {
      return;
    }
    const dt = (tick - lastTick) / (1000 / 60);
    lastTick = tick;
    player.targetSpeed.y = world.gravity;
    if (keymap[65]) {
      player.targetSpeed.x = -4;
    } else if (keymap[68]) {
      player.targetSpeed.x = 4;
    } else {
      player.targetSpeed.x = 0;
    }
    if (keymap[32] && playerIsGrounded()) {
      player.speed.y = -player.jumpSpeed;
    } else if (!keymap[32] && player.speed.y < -player.jumpSpeed / 2) {
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

  function printDebug() {
    ctx.fillStyle = "black";
    for (let i = 0; i < debugQueue.length; i++) {
      ctx.fillText(debugQueue[i], 10, 20 + 10 * i);
    }
  }

  function addDefaultDebug() {
    debugQueue.push(`Pos: ${Math.trunc(player.position.x)}, ${Number(player.position.y).toFixed(2)}`);
    debugQueue.push(`Speed: ${Number(player.speed.x).toFixed(2)}, ${Number(player.speed.y).toFixed(2)}`);
    debugQueue.push(`TargSpeed: ${Number(player.targetSpeed.x).toFixed(2)},` +
            ` ${Number(player.targetSpeed.y).toFixed(2)}`);
    debugQueue.push("Grounded: " + playerIsGrounded());
  }

  function main(tFrame) {
    debugQueue = [];
    // tslint:disable-next-line:no-bitwise
    const fps = ~~(1000 / (tFrame - lastTick));
    debug("FPS: " + fps);
    addDefaultDebug();
    MyGame.stopMain = window.requestAnimationFrame(main);

    update(tFrame);
    render();
    printDebug();
  }

  window.addEventListener("keydown", keyHandler);
  window.addEventListener("keyup", keyHandler);

  main(0);
})();
