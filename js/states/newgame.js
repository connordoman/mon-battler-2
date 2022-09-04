"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewGameState = exports.PHASE_OVERWORLD = exports.PHASE_ANY_KEY = exports.PHASE_NEW_GAME = exports.PHASE_FADE_IN = exports.EN_ANY_KEY = exports.EN_NEW_GAME = void 0;
const main_1 = require("../main");
const state_1 = require("./state");
const textbox_1 = require("./textbox");
const Color = require("../color");
const overworld_1 = require("./overworld");
const fade_1 = require("./fade");
exports.EN_NEW_GAME = "Hello! It's nice to see you. Welcome to the world of monster battling. We are going to start you off with a new game.";
exports.EN_ANY_KEY = "Press any key to continue...";
exports.PHASE_FADE_IN = 0;
exports.PHASE_NEW_GAME = 1;
exports.PHASE_ANY_KEY = 2;
exports.PHASE_OVERWORLD = 3;
class NewGameState extends state_1.BaseState {
    constructor(g) {
        super();
        this.name = "NewGameState";
        let boxHeight = (0, main_1.HEIGHT)() / 4;
        this.textbox = new textbox_1.TextBox(g, exports.EN_NEW_GAME, 0, (0, main_1.HEIGHT)() - boxHeight, (0, main_1.WIDTH)(), boxHeight);
        this.textbox.static = false;
    }
    init(g) { }
    update(g) {
        this.timer++;
        this.advancePhase(g);
        switch (this.phase) {
            case this.lastPhase:
                break;
            case exports.PHASE_FADE_IN:
                g.stateMachine.enterState(new fade_1.FadeInState(this));
                this.setNextPhase(exports.PHASE_NEW_GAME);
                break;
            case exports.PHASE_NEW_GAME:
                // Welcome message
                if (this.timer === 120 && !this.textbox.seen) {
                    g.stateMachine.enterState(new textbox_1.TextBoxState(g, this.textbox));
                    this.setNextPhase(exports.PHASE_ANY_KEY);
                }
                break;
            case exports.PHASE_ANY_KEY:
                // Press any key to continue
                if (!this.textbox.seen) {
                    this.textbox.reset(exports.EN_ANY_KEY);
                    let boxHeight = (0, main_1.HEIGHT)() / 4;
                    this.textbox = new textbox_1.PressAnyKeyTextbox(g, 0, (0, main_1.HEIGHT)() - boxHeight, (0, main_1.WIDTH)(), boxHeight);
                    g.stateMachine.enterState(new textbox_1.PressAnyKeyTextBoxState(g, this.textbox));
                    this.setNextPhase(exports.PHASE_OVERWORLD);
                }
                break;
            case exports.PHASE_OVERWORLD:
                // Exit state
                //if (this.timer === 60) {
                g.stateMachine.exitState();
                g.stateMachine.enterState(new overworld_1.OverworldState(g.map));
            //}
            default:
                break;
        }
    }
    draw(g) {
        g.p.background(g.p.color(Color.DARK_RED));
    }
    resize(g) {
        this.textbox.x = 0;
        this.textbox.y = (0, main_1.HEIGHT)() - this.textbox.height;
    }
    joypadDown() { }
    joypadUp() { }
}
exports.NewGameState = NewGameState;
