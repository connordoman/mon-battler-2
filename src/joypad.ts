import * as P5 from "p5";
import { Queue } from "./queue";
import {
    GAME_DATA,
    gGetPixelsFromRem,
    gPrint,
    ORIENTATION_DESKTOP,
    ORIENTATION_LANDSCAPE,
    ORIENTATION_PORTRAIT,
} from "./main";
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

export const JOYPAD_KEYS = ["UP", "DOWN", "LEFT", "RIGHT", "A", "B", "X", "Y", "L", "R", "START", "SELECT"];
export const KEYBOARD_KEYS = ["W", "S", "A", "D", "K", "L", "I", "O", "Q", "E", "ENTER", "BACKSPACE"];

export const JOYPAD = {
    UP: KEYBOARD_KEYS[0].charCodeAt(0),
    DOWN: KEYBOARD_KEYS[1].charCodeAt(0),
    LEFT: KEYBOARD_KEYS[2].charCodeAt(0),
    RIGHT: KEYBOARD_KEYS[3].charCodeAt(0),
    A: KEYBOARD_KEYS[4].charCodeAt(0),
    B: KEYBOARD_KEYS[5].charCodeAt(0),
    X: KEYBOARD_KEYS[6].charCodeAt(0),
    Y: KEYBOARD_KEYS[7].charCodeAt(0),
    L: KEYBOARD_KEYS[8].charCodeAt(0),
    R: KEYBOARD_KEYS[9].charCodeAt(0),
    START: ASCII_KEYS.enter,
    SELECT: ASCII_KEYS.backspace,
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

export class JoypadController {
    state: Joypad;
    keyTimer: number;
    inputQueue: Queue<string>;
    releaseQueue: Queue<string>;

    static leftPadUp = document.createElement("span");
    static leftPadDown = document.createElement("span");
    static leftPadLeft = document.createElement("span");
    static leftPadRight = document.createElement("span");

    static rightPadX = document.createElement("span");
    static rightPadB = document.createElement("span");
    static rightPadY = document.createElement("span");
    static rightPadA = document.createElement("span");

    static centerPadStart = document.createElement("span");
    static centerPadSelect = document.createElement("span");

    static leftPad: HTMLTableElement = document.createElement("table");
    static rightPad: HTMLTableElement = document.createElement("table");

    static buttonPressed: boolean = false;

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
        let gameArea: HTMLDivElement = document.getElementById("game-area") as HTMLDivElement;
        let canvas: HTMLCanvasElement = document.getElementById(GAME_DATA.canv.id()) as HTMLCanvasElement;
        // directional buttons
        this.leftPadUp.id = `joypad-${JOYPAD.UP}`;
        this.leftPadDown.id = `joypad-${JOYPAD.DOWN}`;
        this.leftPadLeft.id = `joypad-${JOYPAD.LEFT}`;
        this.leftPadRight.id = `joypad-${JOYPAD.RIGHT}`;

        this.leftPadUp.innerHTML = "&uarr;";
        this.leftPadDown.innerHTML = "&darr;";
        this.leftPadLeft.innerHTML = "&larr;";
        this.leftPadRight.innerHTML = "&rarr;";

        // action buttons
        this.rightPadX.id = `joypad-${JOYPAD.X}`;
        this.rightPadB.id = `joypad-${JOYPAD.B}`;
        this.rightPadY.id = `joypad-${JOYPAD.Y}`;
        this.rightPadA.id = `joypad-${JOYPAD.A}`;

        this.rightPadX.innerHTML = "X";
        this.rightPadB.innerHTML = "B";
        this.rightPadY.innerHTML = "Y";
        this.rightPadA.innerHTML = "A";

        // option buttons
        this.centerPadStart.id = `joypad-${JOYPAD.START}`;
        this.centerPadSelect.id = `joypad-${JOYPAD.SELECT}`;

        this.centerPadStart.innerHTML = "START";
        this.centerPadSelect.innerHTML = "SELECT";

        this.centerPadStart.classList.add("pad-button", "noselect", "center-button");
        this.centerPadSelect.classList.add("pad-button", "noselect", "center-button");

        // add action listeners to option buttons
        this.prepareActionListeners(this.centerPadStart);
        this.prepareActionListeners(this.centerPadSelect);

        // prepare cross shaped tables
        this.leftPad = this.createButtonsCross([this.leftPadUp, this.leftPadLeft, this.leftPadRight, this.leftPadDown]);
        this.rightPad = this.createButtonsCross([this.rightPadX, this.rightPadY, this.rightPadA, this.rightPadB]);

        this.leftPad.classList.add("left");
        this.rightPad.classList.add("right");

        this.leftPad.id = "left-pad";
        this.rightPad.id = "right-pad";

        JoypadController.repositionJoypad(canvas);

        // add controller to screen
        gameArea.appendChild(this.centerPadSelect);
        gameArea.appendChild(this.centerPadStart);
        gameArea.appendChild(this.leftPad);
        gameArea.appendChild(this.rightPad);
    }

    static createButtonsCross(buttons: HTMLSpanElement[]): HTMLTableElement {
        let table = document.createElement("table");
        table.classList.add("button-pad", "noselect");

        for (let i = 0; i < 3; i++) {
            let row = table.insertRow(i);
            for (let j = 0; j < 3; j++) {
                let index = i * 3 + j;
                let cell = row.insertCell(j);
                if (index % 2 === 1) {
                    let sp = buttons[(index - 1) / 2];
                    sp.className = "pad-button";
                    cell.appendChild(sp);

                    JoypadController.prepareActionListeners(sp);
                } else {
                    cell.innerHTML = "&nbsp;";
                }
            }
        }
        return table;
    }

    static repositionJoypad(canvas: HTMLCanvasElement): void {
        // position buttons according to game area
        let rect = canvas.getBoundingClientRect();
        let rem1 = gGetPixelsFromRem(1);
        gPrint(rect.top, rect.left, rect.bottom, rect.right);

        this.centerPadStart.style.left = `${rect.right + rem1}px`;
        this.centerPadSelect.style.right = `${rect.right + rem1}px`;

        switch (GAME_DATA.orientation) {
            case ORIENTATION_PORTRAIT:
                this.leftPad.style.top = `${rect.bottom + rem1}px`;
                this.leftPad.style.left = `${rem1}px`;
                this.rightPad.style.top = `${rect.bottom + rem1}px`;
                this.rightPad.style.right = `${rem1}px`;

                this.centerPadStart.style.left = `${window.innerWidth / 2 + rem1}px`;
                this.centerPadSelect.style.right = `${window.innerWidth / 2 + rem1}px`;
                this.centerPadStart.style.top = `${rect.bottom + (window.innerHeight - rect.bottom) / 2 + rem1}px`;
                this.centerPadSelect.style.top = `${rect.bottom + (window.innerHeight - rect.bottom) / 2 + rem1}px`;
                break;
            case ORIENTATION_LANDSCAPE:
                this.leftPad.style.bottom = `${gGetPixelsFromRem(4)}px`;
                this.rightPad.style.bottom = `${gGetPixelsFromRem(4)}px`;
                this.centerPadStart.style.bottom = `${rem1}px`;
                this.centerPadSelect.style.bottom = `${rem1}px`;
                break;
            case ORIENTATION_DESKTOP:
                let botMargin = window.innerHeight - rect.bottom;
                this.leftPad.style.top = `${rect.bottom / 2}px`;
                this.rightPad.style.top = `${rect.bottom / 2}px`;
                this.centerPadStart.style.bottom = `${botMargin}px`;
                this.centerPadSelect.style.bottom = `${botMargin}px`;
                break;
        }
    }

    private static prepareActionListeners(elem: HTMLElement): void {
        elem.addEventListener("mousedown", (e) => {
            JoypadController.onScreenKeyPress(e);
        });
        elem.addEventListener("mouseup", (e) => {
            JoypadController.onScreenKeyRelease(e);
        });
        elem.addEventListener("touchstart", (e) => {
            window.setTimeout(() => {
                JoypadController.onScreenKeyPress(e);
            }, 100);
        });
        elem.addEventListener("touchend", (e) => {
            JoypadController.onScreenKeyRelease(e);
        });
        elem.addEventListener("touchmove", (e) => {
            // absorb touch moved event
        });
    }

    private static onScreenKeyPress(e: MouseEvent | TouchEvent): void {
        let button = e.target as HTMLElement;

        if (button.classList.contains("active")) return;

        let jkey = parseInt(button.id.slice(7));
        if (jkey) {
            GAME_DATA.key = String.fromCharCode(jkey);
            GAME_DATA.keyCode = jkey;
            GAME_DATA.joypad.pressJoypadKey();
            gPrint("Pressed: " + String.fromCharCode(jkey));
            button.classList.add("active");
        }
    }

    private static onScreenKeyRelease(e: MouseEvent | TouchEvent): void {
        let button = e.target as HTMLElement;

        if (!button.classList.contains("active")) return;

        let jkey = button.id.slice(7);
        if (jkey) {
            GAME_DATA.joypad.releaseJoypadKey();
            GAME_DATA.key = "";
            GAME_DATA.keyCode = 0;
            gPrint("Released: " + jkey);
            button.classList.remove("active");
        }
    }

    public static deployControlsTable(): void {
        let keyset = JOYPAD_KEYS as Array<string>;
        let table = document.createElement("table") as HTMLTableElement;
        table.id = "controls";
        let header = table.createTHead();
        let headerCell = header.insertRow(0).insertCell(0);
        headerCell.colSpan = keyset.length + 1;
        headerCell.innerHTML = "<h1><em>Controls</em></h1>";

        for (let i = 0; i < 2; i++) {
            keyset = i % 2 == 0 ? (JOYPAD_KEYS as Array<string>) : (KEYBOARD_KEYS as Array<string>);
            let keysetName = i % 2 == 0 ? "Joypad" : "Keyboard";
            let row = table.insertRow(i + 1);

            let cell = row.insertCell(0);
            cell.innerHTML = `<h2>${keysetName}</h2>`;

            for (let j = 0; j < keyset.length; j++) {
                let key = keyset[j];
                cell = row.insertCell(j + 1);

                let sp = document.createElement("span");
                if (i % 2 == 0) {
                    sp.innerHTML = key;
                    sp.classList.add("pad-button");
                    //if (j < 4) {
                    switch (j) {
                        case 0:
                            sp.innerHTML = "&uarr;";
                            break;
                        case 1:
                            sp.innerHTML = "&darr;";
                            break;
                        case 2:
                            sp.innerHTML = "&larr;";
                            break;
                        case 3:
                            sp.innerHTML = "&rarr;";
                            break;
                        case keyset.length - 2:
                        case keyset.length - 1:
                            sp.classList.add("center-button");
                            sp.style.position = "static";
                            break;
                    }
                    //} else if (j > keyset.length - 3) {
                    //}
                } else {
                    sp.innerHTML = key;
                    sp.classList.add("key-button");
                }
                cell.appendChild(sp);
            }
        }

        table.classList.add("noselect");

        (document.getElementById("game-area") as HTMLDivElement).appendChild(table);
    }
}
