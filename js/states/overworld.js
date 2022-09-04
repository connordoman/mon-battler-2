"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OverworldState = exports.OverworldMap = exports.MapTile = exports.MAP_PALET_TOWN = exports.TILE_PIXELS_Y = exports.TILE_PIXELS_X = exports.TILE_SHRUB = exports.TILE_STONE = exports.TILE_SAND = exports.TILE_WATER = exports.TILE_GRASS = exports.TILE_BLANK = void 0;
const P5 = require("p5");
const state_1 = require("./state");
const Color = require("../color");
const main_1 = require("../main");
const geometry_1 = require("../geometry");
const player_1 = require("../player");
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
class MapTile extends geometry_1.Rectangle {
    constructor(g, tilesX, tilesY, tile) {
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
    addFrame(frame) {
        this.frames.push(frame);
    }
    update(g) {
        if (this.animated && this.timer % this.frameTime(g) === 0 && this.frames.length > 1) {
            this.frameNum = (this.frameNum + 1) % this.frames.length;
            this.sprite = this.frames[this.frameNum];
        }
        this.timer++;
    }
    draw(g) {
        switch (this.tile) {
            case exports.TILE_GRASS:
                g.p.fill(Color.DARK_GREEN);
                g.p.rect(this.x, this.y, g.tileWidth, g.tileHeight);
                break;
            case exports.TILE_SHRUB:
                g.p.fill(Color.DARK_GREEN);
                g.p.rect(this.x, this.y, g.tileWidth, g.tileHeight);
                g.p.fill(Color.BROWN);
                g.p.circle(this.x + g.tileWidth / 2, this.y + g.tileHeight / 2, g.tileWidth / 2);
            case exports.TILE_WATER:
                g.p.fill(Color.BLUE);
                g.p.rect(this.x, this.y, g.tileWidth, g.tileHeight);
                break;
            default:
                break;
        }
    }
    resize(g) {
        this.resizeAndReposition();
    }
    joypadDown() { }
    joypadUp() { }
    frameTime(g) {
        return Math.floor(g.frameRate / this.frames.length);
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
    initializeFromArray(g, mapData) {
        let maxWidth = 0;
        let row = [];
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
    tileAt(x, y) {
        return this.tiles[x][y];
    }
}
exports.OverworldMap = OverworldMap;
class OverworldState extends state_1.BaseState {
    constructor(map) {
        super();
        this.name = "OverworldState";
        this.player = new player_1.OverworldPlayer();
        if (map === undefined) {
            this.map = new OverworldMap();
        }
        else {
            this.map = map;
        }
    }
    init(g) { }
    update(g) {
        this.player.update(g);
        g.camera.update(g);
        // establish map tiles
        if (this.map.tiles.length == 0 || g.camera.drawQueue.size > 0) {
            return;
        }
        for (let row of this.map.tiles) {
            for (let tile of row) {
                let intersects = g.camera.intersects(tile);
                (0, main_1.gPrint)(`${intersects}`);
                if (intersects) {
                    tile.update(g);
                    g.camera.drawQueue.push(tile);
                }
            }
        }
    }
    draw(g) {
        g.p.background(0);
        this.player.draw(g);
        g.camera.draw(g);
    }
    resize(g) {
        g.camera.resize(g);
        this.player.resize(g);
    }
    joypadDown(g) {
        this.player.joypadDown(g);
    }
    joypadUp(g) {
        this.player.joypadUp(g);
    }
}
exports.OverworldState = OverworldState;
