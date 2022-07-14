import * as P5 from "p5";
import { Queue } from "./queue";
import { GAME_DATA, gConvertRemToPixels, gPrint } from "./main";
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
    [index: string]: boolean;
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

export const JOYPAD = {
    A: "Z".charCodeAt(0),
    B: "X".charCodeAt(0),
    X: "C".charCodeAt(0),
    Y: "V".charCodeAt(0),
    L: "Q".charCodeAt(0),
    R: "E".charCodeAt(0),
    START: ASCII_KEYS.enter,
    SELECT: ASCII_KEYS.backspace,
    UP: "W".charCodeAt(0),
    DOWN: "S".charCodeAt(0),
    LEFT: "A".charCodeAt(0),
    RIGHT: "D".charCodeAt(0),
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

    clearKeys() {
        this.inputQueue.clear();
        this.releaseQueue.clear();
        this.state = {
            ...JOYPAD_STATE,
        };
    }

    pressJoypadKey() {
        if (this.keyTimer !== 0) return;

        // check for keycode
        if (GAME_DATA.keyCode < 32) {
            switch (GAME_DATA.keyCode) {
                case JOYPAD.START:
                    this.inputQueue.push("START");
                    return;
                case JOYPAD.SELECT:
                    this.inputQueue.push("SELECT");
                    return;
            }
        }

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

        // check for keycode
        if (GAME_DATA.keyCode < 32) {
            switch (GAME_DATA.keyCode) {
                case JOYPAD.START:
                    this.releaseQueue.push("START");
                    return;
                case JOYPAD.SELECT:
                    this.releaseQueue.push("SELECT");
                    return;
            }
        }

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
            // input pressed
            if (!this.inputQueue.isEmpty()) {
                let jkey = this.inputQueue.pop();
                if (jkey) {
                    (this.state as any)[jkey] = true;
                    GAME_DATA.stateMachine.currentState().joypadDown(jkey);
                }
                gPrint("KeyDown: " + jkey, this.state);
            }
            // input released
            if (!this.releaseQueue.isEmpty()) {
                let jkey = this.releaseQueue.pop();
                if (jkey) {
                    (this.state as any)[jkey] = false;
                    GAME_DATA.stateMachine.currentState().joypadUp(jkey);
                }
                gPrint("KeyUp: " + jkey, this.state);
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

    static deployJoypadHTML(g: P5): void {
        let leftPad: HTMLTableElement;
        let rightPad: HTMLTableElement;

        let canvas: HTMLCanvasElement = document.getElementById(GAME_DATA.canv.id()) as HTMLCanvasElement;

        let leftPadUp = document.createElement("td");
        let leftPadDown = document.createElement("td");
        let leftPadLeft = document.createElement("td");
        let leftPadRight = document.createElement("td");

        let rightPadX = document.createElement("td");
        let rightPadB = document.createElement("td");
        let rightPadY = document.createElement("td");
        let rightPadA = document.createElement("td");

        let centerPadStart = document.createElement("span");
        let centerPadSelect = document.createElement("span");

        // directional buttons
        leftPadUp.id = `joypad-${JOYPAD.UP}`;
        leftPadDown.id = `joypad-${JOYPAD.DOWN}`;
        leftPadLeft.id = `joypad-${JOYPAD.LEFT}`;
        leftPadRight.id = `joypad-${JOYPAD.RIGHT}`;

        leftPadUp.className = "pad-button";
        leftPadDown.className = "pad-button";
        leftPadLeft.className = "pad-button";
        leftPadRight.className = "pad-button";

        leftPadUp.innerHTML = "&uarr;";
        leftPadDown.innerHTML = "&darr;";
        leftPadLeft.innerHTML = "&larr;";
        leftPadRight.innerHTML = "&rarr;";

        // action buttons
        rightPadX.id = `joypad-${JOYPAD.X}`;
        rightPadB.id = `joypad-${JOYPAD.B}`;
        rightPadY.id = `joypad-${JOYPAD.Y}`;
        rightPadA.id = `joypad-${JOYPAD.A}`;

        rightPadX.className = "pad-button";
        rightPadB.className = "pad-button";
        rightPadY.className = "pad-button";
        rightPadA.className = "pad-button";

        rightPadX.innerHTML = "X";
        rightPadB.innerHTML = "B";
        rightPadY.innerHTML = "Y";
        rightPadA.innerHTML = "A";

        // option buttons
        centerPadStart.id = `joypad-${JOYPAD.START}`;
        centerPadSelect.id = `joypad-${JOYPAD.SELECT}`;

        centerPadStart.innerHTML = "START";
        centerPadSelect.innerHTML = "SELECT";

        centerPadStart.classList.add("pad-button", "noselect", "center-button");
        centerPadSelect.classList.add("pad-button", "noselect", "center-button");

        // position option buttons according to game area
        let rect = canvas.getBoundingClientRect();
        let rem1 = gConvertRemToPixels(1);
        gPrint(rect.top, rect.left, rect.bottom, rect.right);
        centerPadStart.style.left = `${rect.right + rem1}px`;
        centerPadSelect.style.right = `${rect.right + rem1}px`;

        // add action listeners to option buttons
        centerPadStart.addEventListener("mousedown", (e) => {
            JoypadController.onScreenKeyPress(e);
        });
        centerPadStart.addEventListener("mouseup", (e) => {
            JoypadController.onScreenKeyRelease(e);
        });
        centerPadSelect.addEventListener("mousedown", (e) => {
            JoypadController.onScreenKeyPress(e);
        });
        centerPadSelect.addEventListener("mouseup", (e) => {
            JoypadController.onScreenKeyRelease(e);
        });

        // prepare cross shaped tables
        leftPad = JoypadController.createButtonsCross([leftPadUp, leftPadLeft, leftPadRight, leftPadDown]);
        rightPad = JoypadController.createButtonsCross([rightPadX, rightPadY, rightPadA, rightPadB]);

        leftPad.classList.add("left");
        rightPad.classList.add("right");

        leftPad.id = "left-pad";
        rightPad.id = "right-pad";

        // add controller to screen
        document.body.appendChild(leftPad);
        document.body.appendChild(centerPadSelect);
        document.body.appendChild(centerPadStart);
        document.body.appendChild(rightPad);
    }

    static createButtonsCross(buttons: HTMLTableCellElement[]): HTMLTableElement {
        let table = document.createElement("table");
        table.classList.add("button-pad", "noselect");
        for (let i = 0; i < 3; i++) {
            let row = table.insertRow(i);
            for (let j = 0; j < 3; j++) {
                let index = i * 3 + j;
                let cell: HTMLTableCellElement;
                if (index % 2 === 1) {
                    cell = buttons[(index - 1) / 2];
                    cell.classList.add("pad-button");

                    cell.addEventListener("mousedown", (e) => {
                        JoypadController.onScreenKeyPress(e);
                    });
                    cell.addEventListener("mouseup", (e) => {
                        JoypadController.onScreenKeyRelease(e);
                    });

                    row.appendChild(cell);
                } else {
                    cell = row.insertCell(j);
                    cell.innerHTML = "&nbsp;";
                }
            }
        }
        return table;
    }

    private static onScreenKeyPress(e: MouseEvent): void {
        let jkey = parseInt((e.target as HTMLTableCellElement).id.slice(7));
        if (jkey) {
            GAME_DATA.key = String.fromCharCode(jkey);
            GAME_DATA.keyCode = jkey;
            GAME_DATA.joypad.pressJoypadKey();
            gPrint("Pressed: " + String.fromCharCode(jkey));
        }
    }

    private static onScreenKeyRelease(e: MouseEvent): void {
        let jkey = (e.target as HTMLTableCellElement).id.slice(7);
        if (jkey) {
            GAME_DATA.joypad.releaseJoypadKey();
            GAME_DATA.key = "";
            GAME_DATA.keyCode = 0;
            gPrint("Released: " + jkey);
        }
    }
}
