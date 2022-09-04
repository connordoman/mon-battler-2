import * as P5 from "p5";
import { ACTUAL_PIXEL_HEIGHT, GameData, GameObject, gPrint, HEIGHT, WIDTH } from "./main";
import { Rectangle, Vector } from "./geometry";
import { MapTile, MAP_PALET_TOWN, OverworldMap, TILE_PIXELS_Y } from "./states/overworld";
import { Queue } from "./queue";
import { JOYPAD } from "./joypad";
import { OverworldPlayer } from "./player";

export class Camera extends Rectangle implements GameObject {
    drawQueue: Queue<MapTile>;

    constructor(x: number, y: number) {
        super(x, y, WIDTH(), HEIGHT());
        this.drawQueue = new Queue();
    }

    move(x: number, y: number): void {
        this.x += x;
        this.y += y;
    }

    moveTo(x: number, y: number): void {
        this.x = x;
        this.y = y;
    }

    intersects(other: Rectangle): boolean {
        return (
            other.x >= this.x && other.x < this.x + this.width && other.y >= this.y && other.y < this.y + this.height
        );
    }

    update(g: GameData): void {}

    draw(g: GameData): void {
        // draw the tiles
        while (this.drawQueue.isEmpty() === false) {
            let tile = this.drawQueue.pop();
            gPrint(`drawing tile at: ${tile.position}`);
            //tile.position = new Vector(tile.x - this.offsetX, tile.y - this.offsetY);
            tile.draw(g);
        }
    }

    resize(g: GameData): void {
        this.width = WIDTH();
        this.height = HEIGHT();
    }

    joypadDown(g: GameData): void {}
    joypadUp(g: GameData): void {}
}
