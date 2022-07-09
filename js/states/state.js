"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseState = void 0;
const main_1 = require("../main");
class BaseState {
    constructor() {
        this.phase = 0;
        this.timer = 0;
    }
    onEnter() {
        (0, main_1.gPrint)(`State "${this.name}" entered`);
    }
    onExit() {
        (0, main_1.gPrint)(`State "${this.name}" exited`);
    }
    toString() {
        return this.name;
    }
}
exports.BaseState = BaseState;
