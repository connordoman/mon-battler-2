import * as P5 from "p5";
import { GameObject, gPrint, HEIGHT, WIDTH } from "./main";
import { Rectangle } from "./geometry";
import { MapTile, MAP_PALET_TOWN, OverworldMap } from "./states/overworld";
import { Queue } from "./queue";

export class Camera extends Rectangle implements GameObject {
    offsetX: number;
    offsetY: number;

    map: OverworldMap;

    drawQueue: Queue<MapTile>;

    updateCount = 0;

    constructor(x: number, y: number) {
        super(x, y, WIDTH(), HEIGHT());
        this.offsetX = 0;
        this.offsetY = 0;
        this.map = new OverworldMap();
        this.drawQueue = new Queue();

        this.map.initializeFromArray(MAP_PALET_TOWN);
    }

    move(x: number, y: number): void {
        this.x += x;
        this.y += y;
    }

    moveTo(x: number, y: number): void {
        this.x = x;
        this.y = y;
    }

    update(g: P5): void {
        if (this.map.tiles.length == 0) {
            return;
        }

        for (let row of this.map.tiles) {
            for (let tile of row) {
                if (
                    tile.x >= this.x &&
                    tile.x < this.x + this.width &&
                    tile.y >= this.y &&
                    tile.y < this.y + this.height
                ) {
                    tile.update(g);
                    this.drawQueue.push(tile);
                }
            }
        }

        this.updateCount++;
    }
    draw(g: P5): void {
        gPrint(`Drawing ${this.drawQueue.size} tiles...`);
        while (this.drawQueue.isEmpty() === false) {
            this.drawQueue.pop().draw(g);
            //break;
        }
        gPrint(`${this.drawQueue.size} tiles remaining.`);
        this.drawQueue.clear();
        console.log(this.updateCount + " update(s).");
        this.updateCount = 0;
    }
    resize(g: P5): void {
        this.width = WIDTH();
        this.height = HEIGHT();
    }
    joypadDown(key: string): void {}
    joypadUp(key: string): void {}
}
