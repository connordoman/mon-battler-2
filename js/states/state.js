"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseState = void 0;
const main_1 = require("../main");
class BaseState {
    constructor() {
        this.phase = -1;
        this.lastPhase = -1;
        this.nextPhase = 0;
        this.timer = 0;
    }
    onEnter() {
        (0, main_1.gPrint)(`State "${this.name}" entered`);
    }
    onExit() {
        (0, main_1.gPrint)(`State "${this.name}" exited`);
    }
    setNextPhase(phase) {
        this.lastPhase = this.phase;
        this.nextPhase = phase;
    }
    setPhase() {
        this.phase = this.nextPhase;
    }
    advancePhase() {
        if (this.lastPhase === this.phase && main_1.GAME_DATA.stateMachine.currentState() === this) {
            this.setPhase();
            this.timer = 0;
            return true;
        }
        return false;
    }
    toString() {
        return this.name;
    }
}
exports.BaseState = BaseState;
