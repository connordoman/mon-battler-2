import * as P5 from "p5";
import { WIDTH, HEIGHT, GameData } from "../main";
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

    constructor(g: GameData) {
        super();
        this.name = "NewGameState";
        let boxHeight = HEIGHT() / 4;
        this.textbox = new TextBox(g, EN_NEW_GAME, 0, HEIGHT() - boxHeight, WIDTH(), boxHeight);
        this.textbox.static = false;
    }
    init(g: GameData): void {}
    update(g: GameData): void {
        this.timer++;

        this.advancePhase(g);

        switch (this.phase) {
            case this.lastPhase:
                break;
            case PHASE_FADE_IN:
                g.stateMachine.enterState(new FadeInState(this));
                this.setNextPhase(PHASE_NEW_GAME);
                break;
            case PHASE_NEW_GAME:
                // Welcome message
                if (this.timer === 120 && !this.textbox.seen) {
                    g.stateMachine.enterState(new TextBoxState(g, this.textbox));
                    this.setNextPhase(PHASE_ANY_KEY);
                }
                break;
            case PHASE_ANY_KEY:
                // Press any key to continue
                if (!this.textbox.seen) {
                    this.textbox.reset(EN_ANY_KEY);
                    let boxHeight = HEIGHT() / 4;
                    this.textbox = new PressAnyKeyTextbox(g, 0, HEIGHT() - boxHeight, WIDTH(), boxHeight);
                    g.stateMachine.enterState(new PressAnyKeyTextBoxState(g, this.textbox));
                    this.setNextPhase(PHASE_OVERWORLD);
                }
                break;
            case PHASE_OVERWORLD:
                // Exit state
                //if (this.timer === 60) {
                g.stateMachine.exitState();
                g.stateMachine.enterState(new OverworldState(g.map));
            //}
            default:
                break;
        }
    }

    draw(g: GameData): void {
        g.p.background(g.p.color(Color.DARK_RED));
    }
    resize(g: GameData): void {
        this.textbox.x = 0;
        this.textbox.y = HEIGHT() - this.textbox.height;
    }
    joypadDown(): void {}
    joypadUp(): void {}
}
