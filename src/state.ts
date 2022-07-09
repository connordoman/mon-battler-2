import * as P5 from "p5";
import { GameObject } from "./main";
import { gPrint } from "./main";
import { StateMachine } from "./statemachine";

export interface State extends GameObject {
    name: string;
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
        gPrint(`State "${this.name}" entered`);
    }

    onExit() {
        gPrint(`State "${this.name}" exited`);
    }

    toString(): string {
        return this.name;
    }
}
