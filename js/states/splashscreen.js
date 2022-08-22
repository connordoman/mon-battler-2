"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SplashScreenState = void 0;
const main_1 = require("../main");
const fade_1 = require("./fade");
const state_1 = require("./state");
const titlescreen_1 = require("./titlescreen");
class SplashScreenState extends state_1.BaseState {
    constructor() {
        super();
        this.timer = 0;
        this.name = "SplashScreenState";
        this.timer = 0;
    }
    update(g) {
        this.timer++;
        this.advancePhase();
        switch (this.phase) {
            case this.lastPhase:
                break;
            case 0:
                main_1.GAME_DATA.stateMachine.enterState(new fade_1.FadeInState(this));
                this.setNextPhase(1);
                break;
            case 1:
                if (this.timer === 120) {
                    main_1.GAME_DATA.stateMachine.enterState(new fade_1.FadeOutState(new titlescreen_1.TitleScreenState()));
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
    draw(g) {
        g.background(0);
        if (this.phase !== 2) {
            g.fill(255);
            g.textSize(main_1.GAME_DATA.textSize);
            g.textAlign(g.CENTER, g.CENTER);
            g.text("©2022 Connor Doman", g.width / 2, g.height / 2);
        }
    }
    resize(g) { }
    joypadDown() {
        //super.keyPressed(key);
        main_1.GAME_DATA.stateMachine.exitState();
        main_1.GAME_DATA.stateMachine.enterState(new titlescreen_1.TitleScreenState());
    }
    joypadUp() { }
}
exports.SplashScreenState = SplashScreenState;
