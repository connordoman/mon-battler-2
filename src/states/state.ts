import * as P5 from "p5";
import { GameData, GameObject, gPrint } from "../main";

export interface State extends GameObject {
    name: string;
    phase: number;
    lastPhase: number;
    timer: number;
    onEnter(): void;
    onExit(): void;
}

export abstract class BaseState implements State {
    abstract name: string;
    phase: number;
    lastPhase: number;
    nextPhase: number;
    timer: number;

    constructor() {
        this.phase = -1;
        this.lastPhase = -1;
        this.nextPhase = 0;
        this.timer = 0;
    }

    abstract init(g: GameData): void;

    abstract update(g: GameData): void;

    abstract draw(g: GameData): void;

    abstract resize(g: GameData): void;

    abstract joypadDown(g: GameData): void;

    abstract joypadUp(g: GameData): void;

    onEnter() {
        gPrint(`State "${this.name}" entered`);
    }

    onExit() {
        gPrint(`State "${this.name}" exited`);
    }

    setNextPhase(phase: number): void {
        this.lastPhase = this.phase;
        this.nextPhase = phase;
    }

    setPhase(): void {
        this.phase = this.nextPhase;
    }

    advancePhase(g: GameData): boolean {
        if (this.lastPhase === this.phase && g.stateMachine.currentState() === this) {
            this.setPhase();
            this.timer = 0;
            return true;
        }
        return false;
    }

    toString(): string {
        return this.name;
    }
}
