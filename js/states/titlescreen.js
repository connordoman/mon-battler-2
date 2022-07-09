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
        (0, main_1.gPrint)("Checking buttons on title screen...");
        if ((main_1.GAME_DATA.joypad.state.A || main_1.GAME_DATA.joypad.state.B || main_1.GAME_DATA.joypad.state.START) === true) {
            main_1.GAME_DATA.stateMachine.exitState();
            main_1.GAME_DATA.stateMachine.enterState(new mainmenu_1.MainMenuState());
        }
    }
    update(g) { }
    joypadUp() { }
}
exports.TitleScreenState = TitleScreenState;
