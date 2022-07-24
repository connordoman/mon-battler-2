"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MainMenuState = void 0;
const main_1 = require("../main");
const state_1 = require("./state");
const titlescreen_1 = require("./titlescreen");
const geometry_1 = require("../geometry");
const textbox_1 = require("./textbox");
const newgame_1 = require("./newgame");
const Color = require("../color");
class MainMenuState extends state_1.BaseState {
    constructor() {
        super();
        this.name = "MainMenuState";
        this.option = 0;
        this.pointer = new geometry_1.Triangle(0, 0, 8 * main_1.pixelWidth);
        this.pointer.setAngle(Math.PI / 2);
        this.pointer.color = Color.BLACK;
        this.newGameBox = new textbox_1.TextBox("New Game", 0, 0, (0, main_1.WIDTH)(), main_1.GAME_DATA.tileHeight * 2);
        (0, main_1.gPrint)(this.newGameBox.msg.indexOf("\n"));
        this.continueBox = new textbox_1.TextBox("Continue", 0, this.newGameBox.height, (0, main_1.WIDTH)(), this.newGameBox.height);
        this.settingsBox = new textbox_1.TextBox("Settings", 0, this.continueBox.height + this.continueBox.y, (0, main_1.WIDTH)(), this.continueBox.height);
        this.newGameBox.static = true;
        this.continueBox.static = true;
        this.settingsBox.static = true;
    }
    draw(g) {
        g.background(0);
        g.fill(255);
        g.textSize(32);
        this.newGameBox.update(g);
        this.continueBox.update(g);
        this.settingsBox.update(g);
        this.newGameBox.draw(g);
        this.continueBox.draw(g);
        this.settingsBox.draw(g);
        let offset = main_1.GAME_DATA.tileHeight;
        let arrowX = offset / 2;
        let arrowY = 0;
        switch (this.option) {
            case 0:
                arrowY = this.newGameBox.y + this.newGameBox.height / 2;
                break;
            case 1:
                arrowY = this.continueBox.y + this.continueBox.height / 2;
                break;
            case 2:
                arrowY = this.settingsBox.y + this.settingsBox.height / 2;
                break;
            default:
                break;
        }
        this.pointer.position = new geometry_1.Vector(arrowX, arrowY);
        this.pointer.draw(g);
    }
    joypadDown() {
        if (main_1.GAME_DATA.joypad.state.DOWN && this.option < 2) {
            this.option++;
        }
        if (main_1.GAME_DATA.joypad.state.UP && this.option > 0) {
            this.option--;
        }
        if (main_1.GAME_DATA.joypad.state.A) {
            switch (this.option) {
                case 0:
                    // New Game
                    main_1.GAME_DATA.stateMachine.exitState();
                    main_1.GAME_DATA.stateMachine.enterState(new newgame_1.NewGameState());
                    break;
                case 1:
                    // Continue
                    // this.parent.exitState();
                    break;
                case 2:
                    // Settings
                    // this.parent.exitState();
                    break;
                default:
                    break;
            }
        }
        if (main_1.GAME_DATA.joypad.state.B) {
            main_1.GAME_DATA.stateMachine.exitState();
            main_1.GAME_DATA.stateMachine.enterState(new titlescreen_1.TitleScreenState());
        }
    }
    resize(g) {
        this.newGameBox.resize();
        this.continueBox.resize();
        this.settingsBox.resize();
        this.pointer.setSize(8 * main_1.pixelWidth);
    }
    update(g) { }
    joypadUp() { }
}
exports.MainMenuState = MainMenuState;
