"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MONSTER_BATTLER_2 = exports.GAME_DATA = exports.gConvertRemToPixels = exports.gPrint = exports.FRAME_RATE = exports.TEXT_SIZE = exports.TILE_HEIGHT = exports.TILE_WIDTH = exports.HEIGHT = exports.WIDTH = exports.PIXEL_HEIGHT = exports.PIXEL_WIDTH = exports.DEBUG = void 0;
const P5 = require("p5");
const statemachine_1 = require("./statemachine");
const titlescreen_1 = require("./states/titlescreen");
const Color = require("./color");
const overworld_1 = require("./states/overworld");
const joypad_1 = require("./joypad");
exports.DEBUG = false;
exports.PIXEL_WIDTH = 3;
exports.PIXEL_HEIGHT = 3;
exports.WIDTH = 240 * exports.PIXEL_WIDTH;
exports.HEIGHT = 160 * exports.PIXEL_HEIGHT;
exports.TILE_WIDTH = 16 * exports.PIXEL_WIDTH;
exports.TILE_HEIGHT = 16 * exports.PIXEL_HEIGHT;
exports.TEXT_SIZE = exports.PIXEL_HEIGHT * (53 / 5);
exports.FRAME_RATE = 60;
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
};
// main p5 logic
const MONSTER_BATTLER_2 = (p5) => {
    let keyTimer = 0;
    let fps = `${exports.FRAME_RATE}`;
    p5.setup = () => {
        gPrint("Monster Battler 2.0.0");
        let canv = p5.createCanvas(exports.WIDTH, exports.HEIGHT);
        canv.parent("game-area");
        exports.GAME_DATA.canv = canv;
        p5.frameRate(exports.FRAME_RATE);
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
        if (p5.frameCount % exports.FRAME_RATE == 0) {
            fps = p5.frameRate().toFixed(2);
        }
        if (exports.DEBUG) {
            let states = exports.GAME_DATA.stateMachine.stateArray();
            p5.fill(Color.SLATE_GLASS);
            p5.rect(0, 0, exports.WIDTH, exports.TEXT_SIZE + states.length * (exports.TEXT_SIZE / 2));
            p5.fill(Color.OFF_WHITE);
            p5.textSize(exports.TEXT_SIZE / 2);
            p5.textAlign(p5.LEFT, p5.TOP);
            p5.text("FPS: " + fps, exports.TEXT_SIZE / 4, exports.TEXT_SIZE / 4 + (exports.TEXT_SIZE / 2) * states.length);
            for (let i = 0; i < states.length; i++) {
                p5.text(`${i}: ${states[i].name}`, exports.TEXT_SIZE / 4, exports.TEXT_SIZE / 4 + i * (exports.TEXT_SIZE / 2));
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
};
exports.MONSTER_BATTLER_2 = MONSTER_BATTLER_2;
new P5(exports.MONSTER_BATTLER_2);
