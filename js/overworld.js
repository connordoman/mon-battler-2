"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OverworldState = exports.OverworldMap = exports.MapTile = exports.TILE_HEIGHT = exports.TILE_WIDTH = exports.TILE_PIXELS_Y = exports.TILE_PIXELS_X = exports.TILE_WATER = exports.TILE_GRASS = exports.TILE_BLANK = void 0;
const P5 = require("p5");
const state_1 = require("./state");
const Color = require("./color");
const main_1 = require("./main");
exports.TILE_BLANK = "BLANK";
exports.TILE_GRASS = "GRASS";
exports.TILE_WATER = "WATER";
exports.TILE_PIXELS_X = 16;
exports.TILE_PIXELS_Y = 16;
exports.TILE_WIDTH = exports.TILE_PIXELS_X * main_1.PIXEL_WIDTH;
exports.TILE_HEIGHT = exports.TILE_PIXELS_Y * main_1.PIXEL_HEIGHT;
class MapTile {
    constructor(mapX, mapY, tile) {
        this.mapX = mapX;
        this.mapY = mapY;
        this.tile = tile;
        this.sprite = new P5.Image(exports.TILE_WIDTH, exports.TILE_WIDTH);
        this.frames = [];
        this.frameNum = 0;
        this.animated = false;
        this.timer = 0;
        this.initalize();
    }
    initalize() {
        //this.sprite.loadPixels();
        for (let i = 0; i < exports.TILE_PIXELS_X; i++) {
            for (let j = 0; j < exports.TILE_PIXELS_Y; j++) {
                this.sprite.set(i, j, Color.MAGENTA);
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
        g.image(this.sprite, this.mapX * exports.TILE_WIDTH, this.mapY * exports.TILE_HEIGHT);
    }
    joypadDown(key) { }
    joypadUp(key) { }
    get frameTime() {
        return Math.floor(main_1.FRAME_RATE / this.frames.length);
    }
    static get blankTile() {
        let tile = new MapTile(0, 0, "blank");
        return tile;
    }
    static writeColorAtPixel(image, x, y, color) {
        for (let i = 0; i < main_1.PIXEL_WIDTH; i++) {
            for (let j = 0; j < main_1.PIXEL_HEIGHT; j++) {
                image.set(x * main_1.PIXEL_WIDTH + i, y * main_1.PIXEL_HEIGHT + j, color);
            }
        }
    }
    static checkeredTile(x, y) {
        let tile = new MapTile(x, y, "checkered");
        let image = new P5.Image(exports.TILE_WIDTH, exports.TILE_HEIGHT);
        for (let i = 0; i < exports.TILE_PIXELS_X; i++) {
            for (let j = 0; j < exports.TILE_PIXELS_Y; j++) {
                if (i % 2 === 0 && j % 2 === 0) {
                    MapTile.writeColorAtPixel(image, i, j, Color.BLACK);
                }
                else {
                    MapTile.writeColorAtPixel(image, i, j, Color.WHITE);
                }
            }
        }
        tile.sprite = image;
        return tile;
    }
}
exports.MapTile = MapTile;
class OverworldMap {
    constructor(parent, width, height) {
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
    update(g) {
        for (let tile of this.tiles) {
            tile.update(g);
        }
    }
    draw(g) {
        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height; j++) {
                if (i * exports.TILE_WIDTH < g.width && j * exports.TILE_HEIGHT < g.height) {
                    let index = i + j * this.width;
                    this.tiles[index].draw(g);
                }
            }
        }
    }
    joypadDown(key) { }
    joypadUp(key) { }
}
exports.OverworldMap = OverworldMap;
class OverworldState extends state_1.BaseState {
    constructor(parent, map) {
        super(parent, "OverworldState");
        this.map = map;
    }
    update(g) {
        this.map.update(g);
    }
    draw(g) {
        g.background(0);
        this.map.draw(g);
    }
    joypadDown(key) { }
    joypadUp(key) { }
}
exports.OverworldState = OverworldState;
