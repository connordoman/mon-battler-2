import * as P5 from "p5";
import { BaseState } from "./state";
import * as Color from "../color";
import { GAME_DATA, GameObject, pixelHeight, pixelWidth } from "../main";

export const TILE_BLANK: string = "BLANK";
export const TILE_GRASS: string = "GRASS";
export const TILE_WATER: string = "WATER";
export const TILE_PIXELS_X: number = 16;
export const TILE_PIXELS_Y: number = 16;

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
        this.sprite = new P5.Image(GAME_DATA.tileWidth, GAME_DATA.tileHeight);

        this.frames = [];
        this.frameNum = 0;
        this.animated = false;
        this.timer = 0;
    }

    initialize() {
        this.sprite.loadPixels();

        for (let i = 0; i < TILE_PIXELS_X; i += pixelWidth) {
            for (let j = 0; j < TILE_PIXELS_Y; j += pixelHeight) {
                MapTile.setPixelAt(this.sprite, i, j, Color.BLACK);
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
        g.image(this.sprite, this.mapX * GAME_DATA.tileWidth, this.mapY * GAME_DATA.tileHeight);
    }
    resize(g: P5): void {}

    joypadDown(): void {}

    joypadUp(): void {}

    private get frameTime(): number {
        return Math.floor(GAME_DATA.frameRate / this.frames.length);
    }

    static get blankTile(): MapTile {
        let tile = new MapTile(0, 0, "blank");
        return tile;
    }

    static setPixelAt(image: P5.Image, x: number, y: number, color: Color.Color) {
        for (let i = 0; i < pixelWidth; i++) {
            for (let j = 0; j < pixelHeight; j++) {
                let index = (x * pixelWidth + i + (y * pixelHeight + j) * TILE_PIXELS_X) * 4;
                image.pixels[index] = color[0];
                image.pixels[index + 1] = color[1];
                image.pixels[index + 2] = color[2];
                image.pixels[index + 3] = color[3];
            }
        }
    }

    static checkeredTile(x: number, y: number): MapTile {
        let tile = new MapTile(x, y, "checkered");
        let image = new P5.Image(GAME_DATA.tileWidth, GAME_DATA.tileHeight);
        for (let i = 0; i < TILE_PIXELS_X; i += pixelWidth) {
            for (let j = 0; j < TILE_PIXELS_Y; j += pixelHeight) {
                let index = (i + j * TILE_PIXELS_X) * 4;
                if (index % 2 === 0) {
                    MapTile.setPixelAt(image, i, j, Color.BLACK);
                } else {
                    MapTile.setPixelAt(image, i, j, Color.WHITE);
                }
            }
        }
        tile.sprite = image;
        return tile;
    }
}

export class OverworldMap implements GameObject {
    tilesX: number;
    tilesY: number;
    tiles: MapTile[];

    constructor(width?: number, height?: number) {
        if (width === undefined) {
            this.tilesX = 15;
        } else {
            this.tilesX = width;
        }
        if (height === undefined) {
            this.tilesY = 11;
        } else {
            this.tilesY = height;
        }

        this.tiles = [];
    }

    initialize(): void {
        for (let i = 0; i < this.tilesX; i++) {
            for (let j = 0; j < this.tilesY; j++) {
                let index = i + j * this.tilesX;
                this.tiles[index] = MapTile.blankTile;
            }
        }
    }

    initializedWithCheckeredTiles(): void {
        for (let i = 0; i < this.tilesX; i++) {
            for (let j = 0; j < this.tilesY; j++) {
                let index = i + j * this.tilesX;
                this.tiles[index] = MapTile.checkeredTile(i, j);
            }
        }
    }

    update(g: P5): void {
        for (let tile of this.tiles) {
            tile.update(g);
        }
    }

    draw(g: P5): void {
        for (let i = 0; i < this.tilesX; i++) {
            for (let j = 0; j < this.tilesY; j++) {
                if (i * GAME_DATA.tileWidth < g.width && j * GAME_DATA.tileHeight < g.height) {
                    let index = i + j * this.tilesX;
                    this.tiles[index].draw(g);
                }
            }
        }
    }

    resize(g: P5): void {}

    joypadDown(): void {}
    joypadUp(): void {}
}

export class OverworldState extends BaseState {
    name: string;
    map: OverworldMap;

    constructor(map: OverworldMap) {
        super();
        this.name = "OverworldState";
        this.map = map;
    }

    update(g: P5): void {
        this.map.update(g);
    }
    draw(g: P5): void {
        g.background(0);
        this.map.draw(g);
    }
    resize(g: P5): void {}
    joypadDown(): void {}
    joypadUp(): void {}
}
