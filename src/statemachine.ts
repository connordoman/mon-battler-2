import * as P5 from "p5";
import { Stack } from "./stack";
import { TitleScreenState } from "./states/titlescreen";
import { State } from "./states/state";
import { GameObject, DEBUG, gPrint, GameData } from "./main";
import { ASCII_KEYS } from "./joypad";
import { Queue } from "./queue";
import { FadeState } from "./states/fade";

export class StateMachine implements GameObject {
    states: Stack<State>;

    constructor() {
        this.states = new Stack<State>();
    }

    get fading(): boolean {
        return this.currentState() instanceof FadeState;
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

    exitState(into?: State) {
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

    stateArray(): State[] {
        return this.states.array;
    }

    update(g: GameData) {
        if (!this.states.isEmpty()) {
            let arr = this.states.array;
            for (let s = 0; s < arr.length; s++) {
                if (this.fading && s === arr.length - 2) {
                    continue;
                }
                arr[s].update(g);
            }
        } else {
            //this.enterState(new TitleScreenState());
        }
    }

    draw(g: GameData): void {
        if (!this.states.isEmpty()) {
            for (let s of this.states.array) {
                s.draw(g);
            }
        }
    }
    resize(g: GameData): void {
        for (let s of this.states.array) {
            s.resize(g);
        }
    }

    joypadDown(g: GameData): void {
        if (DEBUG) {
            if (g.keyCode === ASCII_KEYS.backspace) {
                this.exitState();
            }
        }
    }
    joypadUp(): void {}
}
