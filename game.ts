"use strict";
/**
 * TODO:
 * Add slopes
 * - ts/4?
 * - ts
 * - inverse slopes (decoration on roof)
 * Walk up slopes
 * Allow maps > canvas (scrolling)
 * Make tilesize scale with screensize (fixed number of tiles on 16:9 screen)
 * - Borders if screen != 16:9
 * Scroll screen/viewport accordingly
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
const DEBUGDIV = (document.getElementById("debugdiv") as HTMLPreElement);
const CANVASES = {
  MOVABLE: (document.getElementById("canvas-movable") as HTMLCanvasElement),
  STATIC: (document.getElementById("canvas-static") as HTMLCanvasElement),
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
    CTX.static.fillStyle = CTX.static.createPattern(new Air().image, "repeat");
    CTX.static.fillRect(0, 0, world.width * ts, world.height * ts);
    for (let y = 0; y < world.height; y++) {
      for (let x = 0; x < world.width; x++) {
          CTX.static.drawImage(world.grid[y][x].image, x * ts, y * ts);
          if (world.grid[y][x] instanceof Wall) {
          CTX.static.fillStyle = "black";
          CTX.static.fillText(x % 10 + "", x * ts + 1, y * ts + 10);
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
  /*
  function playerIsGrounded(): boolean {
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
  */

  function movePlayer(dt: number = 1): void {
    function movePlayerX(axis: "x" | "y") {
      const other = (axis === "x" ? "y" : "x");
      const obstacles = Array<{ x: number, y: number }>();
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
        player.position[axis] = /*Math.round(*/(player.position[axis] +
              Math.sign(player.speed[axis]) * distToWall) /* * 100) / 100*/;
        player.speed[axis] = 0;
      } else {
        player.position[axis] = /*Math.round(*/(player.position[axis] +
              Math.sign(player.speed[axis]) * walkDistance)/* * 100) / 100*/;
      }
    }
    function movePlayerY() {
      const obstacles = Array<{ x: number, y: number }>();
      const tilesize = world.tilesize;
      const forwardEdge = player.speed.y > 0 ? player.position.y + player.size.y : player.position.y;
      const rowmin = Math.floor(player.position.x / tilesize);
      const rowmax = Math.ceil((player.position.x  + player.size.x) / tilesize) - 1;

      /**
       * Needs separate code for X and Y axis, as we nee to loop the other axis first,
       * in order to be able to break after the first hit.
       * For example:
       *  | | |
       *  W | |
       *    | W
       *    W
       *
       * This would not work if we approach it row-wise.
       * Therefore, the outer loop decides the column, then we follow through on that column
       * until we have a hit
       */
      for (let x = rowmin; x <= rowmax; x++) {
        for (let y = Math.floor(forwardEdge / tilesize);
          y < world.height && y > -1;
          y += Math.sign(player.speed.y)) {
          if (world.grid[y][x].collide) {
            obstacles.push({ x, y });
            debug(x, y, world.grid[y][x].top(player.position.x % Tile.TS));
            break;
          }
        }
      }
      /**
       * Now, after we have a list of obstacle candidates, we find the closest static obstacle.
       * This is done by looping through them. Then, we filter those out that are at least one tile
       * further away than the current best (or replace the current best with the new one if it is at least
       * one tile closer).
       * If the two tiles are in the same row, we need to check to which the "top" value at
       * player.position.x % tilesize is smaller. tile.top describes the distance between the top of the
       * tile and the actual top. 0: full block, .5*ts: half block (8 at a ts of 16)
       */
      let closestObstacle: { x: number, y: number };
      for (const o of obstacles) {
        if (closestObstacle === undefined) {
          closestObstacle = o;
          continue; // Implicitly done anyway, but makes it clearer
        } else {
          if (Math.sign(player.speed.y) * o.y > Math.sign(player.speed.y) * closestObstacle.y) {
            /**
             * It can't be closer. This might not be a nice way to filter those out,
             * but it should work and I can't figure out a better way.
             * We multiply by -1 when jumping, because then (-)40 > (-) 41,
             * that is, the 40 is out of reach when there is a 41 to bang the head against
             */
          } else if (Math.sign(player.speed.y) * o.y < Math.sign(player.speed.y) * closestObstacle.y) {
            /**
             * It is at least one tile closer than the other one. So we use it as new closest obstacle
             */
            closestObstacle = o;
            continue; // Not necessary, but just to be sure, same as above
          } else {
              /**
               * They both have the same y value, so we need to figure it out more precisely using the
               * real distance to the top of the element
               * TODO: bottom also for negative speed.y (jumping against inverse slope)
               */
            if (world.grid[o.y][o.x].top(player.position.x % Tile.TS) <
              world.grid[closestObstacle.y][closestObstacle.x].top(player.position.x % Tile.TS)) {
              closestObstacle = o;
            }
          }
        }
      }
      debug(closestObstacle.x, closestObstacle.y);
      for (const obstacle of world.movables) {
        // Check if it is closer
      }
      const distToWall = Math.abs(world.grid[closestObstacle.y][closestObstacle.x].top(player.position.x % Tile.TS) +
        closestObstacle.y * tilesize + (player.speed.y < 0 ? tilesize : 0) -
        (player.position.y + (player.speed.y > 0 ? player.size.y : 0)));
      const walkDistance = Math.abs(player.speed.y * dt);
      if (distToWall < walkDistance) {
        player.position.y = player.position.y + Math.sign(player.speed.y) * distToWall;
        // We only want to set onGround to true if the player was falling,
        // Not if she was just hitting her head and colliding with a roof
        player.onGround = player.speed.y > 0;
        player.speed.y = 0;

      } else {
        player.position.y = player.position.y + Math.sign(player.speed.y) * walkDistance;
        player.onGround = false;
      }
    }

    if (player.speed.x !== 0) {
      movePlayerX("x");
    }
    if (player.speed.y !== 0) {
      movePlayerY();
    }
  }

  function update(tick) {
    if (tick === undefined || lastTick === undefined) {
      return;
    }
    const dt = (tick - lastTick) / (1000 / 60);
    player.targetSpeed.y = world.gravity;
    if (keymap[65]) {
      player.targetSpeed.x = -player.maxSpeed.x;
    } else if (keymap[68]) {
      player.targetSpeed.x = player.maxSpeed.x;
    } else {
      player.targetSpeed.x = 0;
    }
    if (keymap[32] && player.onGround) {
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

  function addDefaultDebug(tFrame: number) {
    debugQueue.push(`Pos: ${Math.trunc(player.position.x)}, ${Number(player.position.y).toFixed(2)}`);
    debugQueue.push(`Speed: ${Number(player.speed.x).toFixed(2)}, ${Number(player.speed.y).toFixed(2)}`);
    debugQueue.push(`TargSpeed: ${Number(player.targetSpeed.x).toFixed(2)},` +
            ` ${Number(player.targetSpeed.y).toFixed(2)}`);
    debugQueue.push("Grounded: " + player.onGround);
    // tslint:disable-next-line:no-bitwise
    const fps = ~~(1000 / (tFrame - lastTick));
    debugQueue.push("FPS: " + fps);
  }

  function main(tFrame) {
    // lastTick = tFrame - 16;
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
  // window.addEventListener("click", () => {window.requestAnimationFrame(main)});
  window.addEventListener("keyup", keyHandler);
  window.addEventListener("blur",  () => {
    console.log("PAUSE");
    window.cancelAnimationFrame(MyGame.stopMain);
    lastTick = undefined;
  });
  window.addEventListener("focus", () => {
    console.log("CONTINUE");
    MyGame.stopMain = window.requestAnimationFrame(main);
  });
})();
