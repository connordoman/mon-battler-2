import * as P5 from "p5";
import { StateMachine, BaseState } from "./state";
import { TitleScreenState } from "./titlescreen";

export class SplashScreenState extends BaseState {
    timer: number = 0;

    constructor(parent: StateMachine) {
        super(parent, "SplashScreenState");
        this.timer = 0;
    }

    draw(g: P5) {
        super.draw(g);

        g.background(0);
        if (this.timer % 60 < 30) {
            g.fill(255);
            g.textSize(32);
            g.textAlign(g.CENTER, g.CENTER);
            g.text("Press any key to start", g.width / 2, g.height / 2);
        }
        this.timer++;
    }

    joypadDown() {
        super.joypadDown();
        //super.keyPressed(key);
        this.parent.exit();
        this.parent.enter(new TitleScreenState(this.parent));
    }
}
