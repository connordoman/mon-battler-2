import * as P5 from "p5";
import { BaseState } from "./state";
import * as Color from "../color";
import { GameObject, pixelHeight, pixelWidth, gPrint, GameData } from "../main";
import { Camera } from "../camera";
import { Rectangle } from "../geometry";
import { Queue } from "../queue";
import { OverworldPlayer } from "../player";

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

export class MapTile extends Rectangle implements GameObject {
    tileX: number;
    tileY: number;
    tile: number;
    sprite: P5.Image;

    frames: P5.Image[];
    frameNum: number;
    animated: boolean;
    timer: number;

    constructor(g: GameData, tilesX: number, tilesY: number, tile: number) {
        super(tilesX * g.tileWidth, tilesY * g.tileHeight, g.tileWidth, g.tileHeight);
        this.tileX = tilesX;
        this.tileY = tilesY;
        this.tile = tile;
        this.sprite = new P5.Image(g.tileWidth, g.tileHeight);

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

    update(g: GameData): void {
        if (this.animated && this.timer % this.frameTime(g) === 0 && this.frames.length > 1) {
            this.frameNum = (this.frameNum + 1) % this.frames.length;
            this.sprite = this.frames[this.frameNum];
        }

        this.timer++;
    }

    draw(g: GameData): void {
        switch (this.tile) {
            case TILE_GRASS:
                g.p.fill(Color.DARK_GREEN);
                g.p.rect(this.x, this.y, g.tileWidth, g.tileHeight);
                break;
            case TILE_SHRUB:
                g.p.fill(Color.DARK_GREEN);
                g.p.rect(this.x, this.y, g.tileWidth, g.tileHeight);
                g.p.fill(Color.BROWN);
                g.p.circle(this.x + g.tileWidth / 2, this.y + g.tileHeight / 2, g.tileWidth / 2);
            case TILE_WATER:
                g.p.fill(Color.BLUE);
                g.p.rect(this.x, this.y, g.tileWidth, g.tileHeight);
                break;
            default:
                break;
        }
    }
    resize(g: GameData): void {
        this.resizeAndReposition();
    }

    joypadDown(): void {}

    joypadUp(): void {}

    private frameTime(g: GameData): number {
        return Math.floor(g.frameRate / this.frames.length);
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

    initializeFromArray(g: GameData, mapData: number[][]): void {
        let maxWidth = 0;
        let row: MapTile[] = [];
        for (let i = 0; i < mapData.length; i++) {
            row = [];
            if (mapData[i].length > maxWidth) {
                maxWidth = mapData[i].length;
            }
            for (let j = 0; j < mapData[i].length; j++) {
                let tile = new MapTile(g, j, i, mapData[i][j]);
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
    player: OverworldPlayer;

    constructor(map?: OverworldMap) {
        super();
        this.name = "OverworldState";
        this.player = new OverworldPlayer();

        if (map === undefined) {
            this.map = new OverworldMap();
        } else {
            this.map = map;
        }
    }

    init(g: GameData) {}

    update(g: GameData): void {
        this.player.update(g);
        g.camera.update(g);

        // establish map tiles
        if (this.map.tiles.length == 0 || g.camera.drawQueue.size > 0) {
            return;
        }

        for (let row of this.map.tiles) {
            for (let tile of row) {
                let intersects = g.camera.intersects(tile);
                gPrint(`${intersects}`);
                if (intersects) {
                    tile.update(g);
                    g.camera.drawQueue.push(tile);
                }
            }
        }
    }
    draw(g: GameData): void {
        g.p.background(0);
        this.player.draw(g);
        g.camera.draw(g);
    }
    resize(g: GameData): void {
        g.camera.resize(g);
        this.player.resize(g);
    }
    joypadDown(g: GameData): void {
        this.player.joypadDown(g);
    }
    joypadUp(g: GameData): void {
        this.player.joypadUp(g);
    }
}
