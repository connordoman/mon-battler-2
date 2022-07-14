import * as P5 from "p5";
import { GameObject, gPrint } from "../main";

export interface State extends GameObject {
    name: string;
    phase: number;
    timer: number;
    onEnter(): void;
    onExit(): void;
}

export abstract class BaseState implements State {
    abstract name: string;
    phase: number;
    timer: number;

    constructor() {
        this.phase = 0;
        this.timer = 0;
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
