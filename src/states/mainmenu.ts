import * as P5 from "p5";
import { GameData, gPrint, HEIGHT, pixelHeight, pixelWidth, WIDTH } from "../main";
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

    constructor(g: GameData) {
        super();
        this.name = "MainMenuState";
        this.option = 0;
        this.pointer = new Triangle(0, 0, 8 * pixelWidth);
        this.pointer.setAngle(Math.PI / 2);
        this.pointer.color = Color.BLACK;
        this.newGameBox = new TextBox(g, "New Game", 0, 0, WIDTH(), g.tileHeight * 2);

        gPrint(this.newGameBox.msg.indexOf("\n"));
        this.continueBox = new TextBox(g, "Continue", 0, this.newGameBox.height, WIDTH(), this.newGameBox.height);
        this.settingsBox = new TextBox(
            g,
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

    init(g: GameData) {
        this.pointer.setAngle(Math.PI / 2);
        this.pointer.color = Color.BLACK;
        this.newGameBox = new TextBox(g, "New Game", 0, 0, WIDTH(), g.tileHeight * 2);

        gPrint(this.newGameBox.msg.indexOf("\n"));
        this.continueBox = new TextBox(g, "Continue", 0, this.newGameBox.height, WIDTH(), this.newGameBox.height);
        this.settingsBox = new TextBox(
            g,
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

    draw(g: GameData) {
        g.p.background(0);
        g.p.fill(255);
        g.p.textSize(32);

        this.newGameBox.update(g);
        this.continueBox.update(g);
        this.settingsBox.update(g);
        this.newGameBox.draw(g);
        this.continueBox.draw(g);
        this.settingsBox.draw(g);

        let offset = g.tileHeight;
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

    joypadDown(g: GameData) {
        if (g.joypad.state.DOWN && this.option < 2) {
            this.option++;
        }

        if (g.joypad.state.UP && this.option > 0) {
            this.option--;
        }

        if (g.joypad.state.A) {
            switch (this.option) {
                case 0:
                    // New Game
                    g.stateMachine.exitState();
                    g.stateMachine.enterState(new NewGameState(g));
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

        if (g.joypad.state.B) {
            g.stateMachine.exitState();
            g.stateMachine.enterState(new TitleScreenState());
        }
    }

    resize(g: GameData): void {
        this.newGameBox.resize();
        this.continueBox.resize();
        this.settingsBox.resize();
        this.pointer.setSize(8 * pixelWidth);
    }
    update(g: GameData): void {}

    joypadUp(): void {}
}
