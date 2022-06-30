import * as P5 from "p5";
import { Stack } from "./stack";
import { JoypadController } from "./joypad";
import { GameObject } from "./main";
import { print } from "./main";

export interface State extends GameObject {
    onEnter(): void;
    onExit(): void;
}

export abstract class BaseState implements State {
    parent: StateMachine;
    name: string;

    constructor(parent: StateMachine, name: string) {
        this.parent = parent;
        this.name = name;
    }
    abstract update(g: P5): void;

    abstract draw(g: P5): void;

    abstract joypadDown(key: string): void;

    abstract joypadUp(key: string): void;

    onEnter() {
        print(`State "${this.name}" entered`);
    }

    onExit() {
        print(`State "${this.name}" exited`);
    }

    toString(): string {
        return this.name;
    }
}

export class StateMachine {
    states: Stack<State>;
    joypad: JoypadController;

    constructor(g: P5) {
        this.states = new Stack<State>();
        this.joypad = new JoypadController(this);
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

    update(g: P5) {
        this.joypad.update(g);
        this.currentState().update(g);
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
