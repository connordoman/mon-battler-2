import * as P5 from "p5";
import { BaseState } from "./state";
import * as Color from "../color";
import { GAME_DATA, GameObject, pixelHeight, pixelWidth, gPrint } from "../main";
import { Camera } from "../camera";

export const TILE_BLANK: number = 0;
export const TILE_GRASS: number = 1;
export const TILE_WATER: number = 2;
export const TILE_SAND: number = 3;
export const TILE_STONE: number = 4;
export const TILE_SHRUB: number = 5;
export const TILE_PIXELS_X: number = 16;
export const TILE_PIXELS_Y: number = 16;

export const MAP_PALET_TOWN: number[][] = [
    [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
    [5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 5],
    [5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 5],
    [5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 5],
    [5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 5],
    [5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 5],
    [5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 5],
    [5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 5],
    [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
];

export class MapTile implements GameObject {
    x: number;
    y: number;
    mapX: number;
    mapY: number;
    tile: number;
    sprite: P5.Image;

    frames: P5.Image[];
    frameNum: number;
    animated: boolean;
    timer: number;

    constructor(mapX: number, mapY: number, tile: number) {
        this.mapX = mapX;
        this.mapY = mapY;
        this.x = mapX * GAME_DATA.tileWidth;
        this.y = mapY * GAME_DATA.tileHeight;
        this.tile = tile;
        this.sprite = new P5.Image(GAME_DATA.tileWidth, GAME_DATA.tileHeight);

        this.frames = [];
        this.frameNum = 0;
        this.animated = false;
        this.timer = 0;
    }

    initialize() {
        /*this.sprite.loadPixels();

        for (let i = 0; i < TILE_PIXELS_X; i += pixelWidth) {
            for (let j = 0; j < TILE_PIXELS_Y; j += pixelHeight) {
                MapTile.setPixelAt(this.sprite, i, j, Color.BLACK);
            }
        }*/
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
        switch (this.tile) {
            case TILE_GRASS:
                g.fill(Color.DARK_GREEN);
                g.rect(this.x, this.y, GAME_DATA.tileWidth, GAME_DATA.tileHeight);
                break;
            case TILE_SHRUB:
                g.fill(Color.DARK_GREEN);
                g.rect(this.x, this.y, GAME_DATA.tileWidth, GAME_DATA.tileHeight);
                g.fill(Color.BROWN);
                g.circle(this.x + GAME_DATA.tileWidth / 2, this.y + GAME_DATA.tileHeight / 2, GAME_DATA.tileWidth / 2);
            case TILE_WATER:
                g.fill(Color.BLUE);
                g.rect(this.x, this.y, GAME_DATA.tileWidth, GAME_DATA.tileHeight);
                break;
            default:
                break;
        }
    }
    resize(g: P5): void {}

    joypadDown(): void {}

    joypadUp(): void {}

    private get frameTime(): number {
        return Math.floor(GAME_DATA.frameRate / this.frames.length);
    }

    static get blankTile(): MapTile {
        let tile = new MapTile(0, 0, TILE_BLANK);
        return tile;
    }

    toString(): string {
        switch (this.tile) {
            case TILE_GRASS:
                return "GRASS";
            case TILE_WATER:
                return "WATER";
            case TILE_SAND:
                return "SAND";
            case TILE_STONE:
                return "STONE";
            case TILE_SHRUB:
                return "SHRUB";
            default:
                return "BLANK";
        }
    }
}

export class OverworldMap {
    tilesX: number;
    tilesY: number;
    tiles: MapTile[][];

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
                this.tiles[i][j] = MapTile.blankTile;
            }
        }
    }

    initializeFromArray(mapData: number[][]): void {
        let maxWidth = 0;
        let row: MapTile[] = [];
        for (let i = 0; i < mapData.length; i++) {
            row = [];
            if (mapData[i].length > maxWidth) {
                maxWidth = mapData[i].length;
            }
            for (let j = 0; j < mapData[i].length; j++) {
                let tile = new MapTile(j, i, mapData[i][j]);
                row.push(tile);
            }
            this.tiles.push(row);
        }
        this.tilesX = maxWidth;
        this.tilesY = mapData.length;
    }

    tileAt(x: number, y: number): MapTile {
        return this.tiles[x][y];
    }
}

export class OverworldState extends BaseState {
    name: string;
    map: OverworldMap;
    camera: Camera;

    constructor(map: OverworldMap) {
        super();
        this.name = "OverworldState";
        this.map = map;
        this.camera = new Camera(0, 0);
    }

    update(g: P5): void {
        this.camera.update(g);
    }
    draw(g: P5): void {
        g.background(0);
        this.camera.draw(g);
    }
    resize(g: P5): void {
        this.camera.resize(g);
    }
    joypadDown(): void {}
    joypadUp(): void {}
}
