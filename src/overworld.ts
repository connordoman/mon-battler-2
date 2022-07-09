import * as P5 from "p5";
import { BaseState, State } from "./state";
import { StateMachine } from "./statemachine";
import * as Color from "./color";
import { FRAME_RATE, GameObject, PIXEL_HEIGHT, PIXEL_WIDTH } from "./main";

export const TILE_BLANK: string = "BLANK";
export const TILE_GRASS: string = "GRASS";
export const TILE_WATER: string = "WATER";
export const TILE_PIXELS_X: number = 16;
export const TILE_PIXELS_Y: number = 16;
export const TILE_WIDTH: number = TILE_PIXELS_X * PIXEL_WIDTH;
export const TILE_HEIGHT: number = TILE_PIXELS_Y * PIXEL_HEIGHT;

export class MapTile implements GameObject {
    mapX: number;
    mapY: number;
    tile: string;
    sprite: P5.Image;

    frames: P5.Image[];
    frameNum: number;
    animated: boolean;
    timer: number;

    constructor(mapX: number, mapY: number, tile: string) {
        this.mapX = mapX;
        this.mapY = mapY;
        this.tile = tile;
        this.sprite = new P5.Image(TILE_WIDTH, TILE_WIDTH);

        this.frames = [];
        this.frameNum = 0;
        this.animated = false;
        this.timer = 0;

        this.initalize();
    }

    initalize() {
        //this.sprite.loadPixels();
        for (let i = 0; i < TILE_PIXELS_X; i++) {
            for (let j = 0; j < TILE_PIXELS_Y; j++) {
                this.sprite.set(i, j, Color.MAGENTA);
            }
        }
    }

    addFrame(frame: P5.Image) {
        this.frames.push(frame);
    }

    update(g: P5): void {
        if (this.animated && this.timer % this.frameTime === 0 && this.frames.length > 1) {
            this.frameNum = (this.frameNum + 1) % this.frames.length;
            this.sprite = this.frames[this.frameNum];
        }

        this.timer++;
    }

    draw(g: P5): void {
        g.image(this.sprite, this.mapX * TILE_WIDTH, this.mapY * TILE_HEIGHT);
    }

    joypadDown(key: string): void {}

    joypadUp(key: string): void {}

    private get frameTime(): number {
        return Math.floor(FRAME_RATE / this.frames.length);
    }

    static get blankTile(): MapTile {
        let tile = new MapTile(0, 0, "blank");
        return tile;
    }

    static writeColorAtPixel(image: P5.Image, x: number, y: number, color: Color.Color) {
        for (let i = 0; i < PIXEL_WIDTH; i++) {
            for (let j = 0; j < PIXEL_HEIGHT; j++) {
                image.set(x * PIXEL_WIDTH + i, y * PIXEL_HEIGHT + j, color);
            }
        }
    }

    static checkeredTile(x: number, y: number): MapTile {
        let tile = new MapTile(x, y, "checkered");
        let image = new P5.Image(TILE_WIDTH, TILE_HEIGHT);
        for (let i = 0; i < TILE_PIXELS_X; i++) {
            for (let j = 0; j < TILE_PIXELS_Y; j++) {
                if (i % 2 === 0 && j % 2 === 0) {
                    MapTile.writeColorAtPixel(image, i, j, Color.BLACK);
                } else {
                    MapTile.writeColorAtPixel(image, i, j, Color.WHITE);
                }
            }
        }
        tile.sprite = image;
        return tile;
    }
}

export class OverworldMap implements GameObject {
    parent: StateMachine;
    width: number;
    height: number;
    tiles: MapTile[];

    constructor(parent: StateMachine, width: number, height: number) {
        this.parent = parent;
        this.width = width;
        this.height = height;
        this.tiles = [];
    }

    initialize() {
        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height; j++) {
                let index = i + j * this.width;
                this.tiles[index] = MapTile.blankTile;
            }
        }
    }

    update(g: P5): void {
        for (let tile of this.tiles) {
            tile.update(g);
        }
    }
    draw(g: P5): void {
        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height; j++) {
                if (i * TILE_WIDTH < g.width && j * TILE_HEIGHT < g.height) {
                    let index = i + j * this.width;
                    this.tiles[index].draw(g);
                }
            }
        }
    }
    joypadDown(key: string): void {}
    joypadUp(key: string): void {}
}

export class OverworldState extends BaseState {
    map: OverworldMap;

    constructor(parent: StateMachine, map: OverworldMap) {
        super(parent, "OverworldState");
        this.map = map;
    }

    update(g: P5): void {
        this.map.update(g);
    }
    draw(g: P5): void {
        g.background(0);
        this.map.draw(g);
    }
    joypadDown(key: string): void {}
    joypadUp(key: string): void {}
}
