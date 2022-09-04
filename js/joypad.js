"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JoypadController = exports.JOYPAD = exports.KEYBOARD_KEYS = exports.JOYPAD_KEYS = exports.JOYPAD_STATE = exports.ASCII_KEYS = void 0;
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
exports.KEYBOARD_KEYS = ["W", "S", "A", "D", "K", "L", "I", "O", "Q", "E", "ENTER", "BACKSPACE"];
exports.JOYPAD = {
    UP: exports.KEYBOARD_KEYS[0].charCodeAt(0),
    DOWN: exports.KEYBOARD_KEYS[1].charCodeAt(0),
    LEFT: exports.KEYBOARD_KEYS[2].charCodeAt(0),
    RIGHT: exports.KEYBOARD_KEYS[3].charCodeAt(0),
    A: exports.KEYBOARD_KEYS[4].charCodeAt(0),
    B: exports.KEYBOARD_KEYS[5].charCodeAt(0),
    X: exports.KEYBOARD_KEYS[6].charCodeAt(0),
    Y: exports.KEYBOARD_KEYS[7].charCodeAt(0),
    L: exports.KEYBOARD_KEYS[8].charCodeAt(0),
    R: exports.KEYBOARD_KEYS[9].charCodeAt(0),
    START: exports.ASCII_KEYS.enter,
    SELECT: exports.ASCII_KEYS.backspace,
};
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
    pressJoypadKey(g) {
        if (this.keyTimer !== 0)
            return;
        // check for keycode
        if (g.keyCode < 32) {
            switch (g.keyCode) {
                case exports.JOYPAD.START:
                    this.inputQueue.push("START");
                    return;
                case exports.JOYPAD.SELECT:
                    this.inputQueue.push("SELECT");
                    return;
            }
        }
        g.key = g.key.toUpperCase();
        for (let i = 0; i < exports.KEYBOARD_KEYS.length; i++) {
            if (exports.KEYBOARD_KEYS[i] === g.key && this.inputQueue.size < MAX_INPUTS) {
                this.inputQueue.push(exports.JOYPAD_KEYS[i]);
                break;
            }
        }
    }
    releaseJoypadKey(g) {
        if (this.keyTimer !== 0)
            return;
        // check for keycode
        if (g.keyCode < 32) {
            switch (g.keyCode) {
                case exports.JOYPAD.START:
                    this.releaseQueue.push("START");
                    return;
                case exports.JOYPAD.SELECT:
                    this.releaseQueue.push("SELECT");
                    return;
            }
        }
        g.key = g.key.toUpperCase();
        for (let i = 0; i < exports.KEYBOARD_KEYS.length; i++) {
            if (exports.KEYBOARD_KEYS[i] === g.key) {
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
        if (g.p.frameCount % 4 === 0) {
            // input pressed
            if (!this.inputQueue.isEmpty()) {
                let jkey = this.inputQueue.pop();
                if (jkey) {
                    this.state[jkey] = true;
                    g.stateMachine.currentState().joypadDown(g);
                }
                (0, main_1.gPrint)("KeyDown: " + jkey, this.state);
            }
            // input released
            if (!this.releaseQueue.isEmpty()) {
                let jkey = this.releaseQueue.pop();
                if (jkey) {
                    this.state[jkey] = false;
                    g.stateMachine.currentState().joypadUp(g);
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
        let gameArea = document.getElementById("game-area");
        let canvas = document.getElementById(g.canv.id());
        // directional buttons
        this.leftPadUp.id = `joypad-${exports.JOYPAD.UP}`;
        this.leftPadDown.id = `joypad-${exports.JOYPAD.DOWN}`;
        this.leftPadLeft.id = `joypad-${exports.JOYPAD.LEFT}`;
        this.leftPadRight.id = `joypad-${exports.JOYPAD.RIGHT}`;
        this.leftPadUp.innerHTML = "&uarr;";
        this.leftPadDown.innerHTML = "&darr;";
        this.leftPadLeft.innerHTML = "&larr;";
        this.leftPadRight.innerHTML = "&rarr;";
        // action buttons
        this.rightPadX.id = `joypad-${exports.JOYPAD.X}`;
        this.rightPadB.id = `joypad-${exports.JOYPAD.B}`;
        this.rightPadY.id = `joypad-${exports.JOYPAD.Y}`;
        this.rightPadA.id = `joypad-${exports.JOYPAD.A}`;
        this.rightPadX.innerHTML = "X";
        this.rightPadB.innerHTML = "B";
        this.rightPadY.innerHTML = "Y";
        this.rightPadA.innerHTML = "A";
        // option buttons
        this.centerPadStart.id = `joypad-${exports.JOYPAD.START}`;
        this.centerPadSelect.id = `joypad-${exports.JOYPAD.SELECT}`;
        this.centerPadStart.innerHTML = "START";
        this.centerPadSelect.innerHTML = "SELECT";
        this.centerPadStart.classList.add("pad-button", "noselect", "center-button");
        this.centerPadSelect.classList.add("pad-button", "noselect", "center-button");
        // add action listeners to option buttons
        this.prepareActionListeners(g, this.centerPadStart);
        this.prepareActionListeners(g, this.centerPadSelect);
        // prepare cross shaped tables
        this.leftPad = this.createButtonsCross(g, [
            this.leftPadUp,
            this.leftPadLeft,
            this.leftPadRight,
            this.leftPadDown,
        ]);
        this.rightPad = this.createButtonsCross(g, [this.rightPadX, this.rightPadY, this.rightPadA, this.rightPadB]);
        this.leftPad.classList.add("left");
        this.rightPad.classList.add("right");
        this.leftPad.id = "left-pad";
        this.rightPad.id = "right-pad";
        JoypadController.repositionJoypad(g, canvas);
        // add controller to screen
        gameArea.appendChild(this.centerPadSelect);
        gameArea.appendChild(this.centerPadStart);
        gameArea.appendChild(this.leftPad);
        gameArea.appendChild(this.rightPad);
    }
    static createButtonsCross(g, buttons) {
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
                    JoypadController.prepareActionListeners(g, sp);
                }
                else {
                    cell.innerHTML = "&nbsp;";
                }
            }
        }
        return table;
    }
    static repositionJoypad(g, canvas) {
        // position buttons according to game area
        let rect = canvas.getBoundingClientRect();
        let rem1 = (0, main_1.gGetPixelsFromRem)(1);
        (0, main_1.gPrint)(rect.top, rect.left, rect.bottom, rect.right);
        this.centerPadStart.style.left = `${rect.right + rem1}px`;
        this.centerPadSelect.style.right = `${rect.right + rem1}px`;
        switch (g.orientation) {
            case main_1.ORIENTATION_PORTRAIT:
                this.leftPad.style.top = `${rect.bottom + rem1}px`;
                this.leftPad.style.left = `${rem1}px`;
                this.rightPad.style.top = `${rect.bottom + rem1}px`;
                this.rightPad.style.right = `${rem1}px`;
                this.centerPadStart.style.left = `${window.innerWidth / 2 + rem1}px`;
                this.centerPadSelect.style.right = `${window.innerWidth / 2 + rem1}px`;
                this.centerPadStart.style.top = `${rect.bottom + (window.innerHeight - rect.bottom) / 2 + rem1}px`;
                this.centerPadSelect.style.top = `${rect.bottom + (window.innerHeight - rect.bottom) / 2 + rem1}px`;
                break;
            case main_1.ORIENTATION_LANDSCAPE:
                this.leftPad.style.bottom = `${(0, main_1.gGetPixelsFromRem)(4)}px`;
                this.rightPad.style.bottom = `${(0, main_1.gGetPixelsFromRem)(4)}px`;
                this.centerPadStart.style.bottom = `${rem1}px`;
                this.centerPadSelect.style.bottom = `${rem1}px`;
                break;
            case main_1.ORIENTATION_DESKTOP:
                let botMargin = window.innerHeight - rect.bottom;
                this.leftPad.style.top = `${rect.bottom / 2}px`;
                this.rightPad.style.top = `${rect.bottom / 2}px`;
                this.centerPadStart.style.bottom = `${botMargin}px`;
                this.centerPadSelect.style.bottom = `${botMargin}px`;
                break;
        }
    }
    static prepareActionListeners(g, elem) {
        elem.addEventListener("mousedown", (e) => {
            JoypadController.onScreenKeyPress(g, e);
        });
        elem.addEventListener("mouseup", (e) => {
            JoypadController.onScreenKeyRelease(g, e);
        });
        elem.addEventListener("touchstart", (e) => {
            window.setTimeout(() => {
                JoypadController.onScreenKeyPress(g, e);
            }, 100);
        });
        elem.addEventListener("touchend", (e) => {
            JoypadController.onScreenKeyRelease(g, e);
        });
        elem.addEventListener("touchmove", (e) => {
            // absorb touch moved event
        });
    }
    static onScreenKeyPress(g, e) {
        let button = e.target;
        if (button.classList.contains("active"))
            return;
        let jkey = parseInt(button.id.slice(7));
        if (jkey) {
            g.key = String.fromCharCode(jkey);
            g.keyCode = jkey;
            g.joypad.pressJoypadKey(g);
            (0, main_1.gPrint)("Pressed: " + g.getKeyString());
            button.classList.add("active");
        }
    }
    static onScreenKeyRelease(g, e) {
        let button = e.target;
        if (!button.classList.contains("active"))
            return;
        let jkey = button.id.slice(7);
        if (jkey) {
            (0, main_1.gPrint)("Released: " + g.getKeyString());
            g.joypad.releaseJoypadKey(g);
            g.key = "";
            g.keyCode = 0;
            button.classList.remove("active");
        }
    }
    static deployControlsTable() {
        let keyset = exports.JOYPAD_KEYS;
        let table = document.createElement("table");
        table.id = "controls";
        let header = table.createTHead();
        let headerCell = header.insertRow(0).insertCell(0);
        headerCell.colSpan = keyset.length + 1;
        headerCell.innerHTML = "<h1><em>Controls</em></h1>";
        for (let i = 0; i < 2; i++) {
            keyset = i % 2 == 0 ? exports.JOYPAD_KEYS : exports.KEYBOARD_KEYS;
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
                }
                else {
                    sp.innerHTML = key;
                    sp.classList.add("key-button");
                }
                cell.appendChild(sp);
            }
        }
        table.classList.add("noselect");
        document.getElementById("game-area").appendChild(table);
    }
}
exports.JoypadController = JoypadController;
JoypadController.leftPadUp = document.createElement("span");
JoypadController.leftPadDown = document.createElement("span");
JoypadController.leftPadLeft = document.createElement("span");
JoypadController.leftPadRight = document.createElement("span");
JoypadController.rightPadX = document.createElement("span");
JoypadController.rightPadB = document.createElement("span");
JoypadController.rightPadY = document.createElement("span");
JoypadController.rightPadA = document.createElement("span");
JoypadController.centerPadStart = document.createElement("span");
JoypadController.centerPadSelect = document.createElement("span");
JoypadController.leftPad = document.createElement("table");
JoypadController.rightPad = document.createElement("table");
JoypadController.buttonPressed = false;
