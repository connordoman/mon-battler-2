"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SplashScreenState = void 0;
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
    init(g) { }
    update(g) {
        this.timer++;
        this.advancePhase(g);
        switch (this.phase) {
            case this.lastPhase:
                break;
            case 0:
                g.stateMachine.enterState(new fade_1.FadeInState(this));
                this.setNextPhase(1);
                break;
            case 1:
                if (this.timer === 120) {
                    g.stateMachine.enterState(new fade_1.FadeOutState(new titlescreen_1.TitleScreenState()));
                    this.setNextPhase(2);
                }
                break;
            case 2:
                //g.stateMachine.exitState();
                //g.stateMachine.enterState(new TitleScreenState());
                //g.fill(Color.BLACK);
                // g.rect(0, 0, WIDTH(), HEIGHT());
                //alert("pause");
                break;
        }
    }
    draw(g) {
        g.p.background(0);
        if (this.phase !== 2) {
            g.p.fill(255);
            g.p.textSize(g.textSize);
            g.p.textAlign(g.p.CENTER, g.p.CENTER);
            g.p.text("©2022 Connor Doman", g.p.width / 2, g.p.height / 2);
        }
    }
    resize(g) { }
    joypadDown(g) {
        //super.keyPressed(key);
        g.stateMachine.exitState();
        g.stateMachine.enterState(new titlescreen_1.TitleScreenState());
    }
    joypadUp() { }
}
exports.SplashScreenState = SplashScreenState;
