import { GAME_DATA, HEIGHT, TILE_HEIGHT, WIDTH } from "../main";
import { BaseState } from "./state";
import { PressAnyKeyTextbox, TextBox, TextBoxState, PressAnyKeyTextBoxState } from "./textbox";
import * as Color from "../color";

export const EN_NEW_GAME =
    "Hello! It's nice to see you. Welcome to the world of monster battling. We are going to start you off with a new game.";
export const EN_CONTINUE = "Press any key to continue...";

export class NewGameState extends BaseState {
    name: string;
    textbox: TextBox;

    constructor() {
        super();
        this.name = "NewGameState";
        let boxHeight = HEIGHT / 4;
        this.textbox = new TextBox(EN_NEW_GAME, 0, HEIGHT - boxHeight, WIDTH, boxHeight);
        this.textbox.static = false;
    }
    update(g: import("p5")): void {
        this.timer++;
    }

    draw(g: import("p5")): void {
        g.background(g.color(Color.DARK_RED));

        switch (this.phase) {
            case 0:
                // Welcome message
                if (!this.textbox.seen) {
                    GAME_DATA.stateMachine.enterState(new TextBoxState(this.textbox));
                }
                this.phase = 1;
                break;
            case 1:
                // Press any key to continue
                this.textbox.reset(EN_CONTINUE);
                if (!this.textbox.seen) {
                    let boxHeight = HEIGHT / 4;
                    this.textbox = new PressAnyKeyTextbox(0, HEIGHT - boxHeight, WIDTH, boxHeight);
                    GAME_DATA.stateMachine.enterState(new PressAnyKeyTextBoxState(this.textbox));
                }
                this.phase = 2;
                this.timer = 0;
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
    joypadDown(): void {}
    joypadUp(): void {}
}
