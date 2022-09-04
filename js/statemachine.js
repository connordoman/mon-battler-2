"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StateMachine = void 0;
const stack_1 = require("./stack");
const titlescreen_1 = require("./states/titlescreen");
const main_1 = require("./main");
const joypad_1 = require("./joypad");
const fade_1 = require("./states/fade");
class StateMachine {
    constructor() {
        this.states = new stack_1.Stack();
    }
    get fading() {
        return this.currentState() instanceof fade_1.FadeState;
    }
    enterState(state) {
        this.states.push(state);
        this.currentState().onEnter();
    }
    currentState() {
        if (this.states.peek() !== null) {
            return this.states.peek();
        }
        else {
            return new titlescreen_1.TitleScreenState();
        }
    }
    exitState(into) {
        if (!this.states.isEmpty()) {
            this.currentState().onExit();
            this.states.pop();
            if (into) {
                this.enterState(into);
            }
        }
    }
    noStates() {
        return this.states.isEmpty();
    }
    stateArray() {
        return this.states.array;
    }
    update(g) {
        if (!this.states.isEmpty()) {
            let arr = this.states.array;
            for (let s = 0; s < arr.length; s++) {
                if (this.fading && s === arr.length - 2) {
                    continue;
                }
                arr[s].update(g);
            }
        }
        else {
            //this.enterState(new TitleScreenState());
        }
    }
    draw(g) {
        if (!this.states.isEmpty()) {
            for (let s of this.states.array) {
                s.draw(g);
            }
        }
    }
    resize(g) {
        for (let s of this.states.array) {
            s.resize(g);
        }
    }
    joypadDown(g) {
        if (main_1.DEBUG) {
            if (g.keyCode === joypad_1.ASCII_KEYS.backspace) {
                this.exitState();
            }
        }
    }
    joypadUp() { }
}
exports.StateMachine = StateMachine;
