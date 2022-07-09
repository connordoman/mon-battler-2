"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StateMachine = void 0;
const stack_1 = require("./stack");
const joypad_1 = require("./joypad");
const titlescreen_1 = require("./titlescreen");
class StateMachine {
    constructor(g) {
        this.states = new stack_1.Stack();
        this.joypad = new joypad_1.JoypadController(this);
        this.defaultTitleScreen = new titlescreen_1.TitleScreenState(this);
    }
    enterState(state) {
        this.states.push(state);
        this.currentState().onEnter();
    }
    currentState() {
        if (this.states.isEmpty()) {
            // return new TitleScreenState(this); // <- This line is broken
        }
        return this.states.peek();
    }
    exitState() {
        if (!this.states.isEmpty()) {
            this.currentState().onExit();
            this.states.pop();
        }
    }
    update(g) {
        if (!this.states.isEmpty()) {
            this.joypad.update(g);
            this.currentState().update(g);
        }
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
