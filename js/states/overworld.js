"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OverworldState = exports.OverworldMap = exports.MapTile = exports.TILE_PIXELS_Y = exports.TILE_PIXELS_X = exports.TILE_WATER = exports.TILE_GRASS = exports.TILE_BLANK = void 0;
const P5 = require("p5");
const state_1 = require("./state");
const Color = require("../color");
const main_1 = require("../main");
exports.TILE_BLANK = "BLANK";
exports.TILE_GRASS = "GRASS";
exports.TILE_WATER = "WATER";
exports.TILE_PIXELS_X = 16;
exports.TILE_PIXELS_Y = 16;
class MapTile {
    constructor(mapX, mapY, tile) {
        this.mapX = mapX;
        this.mapY = mapY;
        this.tile = tile;
        this.sprite = new P5.Image(main_1.GAME_DATA.tileWidth, main_1.GAME_DATA.tileHeight);
        this.frames = [];
        this.frameNum = 0;
        this.animated = false;
        this.timer = 0;
    }
    initialize() {
        this.sprite.loadPixels();
        for (let i = 0; i < exports.TILE_PIXELS_X; i += main_1.pixelWidth) {
            for (let j = 0; j < exports.TILE_PIXELS_Y; j += main_1.pixelHeight) {
                MapTile.setPixelAt(this.sprite, i, j, Color.BLACK);
            }
        }
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
        g.image(this.sprite, this.mapX * main_1.GAME_DATA.tileWidth, this.mapY * main_1.GAME_DATA.tileHeight);
    }
    resize(g) { }
    joypadDown() { }
    joypadUp() { }
    get frameTime() {
        return Math.floor(main_1.GAME_DATA.frameRate / this.frames.length);
    }
    static get blankTile() {
        let tile = new MapTile(0, 0, "blank");
        return tile;
    }
    static setPixelAt(image, x, y, color) {
        for (let i = 0; i < main_1.pixelWidth; i++) {
            for (let j = 0; j < main_1.pixelHeight; j++) {
                let index = (x * main_1.pixelWidth + i + (y * main_1.pixelHeight + j) * exports.TILE_PIXELS_X) * 4;
                image.pixels[index] = color[0];
                image.pixels[index + 1] = color[1];
                image.pixels[index + 2] = color[2];
                image.pixels[index + 3] = color[3];
            }
        }
    }
    static checkeredTile(x, y) {
        let tile = new MapTile(x, y, "checkered");
        let image = new P5.Image(main_1.GAME_DATA.tileWidth, main_1.GAME_DATA.tileHeight);
        for (let i = 0; i < exports.TILE_PIXELS_X; i += main_1.pixelWidth) {
            for (let j = 0; j < exports.TILE_PIXELS_Y; j += main_1.pixelHeight) {
                let index = (i + j * exports.TILE_PIXELS_X) * 4;
                if (index % 2 === 0) {
                    MapTile.setPixelAt(image, i, j, Color.BLACK);
                }
                else {
                    MapTile.setPixelAt(image, i, j, Color.WHITE);
                }
            }
        }
        tile.sprite = image;
        return tile;
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
                let index = i + j * this.tilesX;
                this.tiles[index] = MapTile.blankTile;
            }
        }
    }
    initializedWithCheckeredTiles() {
        for (let i = 0; i < this.tilesX; i++) {
            for (let j = 0; j < this.tilesY; j++) {
                let index = i + j * this.tilesX;
                this.tiles[index] = MapTile.checkeredTile(i, j);
            }
        }
    }
    update(g) {
        for (let tile of this.tiles) {
            tile.update(g);
        }
    }
    draw(g) {
        for (let i = 0; i < this.tilesX; i++) {
            for (let j = 0; j < this.tilesY; j++) {
                if (i * main_1.GAME_DATA.tileWidth < g.width && j * main_1.GAME_DATA.tileHeight < g.height) {
                    let index = i + j * this.tilesX;
                    this.tiles[index].draw(g);
                }
            }
        }
    }
    resize(g) { }
    joypadDown() { }
    joypadUp() { }
}
exports.OverworldMap = OverworldMap;
class OverworldState extends state_1.BaseState {
    constructor(map) {
        super();
        this.name = "OverworldState";
        this.map = map;
    }
    update(g) {
        this.map.update(g);
    }
    draw(g) {
        g.background(0);
        this.map.draw(g);
    }
    resize(g) { }
    joypadDown() { }
    joypadUp() { }
}
exports.OverworldState = OverworldState;
