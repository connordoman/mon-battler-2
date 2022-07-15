"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JoypadController = exports.KEYBOARD_KEYS = exports.JOYPAD_KEYS = exports.JOYPAD = exports.JOYPAD_STATE = exports.ASCII_KEYS = void 0;
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
exports.JOYPAD = {
    A: "Z".charCodeAt(0),
    B: "X".charCodeAt(0),
    X: "C".charCodeAt(0),
    Y: "V".charCodeAt(0),
    L: "Q".charCodeAt(0),
    R: "E".charCodeAt(0),
    START: exports.ASCII_KEYS.enter,
    SELECT: exports.ASCII_KEYS.backspace,
    UP: "W".charCodeAt(0),
    DOWN: "S".charCodeAt(0),
    LEFT: "A".charCodeAt(0),
    RIGHT: "D".charCodeAt(0),
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
    clearKeys() {
        this.inputQueue.clear();
        this.releaseQueue.clear();
        this.state = Object.assign({}, exports.JOYPAD_STATE);
    }
    pressJoypadKey() {
        if (this.keyTimer !== 0)
            return;
        // check for keycode
        if (main_1.GAME_DATA.keyCode < 32) {
            switch (main_1.GAME_DATA.keyCode) {
                case exports.JOYPAD.START:
                    this.inputQueue.push("START");
                    return;
                case exports.JOYPAD.SELECT:
                    this.inputQueue.push("SELECT");
                    return;
            }
        }
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
        // check for keycode
        if (main_1.GAME_DATA.keyCode < 32) {
            switch (main_1.GAME_DATA.keyCode) {
                case exports.JOYPAD.START:
                    this.releaseQueue.push("START");
                    return;
                case exports.JOYPAD.SELECT:
                    this.releaseQueue.push("SELECT");
                    return;
            }
        }
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
            // input pressed
            if (!this.inputQueue.isEmpty()) {
                let jkey = this.inputQueue.pop();
                if (jkey) {
                    this.state[jkey] = true;
                    main_1.GAME_DATA.stateMachine.currentState().joypadDown(jkey);
                }
                (0, main_1.gPrint)("KeyDown: " + jkey, this.state);
            }
            // input released
            if (!this.releaseQueue.isEmpty()) {
                let jkey = this.releaseQueue.pop();
                if (jkey) {
                    this.state[jkey] = false;
                    main_1.GAME_DATA.stateMachine.currentState().joypadUp(jkey);
                }
                (0, main_1.gPrint)("KeyUp: " + jkey, this.state);
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
    static deployJoypadHTML(g) {
        let leftPad;
        let rightPad;
        let canvas = document.getElementById(main_1.GAME_DATA.canv.id());
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
        leftPadUp.id = `joypad-${exports.JOYPAD.UP}`;
        leftPadDown.id = `joypad-${exports.JOYPAD.DOWN}`;
        leftPadLeft.id = `joypad-${exports.JOYPAD.LEFT}`;
        leftPadRight.id = `joypad-${exports.JOYPAD.RIGHT}`;
        leftPadUp.className = "pad-button";
        leftPadDown.className = "pad-button";
        leftPadLeft.className = "pad-button";
        leftPadRight.className = "pad-button";
        leftPadUp.innerHTML = "&uarr;";
        leftPadDown.innerHTML = "&darr;";
        leftPadLeft.innerHTML = "&larr;";
        leftPadRight.innerHTML = "&rarr;";
        // action buttons
        rightPadX.id = `joypad-${exports.JOYPAD.X}`;
        rightPadB.id = `joypad-${exports.JOYPAD.B}`;
        rightPadY.id = `joypad-${exports.JOYPAD.Y}`;
        rightPadA.id = `joypad-${exports.JOYPAD.A}`;
        rightPadX.className = "pad-button";
        rightPadB.className = "pad-button";
        rightPadY.className = "pad-button";
        rightPadA.className = "pad-button";
        rightPadX.innerHTML = "X";
        rightPadB.innerHTML = "B";
        rightPadY.innerHTML = "Y";
        rightPadA.innerHTML = "A";
        // option buttons
        centerPadStart.id = `joypad-${exports.JOYPAD.START}`;
        centerPadSelect.id = `joypad-${exports.JOYPAD.SELECT}`;
        centerPadStart.innerHTML = "START";
        centerPadSelect.innerHTML = "SELECT";
        centerPadStart.classList.add("pad-button", "noselect", "center-button");
        centerPadSelect.classList.add("pad-button", "noselect", "center-button");
        // position option buttons according to game area
        let rect = canvas.getBoundingClientRect();
        let rem1 = (0, main_1.gConvertRemToPixels)(1);
        (0, main_1.gPrint)(rect.top, rect.left, rect.bottom, rect.right);
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
    static createButtonsCross(buttons) {
        let table = document.createElement("table");
        table.classList.add("button-pad", "noselect");
        for (let i = 0; i < 3; i++) {
            let row = table.insertRow(i);
            for (let j = 0; j < 3; j++) {
                let index = i * 3 + j;
                let cell;
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
                }
                else {
                    cell = row.insertCell(j);
                    cell.innerHTML = "&nbsp;";
                }
            }
        }
        return table;
    }
    static prepareActionListeners(elem) {
        elem.addEventListener("mousedown", (e) => {
            JoypadController.onScreenKeyPress(e);
        });
        elem.addEventListener("mouseup", (e) => {
            JoypadController.onScreenKeyRelease(e);
        });
        elem.addEventListener("touchstart", (e) => {
            JoypadController.onScreenKeyPress(e);
        });
        elem.addEventListener("touchend", (e) => {
            JoypadController.onScreenKeyRelease(e);
        });
    }
    static onScreenKeyPress(e) {
        let jkey = parseInt(e.target.id.slice(7));
        if (jkey) {
            main_1.GAME_DATA.key = String.fromCharCode(jkey);
            main_1.GAME_DATA.keyCode = jkey;
            main_1.GAME_DATA.joypad.pressJoypadKey();
            (0, main_1.gPrint)("Pressed: " + String.fromCharCode(jkey));
        }
    }
    static onScreenKeyRelease(e) {
        let jkey = e.target.id.slice(7);
        if (jkey) {
            main_1.GAME_DATA.joypad.releaseJoypadKey();
            main_1.GAME_DATA.key = "";
            main_1.GAME_DATA.keyCode = 0;
            (0, main_1.gPrint)("Released: " + jkey);
        }
    }
    static deployControlsTable(g) {
        let table = document.createElement("table");
        let header = table.createTHead();
        let cell = header.insertRow(0).insertCell(0);
        cell.colSpan = 2;
        cell.innerHTML = "";
        for (let i = 1; i <= exports.JOYPAD_KEYS.length; i++) {
            let row = table.insertRow(i);
            let cell1 = row.insertCell(0);
            let cell2 = row.insertCell(1);
            cell1.innerHTML = `${exports.KEYBOARD_KEYS[i]}`;
            cell2.innerHTML = `${exports.JOYPAD_KEYS[i]}`;
        }
    }
}
exports.JoypadController = JoypadController;
