"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TitleScreenState = void 0;
const mainmenu_1 = require("./mainmenu");
const state_1 = require("./state");
class TitleScreenState extends state_1.BaseState {
    constructor(parent) {
        super(parent, "TitleScreenState");
        this.timer = 0;
        this.timer = 0;
    }
    draw(g) {
        super.draw(g);
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
        if ((this.parent.joypad.state.A ||
            this.parent.joypad.state.B ||
            this.parent.joypad.state.START) === true) {
            this.parent.exit();
            this.parent.enter(new mainmenu_1.MainMenuState(this.parent));
        }
    }
}
exports.TitleScreenState = TitleScreenState;
