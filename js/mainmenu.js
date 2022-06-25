"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MainMenuState = void 0;
const main_1 = require("./main");
const state_1 = require("./state");
class MainMenuState extends state_1.BaseState {
    constructor(parent) {
        super(parent, "TitleScreenState");
        this.option = 0;
        this.items = ["New Game", "Continue", "Settings"];
    }
    update(g) {
        super.update(g);
        g.background(0);
        g.fill(255);
        g.textSize(32);
        let offset = 16 * main_1.PIXEL_HEIGHT;
        for (let i = 0; i < this.items.length; i++) {
            if (i === this.option) {
                g.textAlign(g.CENTER, g.CENTER);
                g.text(">", offset / 2, offset * (i + 1));
            }
            g.textAlign(g.LEFT);
            g.text(`${this.items[i]}`, offset, offset + i * offset);
        }
    }
    joypadDown() {
        if (this.parent.joypad.state.DOWN &&
            this.option < this.items.length - 1) {
            this.option++;
        }
        if (this.parent.joypad.state.UP && this.option > 0) {
            this.option--;
        }
    }
}
exports.MainMenuState = MainMenuState;
