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
    draw(g) {
        g.background(0);
        g.fill(255);
        g.textSize(main_1.GAME_DATA.textSize * 2);
        g.textAlign(g.CENTER, g.CENTER);
        g.text("MONSTER BATTLER", g.width / 2, g.height / 2);
        if (this.timer % 60 < 30) {
            g.textSize(main_1.GAME_DATA.textSize);
            g.text("Press A to start", g.width / 2, g.height * 0.75);
        }
        this.timer++;
        if (main_1.DEBUG) {
            g.push();
            g.strokeWeight(1);
            g.stroke(255, 0, 0);
            g.line((0, main_1.WIDTH)() / 2, 0, (0, main_1.WIDTH)() / 2, (0, main_1.HEIGHT)());
            g.line(0, (0, main_1.HEIGHT)() / 2, (0, main_1.WIDTH)(), (0, main_1.HEIGHT)() / 2);
            g.pop();
        }
    }
    resize(g) { }
    joypadDown(key) {
        (0, main_1.gPrint)("Checking buttons on title screen...");
        if ((main_1.GAME_DATA.joypad.state.A || main_1.GAME_DATA.joypad.state.B || main_1.GAME_DATA.joypad.state.START) === true) {
            main_1.GAME_DATA.stateMachine.exitState();
            main_1.GAME_DATA.stateMachine.enterState(new mainmenu_1.MainMenuState());
        }
    }
    update(g) { }
    joypadUp(key) { }
}
exports.TitleScreenState = TitleScreenState;
