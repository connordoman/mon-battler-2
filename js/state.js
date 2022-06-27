"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StateMachine = exports.BaseState = void 0;
const stack_1 = require("./stack");
const joypad_1 = require("./joypad");
class BaseState {
    constructor(parent, name) {
        this.parent = parent;
        this.name = name;
    }
    joypadDown() { }
    joypadUp() { }
    onEnter() {
        console.log(`State "${this.name}" entered`);
    }
    onExit() {
        console.log(`State "${this.name}" exited`);
    }
    draw(g) { }
}
exports.BaseState = BaseState;
class StateMachine {
    constructor(g) {
        this.g = g;
        this.states = new stack_1.Stack();
        this.joypad = new joypad_1.JoypadController(this);
    }
    enter(state) {
        this.states.push(state);
        this.currentState().onEnter();
    }
    currentState() {
        return this.states.peek();
    }
    exit() {
        if (!this.states.isEmpty()) {
            this.currentState().onExit();
            this.states.pop();
        }
    }
    update() {
        if (!this.states.isEmpty()) {
            this.currentState().draw(this.g);
        }
        this.joypad.update(this.g);
    }
    noStates() {
        return this.states.isEmpty();
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
