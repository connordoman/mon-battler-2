"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MainMenuState = void 0;
const main_1 = require("./main");
const state_1 = require("./state");
const titlescreen_1 = require("./titlescreen");
const geometry_1 = require("./geometry");
class MainMenuState extends state_1.BaseState {
    constructor(parent) {
        super(parent, "TitleScreenState");
        this.option = 0;
        this.items = ["New Game", "Continue", "Settings"];
        this.pointer = new geometry_1.Triangle(0, 0, 25);
        this.pointer.setAngle(Math.PI / 2);
        this.pointer.color = 255;
    }
    draw(g) {
        super.draw(g);
        g.background(0);
        g.fill(255);
        g.textSize(32);
        let offset = 16 * main_1.PIXEL_HEIGHT;
        let arrowX = offset / 2;
        let arrowY = offset;
        for (let i = 0; i < this.items.length; i++) {
            if (i === this.option) {
                g.textAlign(g.CENTER, g.CENTER);
                arrowX = offset / 2;
                arrowY = offset * (i + 1);
            }
            g.textAlign(g.LEFT);
            g.text(`${this.items[i]}`, offset, offset + i * offset);
        }
        this.pointer.position = new geometry_1.Vector(arrowX, arrowY);
        this.pointer.draw(g);
    }
    joypadDown() {
        if (this.parent.joypad.state.DOWN &&
            this.option < this.items.length - 1) {
            this.option++;
        }
        if (this.parent.joypad.state.UP && this.option > 0) {
            this.option--;
        }
        if (this.parent.joypad.state.B) {
            this.parent.exit();
            this.parent.enter(new titlescreen_1.TitleScreenState(this.parent));
        }
    }
}
exports.MainMenuState = MainMenuState;
