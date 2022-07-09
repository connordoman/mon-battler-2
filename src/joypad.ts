import * as P5 from "p5";
import { Queue } from "./queue";
import { StateMachine } from "./statemachine";
import { GAME_DATA, gPrint } from "./main";

const MAX_INPUTS = 10;

export const ASCII_KEYS = {
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

export const JOYPAD_STATE: Joypad = {
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

export type Joypad = {
    A: boolean;
    B: boolean;
    X: boolean;
    Y: boolean;
    L: boolean;
    R: boolean;
    START: boolean;
    SELECT: boolean;
    UP: boolean;
    DOWN: boolean;
    LEFT: boolean;
    RIGHT: boolean;
};

export const JOYPAD_KEYS = ["UP", "DOWN", "LEFT", "RIGHT", "A", "B", "X", "Y", "L", "R", "START", "SELECT"];
export const KEYBOARD_KEYS = ["W", "S", "A", "D", "Z", "X", "C", "V", "Q", "E", "ENTER", "SHIFT"];

export class JoypadController {
    state: Joypad;
    keyTimer: number;
    inputQueue: Queue<string>;
    releaseQueue: Queue<string>;

    constructor() {
        this.state = {
            ...JOYPAD_STATE,
        };
        this.keyTimer = 0;
        this.inputQueue = new Queue<string>();
        this.releaseQueue = new Queue<string>();
    }

    pressJoypadKey() {
        if (this.keyTimer !== 0) return;
        GAME_DATA.key = GAME_DATA.key.toUpperCase();
        for (let i = 0; i < KEYBOARD_KEYS.length; i++) {
            if (KEYBOARD_KEYS[i] === GAME_DATA.key && this.inputQueue.size < MAX_INPUTS) {
                this.inputQueue.push(JOYPAD_KEYS[i]);
                break;
            }
        }
    }

    releaseJoypadKey() {
        if (this.keyTimer !== 0) return;
        GAME_DATA.key = GAME_DATA.key.toUpperCase();
        for (let i = 0; i < KEYBOARD_KEYS.length; i++) {
            if (KEYBOARD_KEYS[i] === GAME_DATA.key) {
                this.releaseQueue.push(JOYPAD_KEYS[i]);
                break;
            }
        }
    }

    update(g: P5) {
        if (this.keyTimer !== 0 && this.keyTimer >= 10) {
            this.keyTimer = 0;
        } else if (this.keyTimer !== 0) {
            this.keyTimer++;
        }

        if (g.frameCount % 4 === 0) {
            if (!this.inputQueue.isEmpty()) {
                let key = this.inputQueue.pop();
                if (key) {
                    (this.state as any)[key] = true;
                    GAME_DATA.stateMachine.currentState().joypadDown();
                }
                gPrint("KeyDown: " + key, this.state);
            }
            if (!this.releaseQueue.isEmpty()) {
                let key = this.releaseQueue.pop();
                if (key) {
                    (this.state as any)[key] = false;
                    GAME_DATA.stateMachine.currentState().joypadUp();
                }
                gPrint("KeyUp: " + key, this.state);
            }
        }
    }

    anyKeyDown() {
        for (let i = 0; i < JOYPAD_KEYS.length; i++) {
            if ((this.state as any)[JOYPAD_KEYS[i]]) {
                return true;
            }
        }
        return false;
    }
}
