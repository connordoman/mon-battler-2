"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OverworldState = exports.OverworldMap = exports.MapTile = exports.MAP_PALET_TOWN = exports.TILE_PIXELS_Y = exports.TILE_PIXELS_X = exports.TILE_SHRUB = exports.TILE_STONE = exports.TILE_SAND = exports.TILE_WATER = exports.TILE_GRASS = exports.TILE_BLANK = void 0;
const P5 = require("p5");
const state_1 = require("./state");
const Color = require("../color");
const main_1 = require("../main");
const camera_1 = require("../camera");
exports.TILE_BLANK = 0;
exports.TILE_GRASS = 1;
exports.TILE_WATER = 2;
exports.TILE_SAND = 3;
exports.TILE_STONE = 4;
exports.TILE_SHRUB = 5;
exports.TILE_PIXELS_X = 16;
exports.TILE_PIXELS_Y = 16;
exports.MAP_PALET_TOWN = [
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
class MapTile {
    constructor(mapX, mapY, tile) {
        this.mapX = mapX;
        this.mapY = mapY;
        this.x = mapX * main_1.GAME_DATA.tileWidth;
        this.y = mapY * main_1.GAME_DATA.tileHeight;
        this.tile = tile;
        this.sprite = new P5.Image(main_1.GAME_DATA.tileWidth, main_1.GAME_DATA.tileHeight);
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
    addFrame(frame) {
        this.frames.push(frame);
    }
    update(g) {
        if (this.animated && this.timer % this.frameTime === 0 && this.frames.length > 1) {
            this.frameNum = (this.frameNum + 1) % this.frames.length;
            this.sprite = this.frames[this.frameNum];
        }
        this.timer++;
    }
    draw(g) {
        switch (this.tile) {
            case exports.TILE_GRASS:
                g.fill(Color.DARK_GREEN);
                g.rect(this.x, this.y, main_1.GAME_DATA.tileWidth, main_1.GAME_DATA.tileHeight);
                break;
            case exports.TILE_SHRUB:
                g.fill(Color.DARK_GREEN);
                g.rect(this.x, this.y, main_1.GAME_DATA.tileWidth, main_1.GAME_DATA.tileHeight);
                g.fill(Color.BROWN);
                g.circle(this.x + main_1.GAME_DATA.tileWidth / 2, this.y + main_1.GAME_DATA.tileHeight / 2, main_1.GAME_DATA.tileWidth / 2);
            case exports.TILE_WATER:
                g.fill(Color.BLUE);
                g.rect(this.x, this.y, main_1.GAME_DATA.tileWidth, main_1.GAME_DATA.tileHeight);
                break;
            default:
                break;
        }
    }
    resize(g) { }
    joypadDown() { }
    joypadUp() { }
    get frameTime() {
        return Math.floor(main_1.GAME_DATA.frameRate / this.frames.length);
    }
    static get blankTile() {
        let tile = new MapTile(0, 0, exports.TILE_BLANK);
        return tile;
    }
    toString() {
        switch (this.tile) {
            case exports.TILE_GRASS:
                return "GRASS";
            case exports.TILE_WATER:
                return "WATER";
            case exports.TILE_SAND:
                return "SAND";
            case exports.TILE_STONE:
                return "STONE";
            case exports.TILE_SHRUB:
                return "SHRUB";
            default:
                return "BLANK";
        }
    }
}
exports.MapTile = MapTile;
class OverworldMap {
    constructor(width, height) {
        if (width === undefined) {
            this.tilesX = 15;
        }
        else {
            this.tilesX = width;
        }
        if (height === undefined) {
            this.tilesY = 11;
        }
        else {
            this.tilesY = height;
        }
        this.tiles = [];
    }
    initialize() {
        for (let i = 0; i < this.tilesX; i++) {
            for (let j = 0; j < this.tilesY; j++) {
                this.tiles[i][j] = MapTile.blankTile;
            }
        }
    }
    initializeFromArray(mapData) {
        let maxWidth = 0;
        let row = [];
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
    tileAt(x, y) {
        return this.tiles[x][y];
    }
}
exports.OverworldMap = OverworldMap;
class OverworldState extends state_1.BaseState {
    constructor(map) {
        super();
        this.name = "OverworldState";
        this.map = map;
        this.camera = new camera_1.Camera(0, 0);
    }
    update(g) {
        this.camera.update(g);
    }
    draw(g) {
        g.background(0);
        this.camera.draw(g);
    }
    resize(g) {
        this.camera.resize(g);
    }
    joypadDown() { }
    joypadUp() { }
}
exports.OverworldState = OverworldState;
