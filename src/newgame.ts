import { HEIGHT, TILE_HEIGHT, WIDTH } from "./main";
import { BaseState } from "./state";
import { StateMachine } from "./statemachine";
import { TextBox, TextBoxState } from "./textbox";
import * as Color from "./color";

export const EN_NEW_GAME =
    "Hello! It's nice to see you. Welcome to the world of monster battling. We are going to start you off with a new game.";
export const EN_CONTINUE = "Press any key to continue...";

export class NewGameState extends BaseState {
    parent: StateMachine;
    textbox: TextBox;
    phase: number;

    constructor(parent: StateMachine) {
        super(parent, "NewGameState");
        this.parent = parent;
        let boxHeight = HEIGHT / 4;
        this.textbox = new TextBox(parent, EN_NEW_GAME, 0, HEIGHT - boxHeight, WIDTH, boxHeight);
        this.textbox.static = false;
        this.phase = 0;
    }
    update(g: import("p5")): void {}

    draw(g: import("p5")): void {
        g.background(g.color(Color.DARK_RED));

        switch (this.phase) {
            case 0:
                // Welcome message
                if (!this.textbox.seen) {
                    this.parent.enterState(new TextBoxState(this.parent, this.textbox));
                }
                this.phase = 1;
                break;
            case 1:
                // Press any key to continue
                this.textbox.reset(EN_CONTINUE);
                if (!this.textbox.seen) {
                    this.parent.enterState(new TextBoxState(this.parent, this.textbox));
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
    joypadDown(key: string): void {}
    joypadUp(key: string): void {}
}
