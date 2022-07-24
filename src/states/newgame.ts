import * as P5 from "p5";
import { GAME_DATA, WIDTH, HEIGHT } from "../main";
import { BaseState } from "./state";
import { PressAnyKeyTextbox, TextBox, TextBoxState, PressAnyKeyTextBoxState } from "./textbox";
import * as Color from "../color";
import { getTextOfJSDocComment } from "typescript";

export const EN_NEW_GAME =
    "Hello! It's nice to see you. Welcome to the world of monster battling. We are going to start you off with a new game.";
export const EN_CONTINUE = "Press any key to continue...";

export class NewGameState extends BaseState {
    name: string;
    textbox: TextBox;

    constructor() {
        super();
        this.name = "NewGameState";
        let boxHeight = HEIGHT() / 4;
        this.textbox = new TextBox(EN_NEW_GAME, 0, HEIGHT() - boxHeight, WIDTH(), boxHeight);
        this.textbox.static = false;
    }
    update(g: P5): void {
        this.timer++;

        if (this.lastPhase === this.phase && GAME_DATA.stateMachine.currentState() === this) {
            this.phase++;
            this.timer = 0;
        }
    }

    draw(g: P5): void {
        g.background(g.color(Color.DARK_RED));

        switch (this.phase) {
            case this.lastPhase:
                break;
            case 0:
                // Welcome message
                if (!this.textbox.seen) {
                    GAME_DATA.stateMachine.enterState(new TextBoxState(this.textbox));
                    this.lastPhase = this.phase;
                }
                break;
            case 1:
                // Press any key to continue
                if (!this.textbox.seen) {
                    this.textbox.reset(EN_CONTINUE);
                    let boxHeight = HEIGHT() / 4;
                    this.textbox = new PressAnyKeyTextbox(0, HEIGHT() - boxHeight, WIDTH(), boxHeight);
                    GAME_DATA.stateMachine.enterState(new PressAnyKeyTextBoxState(this.textbox));
                    this.lastPhase = this.phase;
                }
                break;
            case 2:
                // Exit state
                if (this.timer === 60) {
                    GAME_DATA.stateMachine.exitState();
                }
            default:
                break;
        }
    }
    resize(g: P5): void {
        this.textbox.x = 0;
        this.textbox.y = HEIGHT() - this.textbox.height;
    }
    joypadDown(): void {}
    joypadUp(): void {}
}
