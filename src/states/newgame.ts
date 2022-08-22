import * as P5 from "p5";
import { GAME_DATA, WIDTH, HEIGHT } from "../main";
import { BaseState } from "./state";
import { PressAnyKeyTextbox, TextBox, TextBoxState, PressAnyKeyTextBoxState } from "./textbox";
import * as Color from "../color";
import { getTextOfJSDocComment } from "typescript";
import { OverworldState } from "./overworld";
import { FadeInState } from "./fade";

export const EN_NEW_GAME =
    "Hello! It's nice to see you. Welcome to the world of monster battling. We are going to start you off with a new game.";
export const EN_ANY_KEY = "Press any key to continue...";

export const PHASE_FADE_IN: number = 0;
export const PHASE_NEW_GAME: number = 1;
export const PHASE_ANY_KEY: number = 2;
export const PHASE_OVERWORLD: number = 3;

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

        this.advancePhase();

        switch (this.phase) {
            case this.lastPhase:
                break;
            case PHASE_FADE_IN:
                GAME_DATA.stateMachine.enterState(new FadeInState(this));
                this.setNextPhase(PHASE_NEW_GAME);
                break;
            case PHASE_NEW_GAME:
                // Welcome message
                if (this.timer === 120 && !this.textbox.seen) {
                    GAME_DATA.stateMachine.enterState(new TextBoxState(this.textbox));
                    this.setNextPhase(PHASE_ANY_KEY);
                }
                break;
            case PHASE_ANY_KEY:
                // Press any key to continue
                if (!this.textbox.seen) {
                    this.textbox.reset(EN_ANY_KEY);
                    let boxHeight = HEIGHT() / 4;
                    this.textbox = new PressAnyKeyTextbox(0, HEIGHT() - boxHeight, WIDTH(), boxHeight);
                    GAME_DATA.stateMachine.enterState(new PressAnyKeyTextBoxState(this.textbox));
                    this.setNextPhase(PHASE_OVERWORLD);
                }
                break;
            case PHASE_OVERWORLD:
                // Exit state
                //if (this.timer === 60) {
                GAME_DATA.stateMachine.exitState();
                GAME_DATA.stateMachine.enterState(new OverworldState(GAME_DATA.map));
            //}
            default:
                break;
        }
    }

    draw(g: P5): void {
        g.background(g.color(Color.DARK_RED));
    }
    resize(g: P5): void {
        this.textbox.x = 0;
        this.textbox.y = HEIGHT() - this.textbox.height;
    }
    joypadDown(): void {}
    joypadUp(): void {}
}
