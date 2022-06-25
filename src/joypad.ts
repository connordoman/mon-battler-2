import * as P5 from "p5";
import { Queue } from "./queue";
import { StateMachine } from "./state";

const MAX_INPUTS = 10;

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

export const JOYPAD_KEYS = [
    "A",
    "B",
    "X",
    "Y",
    "L",
    "R",
    "START",
    "SELECT",
    "UP",
    "DOWN",
    "LEFT",
    "RIGHT",
];
export const KEYBOARD_KEYS = [
    "Z",
    "X",
    "C",
    "V",
    "Q",
    "E",
    "ENTER",
    "SHIFT",
    "W",
    "S",
    "A",
    "D",
];

export class JoypadController {
    parent: StateMachine;
    state: Joypad;
    keyTimer: number;
    inputQueue: Queue<string>;
    releaseQueue: Queue<string>;

    constructor(parent: StateMachine) {
        this.parent = parent;
        this.state = {
            ...JOYPAD_STATE,
        };
        this.keyTimer = 0;
        this.inputQueue = new Queue<string>();
        this.releaseQueue = new Queue<string>();
    }

    pressJoypadKey(keyboard: string) {
        if (this.keyTimer !== 0) return;
        keyboard = keyboard.toUpperCase();
        for (let i = 0; i < KEYBOARD_KEYS.length; i++) {
            if (
                KEYBOARD_KEYS[i] === keyboard &&
                this.inputQueue.size < MAX_INPUTS
            ) {
                this.inputQueue.push(JOYPAD_KEYS[i]);
                break;
            }
        }
    }

    releaseJoypadKey(keyboard: string) {
        if (this.keyTimer !== 0) return;
        keyboard = keyboard.toUpperCase();
        for (let i = 0; i < KEYBOARD_KEYS.length; i++) {
            if (KEYBOARD_KEYS[i] === keyboard) {
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
                    this.parent.currentState().joypadDown();
                }
                console.log("KeyDown: " + key, this.state);
            }
            if (!this.releaseQueue.isEmpty()) {
                let key = this.releaseQueue.pop();
                if (key) {
                    (this.state as any)[key] = false;
                    this.parent.currentState().joypadUp();
                }
                console.log("KeyUp: " + key, this.state);
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
