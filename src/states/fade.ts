import * as P5 from "p5";
import { GameData, GameObject, gPrint, HEIGHT, WIDTH } from "../main";
import { Rectangle } from "../geometry";
import { BaseState, State } from "./state";
import * as Color from "../color";
import * as Functions from "../functions";

export abstract class FadeState extends BaseState {
    abstract name: string;
    abstract fadeOutState: boolean;
    fadeSlate: Rectangle;
    duration: number;
    into: State;

    constructor(into: State, color?: Color.Color) {
        super();
        this.into = into;
        this.fadeSlate = new Rectangle(0, 0, WIDTH(), HEIGHT());
        if (color) {
            this.fadeSlate.color = color;
        } else {
            this.fadeSlate.color = Color.BLACK;
        }
        this.duration = 60;
    }

    get amt(): number {
        return this.timer / this.duration;
    }

    init(g: GameData) {}

    update(g: GameData): void {
        if (this.timer % 3 == 0) {
            let sig;
            if (this.fadeOutState) {
                // fade out
                sig = Functions.fadeUpSigmoid(this.amt);
            } else {
                // fade in
                sig = Functions.fadeDownSigmoid(this.amt);
            }
            this.fadeSlate.color[3] = g.p.map(sig, 0, 1, 0, 255);
            //gPrint(`${this.name}: ${this.fadeSlate.color[3] / 255}, ${this.fadeUpState}`);
        }
        if (this.timer >= this.duration) {
            if (this.fadeOutState) {
                // this is fade out
                g.stateMachine.exitState(); // exit fade
                g.stateMachine.exitState(); // exit underlying state
                g.stateMachine.enterState(this.into); // enter new state
                //g.stateMachine.exitState();
            } else {
                // this is fade in
                g.stateMachine.exitState();
                // g.stateMachine.enterState(this.into);
            }
        }

        this.timer++;
        this.fadeSlate.update(g);
    }
    draw(g: GameData): void {
        this.fadeSlate.draw(g);
    }
    resize(g: GameData): void {}
    joypadDown(g: GameData): void {}
    joypadUp(g: GameData): void {}
}

export class FadeInState extends FadeState {
    name: string;
    fadeOutState: boolean;

    constructor(into: State, color?: Color.Color) {
        super(into, color);
        this.name = "FadeInState";
        this.fadeOutState = false;
    }
}
export class FadeOutState extends FadeState {
    name: string;
    fadeOutState: boolean;

    constructor(into: State, color?: Color.Color) {
        super(into, color);
        this.name = "FadeOutState";
        this.fadeOutState = true;
    }
}
