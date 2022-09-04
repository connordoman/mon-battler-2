"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OverworldPlayer = void 0;
const main_1 = require("./main");
class OverworldPlayer {
    constructor() {
        this.tileX = 0;
        this.tileY = 0;
        this.targetTileX = this.tileX;
        this.targetTileY = this.tileY;
        this.walking = false;
    }
    offsetX() {
        return (0, main_1.WIDTH)() / 2;
    }
    offsetY(g) {
        return (0, main_1.HEIGHT)() / 2 + g.tileHeight / 2;
    }
    posX(g) {
        return this.tileX * g.tileWidth;
    }
    posY(g) {
        return this.tileY * g.tileHeight;
    }
    update(g) {
        if (this.walking) {
            if (this.tileX === this.targetTileX && this.tileY === this.targetTileY) {
                this.walking = false;
                (0, main_1.gPrint)(`Done walking`);
                return;
            }
            if (this.tileX < this.targetTileX) {
                this.tileX += g.tileWidth / 240;
                if (this.tileX > this.targetTileX) {
                    this.tileX = this.targetTileX;
                }
            }
            else if (this.tileX > this.targetTileX) {
                this.tileX -= g.tileWidth / 240;
                if (this.tileX < this.targetTileX) {
                    this.tileX = this.targetTileX;
                }
            }
            if (this.tileY < this.targetTileY) {
                this.tileY += g.tileHeight / 240;
                if (this.tileY > this.targetTileY) {
                    this.tileY = this.targetTileY;
                }
            }
            else if (this.tileY > this.targetTileY) {
                this.tileY -= g.tileHeight / 240;
                if (this.tileY < this.targetTileY) {
                    this.tileY = this.targetTileY;
                }
            }
        }
    }
    draw(g) {
        g.p.fill(255, 0, 0);
        g.p.circle(this.posX(g) + this.offsetX(), this.posY(g) + this.offsetY(g), g.tileWidth);
        g.p.square(this.posX(g), this.posY(g), g.tileWidth);
        if (main_1.DEBUG) {
            if (this.walking) {
                g.p.fill(200, 0, 0);
                g.p.square(this.posX(g), this.posY(g), g.tileWidth);
                g.p.fill(255, 255, 255, 1);
                g.p.textSize(g.tileHeight);
                g.p.textAlign(g.p.LEFT, g.p.TOP);
                g.p.text(`W`, this.posX(g), this.posY(g));
            }
        }
    }
    resize(g) { }
    joypadDown(g) {
        (0, main_1.gPrint)(`walking: ${this.walking}`);
        if (!this.walking) {
            if (g.joypad.state.UP) {
                this.targetTileY = this.tileY - 1;
            }
            else if (g.joypad.state.DOWN) {
                this.targetTileY = this.tileY + 1;
            }
            if (g.joypad.state.LEFT) {
                this.targetTileX = this.tileX - 1;
            }
            else if (g.joypad.state.RIGHT) {
                this.targetTileX = this.tileX + 1;
            }
            this.walking = this.targetTileX !== this.tileX || this.targetTileY !== this.tileY;
        }
        (0, main_1.gPrint)(`targetTileX: ${this.targetTileX}, targetTileY: ${this.targetTileY}`);
    }
    joypadUp(g) { }
}
exports.OverworldPlayer = OverworldPlayer;
