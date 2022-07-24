import * as P5 from "p5";
import { Stack } from "./stack";
import { TitleScreenState } from "./states/titlescreen";
import { State } from "./states/state";
import { GAME_DATA, GameObject, DEBUG } from "./main";
import { ASCII_KEYS } from "./joypad";
import { Queue } from "./queue";

export class StateMachine implements GameObject {
    states: Stack<State>;

    constructor() {
        this.states = new Stack<State>();
    }

    enterState(state: State) {
        this.states.push(state);
        this.currentState().onEnter();
    }

    currentState(): State {
        if (this.states.peek() !== null) {
            return this.states.peek() as State;
        } else {
            return new TitleScreenState();
        }
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

    stateArray(): State[] {
        return this.states.array;
    }

    update(g: P5) {
        if (!this.states.isEmpty()) {
            for (let s of this.states.array) {
                s.update(g);
            }
        } else {
            this.enterState(new TitleScreenState());
        }
    }

    draw(g: P5): void {
        if (!this.states.isEmpty()) {
            for (let s of this.states.array) {
                s.draw(g);
            }
        }
    }
    resize(g: P5): void {
        for (let s of this.states.array) {
            s.resize(g);
        }
    }

    joypadDown(): void {
        if (DEBUG) {
            if (GAME_DATA.keyCode === ASCII_KEYS.backspace) {
                this.exitState();
            }
        }
    }
    joypadUp(): void {}
}
