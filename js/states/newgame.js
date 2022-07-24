"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewGameState = exports.EN_CONTINUE = exports.EN_NEW_GAME = void 0;
const main_1 = require("../main");
const state_1 = require("./state");
const textbox_1 = require("./textbox");
const Color = require("../color");
exports.EN_NEW_GAME = "Hello! It's nice to see you. Welcome to the world of monster battling. We are going to start you off with a new game.";
exports.EN_CONTINUE = "Press any key to continue...";
class NewGameState extends state_1.BaseState {
    constructor() {
        super();
        this.name = "NewGameState";
        let boxHeight = (0, main_1.HEIGHT)() / 4;
        this.textbox = new textbox_1.TextBox(exports.EN_NEW_GAME, 0, (0, main_1.HEIGHT)() - boxHeight, (0, main_1.WIDTH)(), boxHeight);
        this.textbox.static = false;
    }
    update(g) {
        this.timer++;
        if (this.lastPhase === this.phase && main_1.GAME_DATA.stateMachine.currentState() === this) {
            this.phase++;
            this.timer = 0;
        }
    }
    draw(g) {
        g.background(g.color(Color.DARK_RED));
        switch (this.phase) {
            case this.lastPhase:
                break;
            case 0:
                // Welcome message
                if (!this.textbox.seen) {
                    main_1.GAME_DATA.stateMachine.enterState(new textbox_1.TextBoxState(this.textbox));
                    this.lastPhase = this.phase;
                }
                break;
            case 1:
                // Press any key to continue
                if (!this.textbox.seen) {
                    this.textbox.reset(exports.EN_CONTINUE);
                    let boxHeight = (0, main_1.HEIGHT)() / 4;
                    this.textbox = new textbox_1.PressAnyKeyTextbox(0, (0, main_1.HEIGHT)() - boxHeight, (0, main_1.WIDTH)(), boxHeight);
                    main_1.GAME_DATA.stateMachine.enterState(new textbox_1.PressAnyKeyTextBoxState(this.textbox));
                    this.lastPhase = this.phase;
                }
                break;
            case 2:
                // Exit state
                if (this.timer === 60) {
                    main_1.GAME_DATA.stateMachine.exitState();
                }
            default:
                break;
        }
    }
    resize(g) {
        this.textbox.x = 0;
        this.textbox.y = (0, main_1.HEIGHT)() - this.textbox.height;
    }
    joypadDown() { }
    joypadUp() { }
}
exports.NewGameState = NewGameState;
