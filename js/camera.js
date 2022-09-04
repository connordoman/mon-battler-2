"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Camera = void 0;
const main_1 = require("./main");
const geometry_1 = require("./geometry");
const queue_1 = require("./queue");
class Camera extends geometry_1.Rectangle {
    constructor(x, y) {
        super(x, y, (0, main_1.WIDTH)(), (0, main_1.HEIGHT)());
        this.drawQueue = new queue_1.Queue();
    }
    move(x, y) {
        this.x += x;
        this.y += y;
    }
    moveTo(x, y) {
        this.x = x;
        this.y = y;
    }
    intersects(other) {
        return (other.x >= this.x && other.x < this.x + this.width && other.y >= this.y && other.y < this.y + this.height);
    }
    update(g) { }
    draw(g) {
        // draw the tiles
        while (this.drawQueue.isEmpty() === false) {
            let tile = this.drawQueue.pop();
            (0, main_1.gPrint)(`drawing tile at: ${tile.position}`);
            //tile.position = new Vector(tile.x - this.offsetX, tile.y - this.offsetY);
            tile.draw(g);
        }
    }
    resize(g) {
        this.width = (0, main_1.WIDTH)();
        this.height = (0, main_1.HEIGHT)();
    }
    joypadDown(g) { }
    joypadUp(g) { }
}
exports.Camera = Camera;
