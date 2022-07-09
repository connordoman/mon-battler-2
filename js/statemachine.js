"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StateMachine = void 0;
const stack_1 = require("./stack");
const titlescreen_1 = require("./states/titlescreen");
const main_1 = require("./main");
const joypad_1 = require("./joypad");
class StateMachine {
    constructor() {
        this.states = new stack_1.Stack();
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
    noStates() {
        return this.states.isEmpty();
    }
    stateArray() {
        return this.states.bottomUp();
    }
    update(g) {
        if (!this.states.isEmpty()) {
            this.currentState().update(g);
        }
        else {
            this.enterState(new titlescreen_1.TitleScreenState());
        }
    }
    draw(g) {
        if (!this.states.isEmpty()) {
            this.currentState().draw(g);
        }
    }
    joypadDown() {
        if (main_1.DEBUG) {
            if (main_1.GAME_DATA.keyCode === joypad_1.ASCII_KEYS.backspace) {
                this.exitState();
            }
        }
    }
    joypadUp() { }
}
exports.StateMachine = StateMachine;
