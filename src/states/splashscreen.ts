import * as P5 from "p5";
import { GAME_DATA } from "../main";
import { BaseState } from "./state";
import { TitleScreenState } from "./titlescreen";

export class SplashScreenState extends BaseState {
    name: string;
    timer: number = 0;

    constructor() {
        super();
        this.name = "SplashScreenState";

        this.timer = 0;
    }

    update(g: P5): void {}
    draw(g: P5) {
        g.background(0);
        if (this.timer % 60 < 30) {
            g.fill(255);
            g.textSize(32);
            g.textAlign(g.CENTER, g.CENTER);
            g.text("Press any key to start", g.width / 2, g.height / 2);
        }
        this.timer++;
    }
    resize(g: P5): void {}

    joypadDown() {
        //super.keyPressed(key);
        GAME_DATA.stateMachine.exitState();
        GAME_DATA.stateMachine.enterState(new TitleScreenState());
    }
    joypadUp(): void {}
}
