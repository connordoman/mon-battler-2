import * as P5 from "p5";
import { MainMenuState } from "./mainmenu";
import { StateMachine, BaseState } from "./state";

export class TitleScreenState extends BaseState {
    timer: number = 0;

    constructor(parent: StateMachine) {
        super(parent, "TitleScreenState");
        this.timer = 0;
    }

    update(g: P5) {
        super.update(g);

        g.background(0);
        g.fill(255);
        g.textSize(32);
        g.textAlign(g.CENTER, g.CENTER);
        g.text("MONSTER BATTLER", g.width / 2, g.height / 2);

        if (this.timer % 60 < 30) {
            g.textSize(16);
            g.text("Press A to start", g.width / 2, g.height * 0.75);
        }
        this.timer++;
    }

    joypadDown() {
        super.joypadDown();
        console.log("Checking buttons on title screen...");
        if (
            (this.parent.joypad.state.A ||
                this.parent.joypad.state.B ||
                this.parent.joypad.state.START) === true
        ) {
            this.parent.exit();
            this.parent.enter(new MainMenuState(this.parent));
        }
    }
}
