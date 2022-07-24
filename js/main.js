"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MONSTER_BATTLER_2 = exports.GAME_DATA = exports.gConvertRemToPixels = exports.gPrint = exports.GameData = exports.HEIGHT = exports.WIDTH = exports.ACTUAL_PIXEL_HEIGHT = exports.ACTUAL_PIXEL_WIDTH = exports.pixelHeight = exports.pixelWidth = exports.gOrientationStr = exports.ORIENTATION_DESKTOP = exports.ORIENTATION_LANDSCAPE = exports.ORIENTATION_PORTRAIT = exports.GAME_HEIGHT = exports.GAME_WIDTH = exports.MAX_PIXEL = exports.DEBUG = void 0;
const P5 = require("p5");
const statemachine_1 = require("./statemachine");
const titlescreen_1 = require("./states/titlescreen");
const Color = require("./color");
const overworld_1 = require("./states/overworld");
const joypad_1 = require("./joypad");
exports.DEBUG = true;
exports.MAX_PIXEL = 3;
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
exports.pixelWidth = 3;
exports.pixelHeight = 3;
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
    constructor(canv, map, stateMachine, joypad) {
        this.canv = canv;
        this.map = map;
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
function gConvertRemToPixels(rem) {
    return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
}
exports.gConvertRemToPixels = gConvertRemToPixels;
exports.GAME_DATA = {
    canv: new P5.Element("canvas"),
    map: new overworld_1.OverworldMap(),
    stateMachine: new statemachine_1.StateMachine(),
    joypad: new joypad_1.JoypadController(),
    key: "",
    keyCode: 0,
    tileWidth: exports.pixelWidth * 16,
    tileHeight: exports.pixelHeight * 16,
    textSize: exports.pixelHeight * 10,
    frameRate: 60,
    orientation: exports.ORIENTATION_PORTRAIT,
};
// main p5 logic
const MONSTER_BATTLER_2 = (p5) => {
    let keyTimer = 0;
    let fps = `${exports.GAME_DATA.frameRate}`;
    let reloadGameData = () => {
        exports.GAME_DATA.textSize = exports.pixelHeight * 10;
        exports.GAME_DATA.tileWidth = exports.pixelWidth * 16;
        exports.GAME_DATA.tileHeight = exports.pixelHeight * 16;
    };
    p5.setup = () => {
        gPrint("Monster Battler 2.0.0");
        let canv = p5.createCanvas((0, exports.WIDTH)(), (0, exports.HEIGHT)());
        canv.id("game-canvas");
        canv.parent("game-area");
        exports.GAME_DATA.canv = canv;
        let maxWidth = exports.MAX_PIXEL * exports.GAME_WIDTH;
        let maxHeight = exports.MAX_PIXEL * exports.GAME_HEIGHT;
        if (window.innerWidth / maxWidth < 1 || window.innerHeight / maxHeight < 1) {
            p5.windowResized();
        }
        p5.frameRate(exports.GAME_DATA.frameRate);
        p5.background(0);
        p5.frameRate(60);
        p5.stroke(255);
        p5.strokeWeight(1);
        p5.textFont("monospace");
        exports.GAME_DATA.stateMachine = new statemachine_1.StateMachine();
        exports.GAME_DATA.stateMachine.enterState(new titlescreen_1.TitleScreenState());
        joypad_1.JoypadController.deployJoypadHTML(p5);
        joypad_1.JoypadController.deployControlsTable();
    };
    p5.draw = () => {
        if (keyTimer !== 0) {
            keyTimer++;
        }
        else if (keyTimer >= 30) {
            keyTimer = 0;
        }
        exports.GAME_DATA.stateMachine.update(p5);
        exports.GAME_DATA.joypad.update(p5);
        p5.noStroke();
        exports.GAME_DATA.stateMachine.draw(p5);
        if (p5.frameCount % exports.GAME_DATA.frameRate == 0) {
            fps = p5.frameRate().toFixed(2);
        }
        // draw state stack on top of everything
        if (exports.DEBUG) {
            let states = exports.GAME_DATA.stateMachine.stateArray();
            p5.fill(Color.SLATE_GLASS);
            p5.rect(0, 0, (0, exports.WIDTH)(), exports.GAME_DATA.textSize + (states.length + 1) * (exports.GAME_DATA.textSize / 2));
            p5.fill(Color.OFF_WHITE);
            p5.textSize(exports.GAME_DATA.textSize / 2);
            p5.textAlign(p5.LEFT, p5.TOP);
            p5.text("FPS: " + fps, exports.GAME_DATA.textSize / 4, exports.GAME_DATA.textSize / 4 + (exports.GAME_DATA.textSize / 2) * states.length);
            p5.text("Orientation: " + gOrientationStr(exports.GAME_DATA.orientation), exports.GAME_DATA.textSize / 4, exports.GAME_DATA.textSize / 4 + (exports.GAME_DATA.textSize / 2) * (states.length + 1));
            for (let i = 0; i < states.length; i++) {
                p5.text(`${i}: ${states[i].name}[${states[i].phase}]`, exports.GAME_DATA.textSize / 4, exports.GAME_DATA.textSize / 4 + i * (exports.GAME_DATA.textSize / 2));
            }
        }
    };
    p5.keyPressed = () => {
        exports.GAME_DATA.key = p5.key;
        exports.GAME_DATA.keyCode = p5.keyCode;
        exports.GAME_DATA.joypad.pressJoypadKey();
    };
    p5.keyReleased = () => {
        exports.GAME_DATA.joypad.releaseJoypadKey();
        exports.GAME_DATA.key = "";
        exports.GAME_DATA.keyCode = 0;
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
            exports.GAME_DATA.orientation = exports.ORIENTATION_PORTRAIT;
        }
        else if (hRatio < 1) {
            wRatio = hRatio;
            width = hRatio * maxWidth;
            height = window.innerHeight;
            exports.GAME_DATA.orientation = exports.ORIENTATION_LANDSCAPE;
        }
        else {
            wRatio = 1;
            hRatio = 1;
            width = maxWidth;
            height = maxHeight;
            exports.GAME_DATA.orientation = exports.ORIENTATION_DESKTOP;
        }
        exports.pixelWidth = wRatio * exports.MAX_PIXEL;
        exports.pixelHeight = hRatio * exports.MAX_PIXEL;
        reloadGameData();
        p5.resizeCanvas(width, height);
        exports.GAME_DATA.stateMachine.resize(p5);
        let gameCanv = document.getElementById(exports.GAME_DATA.canv.id());
        let controls = document.getElementById("controls");
        switch (exports.GAME_DATA.orientation) {
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
        joypad_1.JoypadController.repositionJoypad(gameCanv);
    };
};
exports.MONSTER_BATTLER_2 = MONSTER_BATTLER_2;
new P5(exports.MONSTER_BATTLER_2);
