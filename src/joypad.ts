import * as P5 from "p5";
import { Queue } from "./queue";
import { GAME_DATA, gConvertRemToPixels, gPrint } from "./main";
import { sortAndDeduplicateDiagnostics } from "typescript";
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
        let gameArea: HTMLDivElement = document.getElementById("game-area") as HTMLDivElement;
        let canvas: HTMLCanvasElement = document.getElementById(GAME_DATA.canv.id()) as HTMLCanvasElement;

        let leftPadUp = document.createElement("span");
        let leftPadDown = document.createElement("span");
        let leftPadLeft = document.createElement("span");
        let leftPadRight = document.createElement("span");

        let rightPadX = document.createElement("span");
        let rightPadB = document.createElement("span");
        let rightPadY = document.createElement("span");
        let rightPadA = document.createElement("span");

        let centerPadStart = document.createElement("span");
        let centerPadSelect = document.createElement("span");

        // directional buttons
        leftPadUp.id = `joypad-${JOYPAD.UP}`;
        leftPadDown.id = `joypad-${JOYPAD.DOWN}`;
        leftPadLeft.id = `joypad-${JOYPAD.LEFT}`;
        leftPadRight.id = `joypad-${JOYPAD.RIGHT}`;

        leftPadUp.innerHTML = "&uarr;";
        leftPadDown.innerHTML = "&darr;";
        leftPadLeft.innerHTML = "&larr;";
        leftPadRight.innerHTML = "&rarr;";

        // action buttons
        rightPadX.id = `joypad-${JOYPAD.X}`;
        rightPadB.id = `joypad-${JOYPAD.B}`;
        rightPadY.id = `joypad-${JOYPAD.Y}`;
        rightPadA.id = `joypad-${JOYPAD.A}`;

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

        // add action listeners to option buttons
        JoypadController.prepareActionListeners(centerPadStart);
        JoypadController.prepareActionListeners(centerPadSelect);

        // prepare cross shaped tables
        leftPad = JoypadController.createButtonsCross([leftPadUp, leftPadLeft, leftPadRight, leftPadDown]);
        rightPad = JoypadController.createButtonsCross([rightPadX, rightPadY, rightPadA, rightPadB]);

        leftPad.classList.add("left");
        rightPad.classList.add("right");

        leftPad.id = "left-pad";
        rightPad.id = "right-pad";

        // position buttons according to game area
        let rect = canvas.getBoundingClientRect();
        let rem1 = gConvertRemToPixels(1);
        gPrint(rect.top, rect.left, rect.bottom, rect.right);
        centerPadStart.style.left = `${rect.right + rem1}px`;
        centerPadSelect.style.right = `${rect.right + rem1}px`;

        let botMargin = window.innerHeight - rect.bottom;
        leftPad.style.bottom = `${botMargin}px`;
        rightPad.style.bottom = `${botMargin}px`;
        centerPadStart.style.bottom = `${botMargin}px`;
        centerPadSelect.style.bottom = `${botMargin}px`;

        // add controller to screen
        gameArea.appendChild(leftPad);
        gameArea.appendChild(centerPadSelect);
        gameArea.appendChild(centerPadStart);
        gameArea.appendChild(rightPad);
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
    }

    private static onScreenKeyPress(e: MouseEvent | TouchEvent): void {
        let jkey = parseInt((e.target as HTMLTableCellElement).id.slice(7));
        if (jkey) {
            GAME_DATA.key = String.fromCharCode(jkey);
            GAME_DATA.keyCode = jkey;
            GAME_DATA.joypad.pressJoypadKey();
            gPrint("Pressed: " + String.fromCharCode(jkey));
        }
    }

    private static onScreenKeyRelease(e: MouseEvent | TouchEvent): void {
        let jkey = (e.target as HTMLTableCellElement).id.slice(7);
        if (jkey) {
            GAME_DATA.joypad.releaseJoypadKey();
            GAME_DATA.key = "";
            GAME_DATA.keyCode = 0;
            gPrint("Released: " + jkey);
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
