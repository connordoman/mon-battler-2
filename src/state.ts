import * as P5 from "p5";
import { Stack } from "./stack";
import { JoypadController } from "./joypad";

export interface State {
    onEnter(): void;
    onExit(): void;
    draw(g: P5): void;
    joypadDown(): void;
    joypadUp(): void;
}

export abstract class BaseState implements State {
    parent: StateMachine;
    name: string;

    constructor(parent: StateMachine, name: string) {
        this.parent = parent;
        this.name = name;
    }

    joypadDown(): void {}

    joypadUp(): void {}

    onEnter() {
        console.log(`State "${this.name}" entered`);
    }

    onExit() {
        console.log(`State "${this.name}" exited`);
    }

    draw(g: P5) {}
}

export class StateMachine {
    g: P5;
    states: Stack<State>;
    joypad: JoypadController;

    constructor(g: P5) {
        this.g = g;
        this.states = new Stack<State>();
        this.joypad = new JoypadController(this);
    }

    enter(state: State) {
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
