import * as P5 from "p5";
import { DEBUG, WIDTH, HEIGHT, gPrint, GameData } from "../main";
import { MainMenuState } from "./mainmenu";
import { BaseState } from "./state";

export class TitleScreenState extends BaseState {
    name: string;

    constructor() {
        super();
        this.name = "TitleScreenState";
    }

    init(g: GameData): void {}
    draw(g: GameData) {
        g.p.background(0);
        g.p.fill(255);
        g.p.textSize(g.textSize * 2);
        g.p.textAlign(g.p.CENTER, g.p.CENTER);
        g.p.text("MONSTER BATTLER", g.p.width / 2, g.p.height / 2);

        if (this.timer % 60 < 30) {
            g.p.textSize(g.textSize);
            g.p.text("Press A to start", g.p.width / 2, g.p.height * 0.75);
        }
        this.timer++;

        if (DEBUG) {
            g.p.push();
            g.p.strokeWeight(1);
            g.p.stroke(255, 0, 0);
            g.p.line(WIDTH() / 2, 0, WIDTH() / 2, HEIGHT());
            g.p.line(0, HEIGHT() / 2, WIDTH(), HEIGHT() / 2);
            g.p.pop();
        }
    }

    resize(g: GameData): void {}
    joypadDown(g: GameData) {
        gPrint("Checking buttons on title screen...");
        if ((g.joypad.state.A || g.joypad.state.B || g.joypad.state.START) === true) {
            g.stateMachine.exitState();
            g.stateMachine.enterState(new MainMenuState(g));
        }
    }
    update(g: GameData): void {}
    joypadUp(g: GameData): void {}
}
