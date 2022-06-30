"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JoypadController = exports.KEYBOARD_KEYS = exports.JOYPAD_KEYS = exports.JOYPAD_STATE = void 0;
const queue_1 = require("./queue");
const main_1 = require("./main");
const MAX_INPUTS = 10;
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
exports.JOYPAD_KEYS = ["A", "B", "X", "Y", "L", "R", "START", "SELECT", "UP", "DOWN", "LEFT", "RIGHT"];
exports.KEYBOARD_KEYS = ["Z", "X", "C", "V", "Q", "E", "ENTER", "SHIFT", "W", "S", "A", "D"];
class JoypadController {
    constructor(parent) {
        this.parent = parent;
        this.state = Object.assign({}, exports.JOYPAD_STATE);
        this.keyTimer = 0;
        this.inputQueue = new queue_1.Queue();
        this.releaseQueue = new queue_1.Queue();
    }
    pressJoypadKey(keyboard) {
        if (this.keyTimer !== 0)
            return;
        keyboard = keyboard.toUpperCase();
        for (let i = 0; i < exports.KEYBOARD_KEYS.length; i++) {
            if (exports.KEYBOARD_KEYS[i] === keyboard && this.inputQueue.size < MAX_INPUTS) {
                this.inputQueue.push(exports.JOYPAD_KEYS[i]);
                break;
            }
        }
    }
    releaseJoypadKey(keyboard) {
        if (this.keyTimer !== 0)
            return;
        keyboard = keyboard.toUpperCase();
        for (let i = 0; i < exports.KEYBOARD_KEYS.length; i++) {
            if (exports.KEYBOARD_KEYS[i] === keyboard) {
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
                    this.parent.currentState().joypadDown(key);
                }
                (0, main_1.print)("KeyDown: " + key, this.state);
            }
            if (!this.releaseQueue.isEmpty()) {
                let key = this.releaseQueue.pop();
                if (key) {
                    this.state[key] = false;
                    this.parent.currentState().joypadUp(key);
                }
                (0, main_1.print)("KeyUp: " + key, this.state);
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
