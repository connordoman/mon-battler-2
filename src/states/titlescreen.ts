import * as P5 from "p5";
import { GAME_DATA, gPrint } from "../main";
import { MainMenuState } from "./mainmenu";
import { BaseState } from "./state";

export class TitleScreenState extends BaseState {
    name: string;

    constructor() {
        super();
        this.name = "TitleScreenState";
    }

    draw(g: P5) {
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

    joypadDown(key: string) {
        gPrint("Checking buttons on title screen...");
        if ((GAME_DATA.joypad.state.A || GAME_DATA.joypad.state.B || GAME_DATA.joypad.state.START) === true) {
            GAME_DATA.stateMachine.exitState();
            GAME_DATA.stateMachine.enterState(new MainMenuState());
        }
    }
    update(g: P5): void {}
    joypadUp(key: string): void {}
}
