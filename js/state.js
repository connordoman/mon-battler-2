"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StateMachine = exports.BaseState = void 0;
const stack_1 = require("./stack");
const joypad_1 = require("./joypad");
const main_1 = require("./main");
class BaseState {
    constructor(parent, name) {
        this.parent = parent;
        this.name = name;
    }
    onEnter() {
        (0, main_1.print)(`State "${this.name}" entered`);
    }
    onExit() {
        (0, main_1.print)(`State "${this.name}" exited`);
    }
    toString() {
        return this.name;
    }
}
exports.BaseState = BaseState;
class StateMachine {
    constructor(g) {
        this.states = new stack_1.Stack();
        this.joypad = new joypad_1.JoypadController(this);
    }
    enterState(state) {
        this.states.push(state);
        this.currentState().onEnter();
    }
    currentState() {
        return this.states.peek();
    }
    exitState() {
        if (!this.states.isEmpty()) {
            this.currentState().onExit();
            this.states.pop();
        }
    }
    update(g) {
        this.joypad.update(g);
        this.currentState().update(g);
    }
    noStates() {
        return this.states.isEmpty();
    }
    draw(g) {
        if (!this.states.isEmpty()) {
            this.currentState().draw(g);
        }
    }
    keyPressed(key) {
        if (!this.noStates()) {
            this.joypad.pressJoypadKey(key);
        }
    }
    keyReleased(key) {
        if (!this.noStates()) {
            this.joypad.releaseJoypadKey(key);
        }
    }
}
exports.StateMachine = StateMachine;
