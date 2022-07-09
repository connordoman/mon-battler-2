import * as P5 from "p5";
import { Stack } from "./stack";
import { JoypadController } from "./joypad";
import { TitleScreenState } from "./titlescreen";
import { State } from "./state";

export class StateMachine {
    states: Stack<State>;
    joypad: JoypadController;
    defaultTitleScreen: TitleScreenState;

    constructor(g: P5) {
        this.states = new Stack<State>();
        this.joypad = new JoypadController(this);
        this.defaultTitleScreen = new TitleScreenState(this);
    }

    enterState(state: State) {
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

    update(g: P5) {
        if (!this.states.isEmpty()) {
            this.joypad.update(g);
            this.currentState().update(g);
        }
    }

    noStates() {
        return this.states.isEmpty();
    }

    draw(g: P5): void {
        if (!this.states.isEmpty()) {
            this.currentState().draw(g);
        }
    }

    keyPressed(key: string) {
        if (!this.noStates()) {
            this.joypad.pressJoypadKey(key);
        }
    }

    keyReleased(key: string) {
        if (!this.noStates()) {
            this.joypad.releaseJoypadKey(key);
        }
    }
}
