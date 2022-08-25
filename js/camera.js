"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Camera = void 0;
const main_1 = require("./main");
const geometry_1 = require("./geometry");
const overworld_1 = require("./states/overworld");
const queue_1 = require("./queue");
class Camera extends geometry_1.Rectangle {
    constructor(x, y) {
        super(x, y, (0, main_1.WIDTH)(), (0, main_1.HEIGHT)());
        this.updateCount = 0;
        this.offsetX = 0;
        this.offsetY = 0;
        this.map = new overworld_1.OverworldMap();
        this.drawQueue = new queue_1.Queue();
        this.map.initializeFromArray(overworld_1.MAP_PALET_TOWN);
    }
    move(x, y) {
        this.x += x;
        this.y += y;
    }
    moveTo(x, y) {
        this.x = x;
        this.y = y;
    }
    update(g) {
        if (this.map.tiles.length == 0 || this.drawQueue.size > 0) {
            return;
        }
        let count = 0;
        for (let row of this.map.tiles) {
            for (let tile of row) {
                if (tile.x >= this.x &&
                    tile.x < this.x + this.width &&
                    tile.y >= this.y &&
                    tile.y < this.y + this.height) {
                    tile.update(g);
                    this.drawQueue.push(tile);
                }
            }
            count++;
        }
        this.updateCount++;
    }
    draw(g) {
        while (this.drawQueue.isEmpty() === false) {
            this.drawQueue.pop().draw(g);
            //break;
        }
        //this.drawQueue.clear();
        console.log(this.updateCount + " update(s).");
        this.updateCount = 0;
    }
    resize(g) {
        this.width = (0, main_1.WIDTH)();
        this.height = (0, main_1.HEIGHT)();
    }
    joypadDown(key) {
        if (main_1.GAME_DATA.joypad.state.UP) {
            this.move(0, -main_1.GAME_DATA.tileHeight);
        }
        if (main_1.GAME_DATA.joypad.state.DOWN) {
            this.move(0, main_1.GAME_DATA.tileHeight);
        }
        if (main_1.GAME_DATA.joypad.state.LEFT) {
            this.move(-main_1.GAME_DATA.tileWidth, 0);
        }
        if (main_1.GAME_DATA.joypad.state.RIGHT) {
            this.move(main_1.GAME_DATA.tileWidth, 0);
        }
    }
    joypadUp(key) { }
}
exports.Camera = Camera;
