"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MONSTER_BATTLER_2 = exports.gGetPixelsFromRem = exports.gPrint = exports.GameData = exports.HEIGHT = exports.WIDTH = exports.ACTUAL_PIXEL_HEIGHT = exports.ACTUAL_PIXEL_WIDTH = exports.pixelHeight = exports.pixelWidth = exports.gOrientationStr = exports.ORIENTATION_DESKTOP = exports.ORIENTATION_LANDSCAPE = exports.ORIENTATION_PORTRAIT = exports.GAME_HEIGHT = exports.GAME_WIDTH = exports.MAX_PIXEL = exports.DEBUG = void 0;
const P5 = require("p5");
const statemachine_1 = require("./statemachine");
const Color = require("./color");
const overworld_1 = require("./states/overworld");
const joypad_1 = require("./joypad");
const camera_1 = require("./camera");
exports.DEBUG = true;
exports.MAX_PIXEL = 2;
exports.GAME_WIDTH = 240;
exports.GAME_HEIGHT = 160;
exports.ORIENTATION_PORTRAIT = 0;
exports.ORIENTATION_LANDSCAPE = 1;
exports.ORIENTATION_DESKTOP = 2;
function gOrientationStr(orientation) {
    switch (orientation) {
        case exports.ORIENTATION_PORTRAIT:
            return "portrait";
        case exports.ORIENTATION_LANDSCAPE:
            return "landscape";
        case exports.ORIENTATION_DESKTOP:
            return "desktop";
        default:
            return "unknown";
    }
}
exports.gOrientationStr = gOrientationStr;
exports.pixelWidth = exports.MAX_PIXEL;
exports.pixelHeight = exports.MAX_PIXEL;
const ACTUAL_PIXEL_WIDTH = (pixels) => {
    if (pixels) {
        return pixels * exports.pixelWidth;
    }
    return exports.GAME_WIDTH * exports.pixelWidth;
};
exports.ACTUAL_PIXEL_WIDTH = ACTUAL_PIXEL_WIDTH;
const ACTUAL_PIXEL_HEIGHT = (pixels) => {
    if (pixels) {
        return pixels * exports.pixelHeight;
    }
    return exports.GAME_HEIGHT * exports.pixelHeight;
};
exports.ACTUAL_PIXEL_HEIGHT = ACTUAL_PIXEL_HEIGHT;
const WIDTH = () => (0, exports.ACTUAL_PIXEL_WIDTH)();
exports.WIDTH = WIDTH;
const HEIGHT = () => (0, exports.ACTUAL_PIXEL_HEIGHT)();
exports.HEIGHT = HEIGHT;
class GameData {
    constructor(p, canv, map, stateMachine, joypad) {
        this.p = p;
        this.canv = canv;
        this.map = map;
        this.camera = new camera_1.Camera(0, 0);
        this.stateMachine = stateMachine;
        this.joypad = joypad;
        this.key = "";
        this.keyCode = 0;
        this.tileWidth = exports.pixelWidth * 16;
        this.tileHeight = exports.pixelWidth * 16;
        this.textSize = exports.pixelHeight * 10;
        this.frameRate = 60;
        this.orientation = exports.ORIENTATION_PORTRAIT;
    }
    reloadGameData() { }
    getKeyString() {
        let k;
        switch (this.keyCode) {
            case joypad_1.ASCII_KEYS.escape:
                k = "ESCAPE";
                break;
            case joypad_1.ASCII_KEYS.enter:
                k = "ENTER";
                break;
            case joypad_1.ASCII_KEYS.backspace:
                k = "BACKSPACE";
                break;
            case joypad_1.ASCII_KEYS.delete:
                k = "DELETE";
                break;
            case joypad_1.ASCII_KEYS.up:
                k = "UP";
                break;
            case joypad_1.ASCII_KEYS.down:
                k = "DOWN";
                break;
            case joypad_1.ASCII_KEYS.left:
                k = "LEFT";
                break;
            case joypad_1.ASCII_KEYS.right:
                k = "RIGHT";
                break;
            default:
                k = this.key;
        }
        return `${k}, ${this.keyCode}`;
    }
}
exports.GameData = GameData;
// debug print function
function gPrint(...args) {
    if (exports.DEBUG) {
        console.log(...args);
    }
}
exports.gPrint = gPrint;
// get pixels from css rem units
function gGetPixelsFromRem(rem) {
    return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
}
exports.gGetPixelsFromRem = gGetPixelsFromRem;
// main p5 logic
const MONSTER_BATTLER_2 = (p5) => {
    let keyTimer = 0;
    let g;
    let debugFrameRate;
    let reloadGameData = (g) => {
        g.textSize = exports.pixelHeight * 10;
        g.tileWidth = exports.pixelWidth * 16;
        g.tileHeight = exports.pixelHeight * 16;
    };
    p5.setup = () => {
        gPrint("Monster Battler 2.0.0");
        let canv = p5.createCanvas((0, exports.WIDTH)(), (0, exports.HEIGHT)());
        canv.id("game-canvas");
        canv.parent("game-area");
        let maxWidth = exports.MAX_PIXEL * exports.GAME_WIDTH;
        let maxHeight = exports.MAX_PIXEL * exports.GAME_HEIGHT;
        if (window.innerWidth / maxWidth < 1 || window.innerHeight / maxHeight < 1) {
            p5.windowResized();
        }
        g = new GameData(p5, canv, new overworld_1.OverworldMap(), new statemachine_1.StateMachine(), new joypad_1.JoypadController());
        g.p = p5;
        g.canv = canv;
        g.map = new overworld_1.OverworldMap();
        g.stateMachine = new statemachine_1.StateMachine();
        g.joypad = new joypad_1.JoypadController();
        g.key = "";
        g.keyCode = 0;
        g.tileWidth = exports.pixelWidth * 16;
        g.tileHeight = exports.pixelHeight * 16;
        g.textSize = exports.pixelHeight * 10;
        g.frameRate = 60;
        g.orientation = exports.ORIENTATION_DESKTOP;
        g.p.frameRate(g.frameRate);
        g.p.background(0);
        g.p.frameRate(60);
        g.p.stroke(255);
        g.p.strokeWeight(1);
        g.p.textFont("monospace");
        g.stateMachine = new statemachine_1.StateMachine();
        g.stateMachine.enterState(new overworld_1.OverworldState());
        // GAME_DATA.map.initializeFromArray(MAP_PALET_TOWN);
        joypad_1.JoypadController.deployJoypadHTML(g);
        joypad_1.JoypadController.deployControlsTable();
    };
    let fpsString = () => {
        return p5.frameRate().toFixed(2);
    };
    p5.draw = () => {
        if (keyTimer !== 0) {
            keyTimer++;
        }
        else if (keyTimer >= 30) {
            keyTimer = 0;
        }
        g.stateMachine.update(g);
        g.joypad.update(g);
        g.p.noStroke();
        g.stateMachine.draw(g);
        // draw state stack on top of everything
        if (exports.DEBUG) {
            if (g.p.frameCount % 30 === 0) {
                debugFrameRate = fpsString();
            }
            let states = g.stateMachine.stateArray();
            let overlayString = "";
            overlayString += "Orientation: " + gOrientationStr(g.orientation);
            overlayString += "\n";
            overlayString += "FPS: " + debugFrameRate;
            overlayString += "\n";
            overlayString += "-------------";
            overlayString += "\n";
            overlayString += "State Stack: ";
            let i = 0;
            for (let s of states) {
                overlayString += `\n${i++}: ${s.name}[${s.phase}]`;
            }
            let maxBoxHeight = (g.textSize / 2) * overlayString.split("\n").length;
            p5.fill(Color.SLATE_GLASS);
            p5.rect(0, 0, (0, exports.WIDTH)(), g.textSize + maxBoxHeight);
            p5.fill(Color.OFF_WHITE);
            p5.textSize(g.textSize / 2);
            p5.textAlign(p5.LEFT, p5.TOP);
            p5.text(overlayString, g.textSize / 4, g.textSize / 4);
        }
    };
    p5.keyPressed = () => {
        if (p5.keyCode === p5.ESCAPE) {
            console.log("Exiting...");
            p5.noLoop();
        }
        g.key = p5.key;
        g.keyCode = p5.keyCode;
        g.joypad.pressJoypadKey(g);
    };
    p5.keyReleased = () => {
        g.joypad.releaseJoypadKey(g);
        g.key = "";
        g.keyCode = 0;
    };
    p5.windowResized = () => {
        let maxWidth = exports.GAME_WIDTH * exports.MAX_PIXEL;
        let maxHeight = exports.GAME_HEIGHT * exports.MAX_PIXEL;
        let width = 0;
        let height = 0;
        let wRatio = window.innerWidth / maxWidth;
        let hRatio = window.innerHeight / maxHeight;
        if (wRatio < 1) {
            hRatio = wRatio;
            width = window.innerWidth;
            height = wRatio * maxHeight;
            g.orientation = exports.ORIENTATION_PORTRAIT;
        }
        else if (hRatio < 1) {
            wRatio = hRatio;
            width = hRatio * maxWidth;
            height = window.innerHeight;
            g.orientation = exports.ORIENTATION_LANDSCAPE;
        }
        else {
            wRatio = 1;
            hRatio = 1;
            width = maxWidth;
            height = maxHeight;
            g.orientation = exports.ORIENTATION_DESKTOP;
        }
        exports.pixelWidth = wRatio * exports.MAX_PIXEL;
        exports.pixelHeight = hRatio * exports.MAX_PIXEL;
        g.reloadGameData();
        p5.resizeCanvas(width, height);
        g.stateMachine.resize(g);
        let gameCanv = document.getElementById(g.canv.id());
        let controls = document.getElementById("controls");
        switch (g.orientation) {
            case exports.ORIENTATION_PORTRAIT:
                if (controls)
                    controls.style.display = "none";
                if (gameCanv)
                    gameCanv.style.margin = "2em";
                break;
            case exports.ORIENTATION_LANDSCAPE:
                if (controls)
                    controls.style.display = "none";
                if (gameCanv)
                    gameCanv.style.margin = "0";
                break;
            case exports.ORIENTATION_DESKTOP:
                if (gameCanv)
                    gameCanv.style.margin = "2em";
                break;
            default:
                break;
        }
        joypad_1.JoypadController.repositionJoypad(g, gameCanv);
    };
};
exports.MONSTER_BATTLER_2 = MONSTER_BATTLER_2;
new P5(exports.MONSTER_BATTLER_2);
