import * as P5 from "p5";
import { GAME_DATA, HEIGHT, WIDTH } from "../main";
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

    update(g: P5): void {
        this.timer++;

        this.advancePhase();

        switch (this.phase) {
            case this.lastPhase:
                break;
            case 0:
                GAME_DATA.stateMachine.enterState(new FadeInState(this));
                this.setNextPhase(1);
                break;
            case 1:
                if (this.timer === 120) {
                    GAME_DATA.stateMachine.enterState(new FadeOutState(new TitleScreenState()));
                    this.setNextPhase(2);
                }
                break;
            case 2:
                //GAME_DATA.stateMachine.exitState();
                //GAME_DATA.stateMachine.enterState(new TitleScreenState());
                //g.fill(Color.BLACK);
                // g.rect(0, 0, WIDTH(), HEIGHT());
                //alert("pause");
                break;
        }
    }
    draw(g: P5) {
        g.background(0);
        if (this.phase !== 2) {
            g.fill(255);
            g.textSize(GAME_DATA.textSize);
            g.textAlign(g.CENTER, g.CENTER);
            g.text("©2022 Connor Doman", g.width / 2, g.height / 2);
        }
    }
    resize(g: P5): void {}

    joypadDown() {
        //super.keyPressed(key);
        GAME_DATA.stateMachine.exitState();
        GAME_DATA.stateMachine.enterState(new TitleScreenState());
    }
    joypadUp(): void {}
}
