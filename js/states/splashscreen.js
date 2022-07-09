"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SplashScreenState = void 0;
const main_1 = require("../main");
const state_1 = require("./state");
const titlescreen_1 = require("./titlescreen");
class SplashScreenState extends state_1.BaseState {
    constructor() {
        super();
        this.timer = 0;
        this.name = "SplashScreenState";
        this.timer = 0;
    }
    update(g) { }
    draw(g) {
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
        //super.keyPressed(key);
        main_1.GAME_DATA.stateMachine.exitState();
        main_1.GAME_DATA.stateMachine.enterState(new titlescreen_1.TitleScreenState());
    }
    joypadUp() { }
}
exports.SplashScreenState = SplashScreenState;
