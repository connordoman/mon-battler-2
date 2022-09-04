"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TitleScreenState = void 0;
const main_1 = require("../main");
const mainmenu_1 = require("./mainmenu");
const state_1 = require("./state");
class TitleScreenState extends state_1.BaseState {
    constructor() {
        super();
        this.name = "TitleScreenState";
    }
    init(g) { }
    draw(g) {
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
        if (main_1.DEBUG) {
            g.p.push();
            g.p.strokeWeight(1);
            g.p.stroke(255, 0, 0);
            g.p.line((0, main_1.WIDTH)() / 2, 0, (0, main_1.WIDTH)() / 2, (0, main_1.HEIGHT)());
            g.p.line(0, (0, main_1.HEIGHT)() / 2, (0, main_1.WIDTH)(), (0, main_1.HEIGHT)() / 2);
            g.p.pop();
        }
    }
    resize(g) { }
    joypadDown(g) {
        (0, main_1.gPrint)("Checking buttons on title screen...");
        if ((g.joypad.state.A || g.joypad.state.B || g.joypad.state.START) === true) {
            g.stateMachine.exitState();
            g.stateMachine.enterState(new mainmenu_1.MainMenuState(g));
        }
    }
    update(g) { }
    joypadUp(g) { }
}
exports.TitleScreenState = TitleScreenState;
