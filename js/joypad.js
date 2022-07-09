"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JoypadController = exports.KEYBOARD_KEYS = exports.JOYPAD_KEYS = exports.JOYPAD_STATE = exports.ASCII_KEYS = void 0;
const queue_1 = require("./queue");
const main_1 = require("./main");
const MAX_INPUTS = 10;
exports.ASCII_KEYS = {
    escape: 27,
    space: 32,
    enter: 13,
    backspace: 8,
    tab: 9,
    delete: 46,
    left: 37,
    up: 38,
    right: 39,
    down: 40,
};
exports.JOYPAD_STATE = {
    A: false,
    B: false,
    X: false,
    Y: false,
    L: false,
    R: false,
    START: false,
    SELECT: false,
    UP: false,
    DOWN: false,
    LEFT: false,
    RIGHT: false,
};
exports.JOYPAD_KEYS = ["UP", "DOWN", "LEFT", "RIGHT", "A", "B", "X", "Y", "L", "R", "START", "SELECT"];
exports.KEYBOARD_KEYS = ["W", "S", "A", "D", "Z", "X", "C", "V", "Q", "E", "ENTER", "SHIFT"];
class JoypadController {
    constructor() {
        this.state = Object.assign({}, exports.JOYPAD_STATE);
        this.keyTimer = 0;
        this.inputQueue = new queue_1.Queue();
        this.releaseQueue = new queue_1.Queue();
    }
    pressJoypadKey() {
        if (this.keyTimer !== 0)
            return;
        main_1.GAME_DATA.key = main_1.GAME_DATA.key.toUpperCase();
        for (let i = 0; i < exports.KEYBOARD_KEYS.length; i++) {
            if (exports.KEYBOARD_KEYS[i] === main_1.GAME_DATA.key && this.inputQueue.size < MAX_INPUTS) {
                this.inputQueue.push(exports.JOYPAD_KEYS[i]);
                break;
            }
        }
    }
    releaseJoypadKey() {
        if (this.keyTimer !== 0)
            return;
        main_1.GAME_DATA.key = main_1.GAME_DATA.key.toUpperCase();
        for (let i = 0; i < exports.KEYBOARD_KEYS.length; i++) {
            if (exports.KEYBOARD_KEYS[i] === main_1.GAME_DATA.key) {
                this.releaseQueue.push(exports.JOYPAD_KEYS[i]);
                break;
            }
        }
    }
    update(g) {
        if (this.keyTimer !== 0 && this.keyTimer >= 10) {
            this.keyTimer = 0;
        }
        else if (this.keyTimer !== 0) {
            this.keyTimer++;
        }
        if (g.frameCount % 4 === 0) {
            if (!this.inputQueue.isEmpty()) {
                let key = this.inputQueue.pop();
                if (key) {
                    this.state[key] = true;
                    main_1.GAME_DATA.stateMachine.currentState().joypadDown();
                }
                (0, main_1.gPrint)("KeyDown: " + key, this.state);
            }
            if (!this.releaseQueue.isEmpty()) {
                let key = this.releaseQueue.pop();
                if (key) {
                    this.state[key] = false;
                    main_1.GAME_DATA.stateMachine.currentState().joypadUp();
                }
                (0, main_1.gPrint)("KeyUp: " + key, this.state);
            }
        }
    }
    anyKeyDown() {
        for (let i = 0; i < exports.JOYPAD_KEYS.length; i++) {
            if (this.state[exports.JOYPAD_KEYS[i]]) {
                return true;
            }
        }
        return false;
    }
}
exports.JoypadController = JoypadController;
