import * as P5 from "p5";
import { Stack } from "./stack";
import { TitleScreenState } from "./states/titlescreen";
import { State } from "./states/state";
import { GAME_DATA, GameObject, DEBUG } from "./main";
import { ASCII_KEYS } from "./joypad";

export class StateMachine implements GameObject {
    states: Stack<State>;

    constructor() {
        this.states = new Stack<State>();
    }

    enterState(state: State) {
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

    stateArray(): State[] {
        return this.states.bottomUp();
    }

    update(g: P5) {
        if (!this.states.isEmpty()) {
            this.currentState().update(g);
        } else {
            this.enterState(new TitleScreenState());
        }
    }

    draw(g: P5): void {
        if (!this.states.isEmpty()) {
            this.currentState().draw(g);
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
