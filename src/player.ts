import * as P5 from "p5";
import { DEBUG, GameData, GameObject, gPrint, HEIGHT, WIDTH } from "./main";

export class OverworldPlayer implements GameObject {
    tileX: number;
    tileY: number;

    targetTileX: number;
    targetTileY: number;

    walking: boolean;

    constructor() {
        this.tileX = 0;
        this.tileY = 0;
        this.targetTileX = this.tileX;
        this.targetTileY = this.tileY;
        this.walking = false;
    }

    offsetX(): number {
        return WIDTH() / 2;
    }

    offsetY(g: GameData): number {
        return HEIGHT() / 2 + g.tileHeight / 2;
    }

    posX(g: GameData): number {
        return this.tileX * g.tileWidth;
    }

    posY(g: GameData): number {
        return this.tileY * g.tileHeight;
    }

    update(g: GameData): void {
        if (this.walking) {
            if (this.tileX === this.targetTileX && this.tileY === this.targetTileY) {
                this.walking = false;
                gPrint(`Done walking`);
                return;
            }

            if (this.tileX < this.targetTileX) {
                this.tileX += g.tileWidth / 240;
                if (this.tileX > this.targetTileX) {
                    this.tileX = this.targetTileX;
                }
            } else if (this.tileX > this.targetTileX) {
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
            } else if (this.tileY > this.targetTileY) {
                this.tileY -= g.tileHeight / 240;
                if (this.tileY < this.targetTileY) {
                    this.tileY = this.targetTileY;
                }
            }
        }
    }

    draw(g: GameData): void {
        g.p.fill(255, 0, 0);
        g.p.circle(this.posX(g) + this.offsetX(), this.posY(g) + this.offsetY(g), g.tileWidth);
        g.p.square(this.posX(g), this.posY(g), g.tileWidth);

        if (DEBUG) {
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

    resize(g: GameData): void {}

    joypadDown(g: GameData): void {
        gPrint(`walking: ${this.walking}`);
        if (!this.walking) {
            if (g.joypad.state.UP) {
                this.targetTileY = this.tileY - 1;
            } else if (g.joypad.state.DOWN) {
                this.targetTileY = this.tileY + 1;
            }
            if (g.joypad.state.LEFT) {
                this.targetTileX = this.tileX - 1;
            } else if (g.joypad.state.RIGHT) {
                this.targetTileX = this.tileX + 1;
            }

            this.walking = this.targetTileX !== this.tileX || this.targetTileY !== this.tileY;
        }
        gPrint(`targetTileX: ${this.targetTileX}, targetTileY: ${this.targetTileY}`);
    }

    joypadUp(g: GameData): void {}
}
