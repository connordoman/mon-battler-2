"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewGameState = exports.EN_CONTINUE = exports.EN_NEW_GAME = void 0;
const main_1 = require("./main");
const state_1 = require("./state");
const textbox_1 = require("./textbox");
const Color = require("./color");
exports.EN_NEW_GAME = "Hello! It's nice to see you. Welcome to the world of monster battling. We are going to start you off with a new game.";
exports.EN_CONTINUE = "Press any key to continue...";
class NewGameState extends state_1.BaseState {
    constructor(parent) {
        super(parent, "NewGameState");
        this.parent = parent;
        let boxHeight = main_1.HEIGHT / 4;
        this.textbox = new textbox_1.TextBox(parent, exports.EN_NEW_GAME, 0, main_1.HEIGHT - boxHeight, main_1.WIDTH, boxHeight);
        this.textbox.static = false;
        this.phase = 0;
    }
    update(g) { }
    draw(g) {
        g.background(g.color(Color.DARK_RED));
        switch (this.phase) {
            case 0:
                // Welcome message
                if (!this.textbox.seen) {
                    this.parent.enterState(new textbox_1.TextBoxState(this.parent, this.textbox));
                }
                this.phase = 1;
                break;
            case 1:
                // Press any key to continue
                this.textbox.reset(exports.EN_CONTINUE);
                if (!this.textbox.seen) {
                    this.parent.enterState(new textbox_1.TextBoxState(this.parent, this.textbox));
                }
                this.phase = 2;
                break;
            case 2:
                // Exit state
                this.parent.exitState();
            default:
                break;
        }
    }
    joypadDown(key) { }
    joypadUp(key) { }
}
exports.NewGameState = NewGameState;
