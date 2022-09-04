import * as P5 from "p5";
import { GameData, HEIGHT, WIDTH } from "../main";
import { FadeInState, FadeOutState } from "./fade";
import { BaseState } from "./state";
import { TitleScreenState } from "./titlescreen";
import * as Color from "../color";

export class SplashScreenState extends BaseState {
    name: string;
    timer: number = 0;

    constructor() {
        super();
        this.name = "SplashScreenState";

        this.timer = 0;
    }
    init(g: GameData) {}

    update(g: GameData): void {
        this.timer++;

        this.advancePhase(g);

        switch (this.phase) {
            case this.lastPhase:
                break;
            case 0:
                g.stateMachine.enterState(new FadeInState(this));
                this.setNextPhase(1);
                break;
            case 1:
                if (this.timer === 120) {
                    g.stateMachine.enterState(new FadeOutState(new TitleScreenState()));
                    this.setNextPhase(2);
                }
                break;
            case 2:
                //g.stateMachine.exitState();
                //g.stateMachine.enterState(new TitleScreenState());
                //g.fill(Color.BLACK);
                // g.rect(0, 0, WIDTH(), HEIGHT());
                //alert("pause");
                break;
        }
    }
    draw(g: GameData) {
        g.p.background(0);
        if (this.phase !== 2) {
            g.p.fill(255);
            g.p.textSize(g.textSize);
            g.p.textAlign(g.p.CENTER, g.p.CENTER);
            g.p.text("©2022 Connor Doman", g.p.width / 2, g.p.height / 2);
        }
    }
    resize(g: GameData): void {}

    joypadDown(g: GameData) {
        //super.keyPressed(key);
        g.stateMachine.exitState();
        g.stateMachine.enterState(new TitleScreenState());
    }
    joypadUp(): void {}
}
