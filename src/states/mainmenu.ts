import * as P5 from "p5";
import { GAME_DATA, gPrint, HEIGHT, pixelHeight, pixelWidth, WIDTH } from "../main";
import { BaseState } from "./state";
import { TitleScreenState } from "./titlescreen";
import { Triangle, Vector } from "../geometry";
import { TextBox } from "./textbox";
import { NewGameState } from "./newgame";
import * as Color from "../color";
import { FadeInState } from "./fade";

export class MainMenuState extends BaseState {
    name: string;
    option: number;
    pointer: Triangle;
    newGameBox: TextBox;
    continueBox: TextBox;
    settingsBox: TextBox;

    constructor() {
        super();
        this.name = "MainMenuState";
        this.option = 0;
        this.pointer = new Triangle(0, 0, 8 * pixelWidth);
        this.pointer.setAngle(Math.PI / 2);
        this.pointer.color = Color.BLACK;

        this.newGameBox = new TextBox("New Game", 0, 0, WIDTH(), GAME_DATA.tileHeight * 2);
        gPrint(this.newGameBox.msg.indexOf("\n"));
        this.continueBox = new TextBox("Continue", 0, this.newGameBox.height, WIDTH(), this.newGameBox.height);
        this.settingsBox = new TextBox(
            "Settings",
            0,
            this.continueBox.height + this.continueBox.y,
            WIDTH(),
            this.continueBox.height
        );
        this.newGameBox.static = true;
        this.continueBox.static = true;
        this.settingsBox.static = true;
    }

    draw(g: P5) {
        g.background(0);
        g.fill(255);
        g.textSize(32);

        this.newGameBox.update(g);
        this.continueBox.update(g);
        this.settingsBox.update(g);
        this.newGameBox.draw(g);
        this.continueBox.draw(g);
        this.settingsBox.draw(g);

        let offset = GAME_DATA.tileHeight;
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
        this.pointer.position = new Vector(arrowX, arrowY);
        this.pointer.draw(g);
    }

    joypadDown() {
        if (GAME_DATA.joypad.state.DOWN && this.option < 2) {
            this.option++;
        }

        if (GAME_DATA.joypad.state.UP && this.option > 0) {
            this.option--;
        }

        if (GAME_DATA.joypad.state.A) {
            switch (this.option) {
                case 0:
                    // New Game
                    GAME_DATA.stateMachine.exitState();
                    GAME_DATA.stateMachine.enterState(new NewGameState());
                    break;
                case 1:
                    // Continue
                    break;
                case 2:
                    // Settings

                    break;
                default:
                    break;
            }
        }

        if (GAME_DATA.joypad.state.B) {
            GAME_DATA.stateMachine.exitState();
            GAME_DATA.stateMachine.enterState(new TitleScreenState());
        }
    }
    resize(g: P5): void {
        this.newGameBox.resize();
        this.continueBox.resize();
        this.settingsBox.resize();
        this.pointer.setSize(8 * pixelWidth);
    }
    update(g: P5): void {}

    joypadUp(): void {}
}
