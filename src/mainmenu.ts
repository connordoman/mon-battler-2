import * as P5 from "p5";
import { HEIGHT, PIXEL_HEIGHT, WIDTH } from "./main";
import { BaseState } from "./state";
import { StateMachine } from "./statemachine";
import { TitleScreenState } from "./titlescreen";
import { Triangle, Vector } from "./geometry";
import { TextBox } from "./textbox";
import { NewGameState } from "./newgame";
import * as Color from "./color";

export class MainMenuState extends BaseState {
    option: number;
    pointer: Triangle;
    newGameBox: TextBox;
    continueBox: TextBox;
    settingsBox: TextBox;

    constructor(parent: StateMachine) {
        super(parent, "MainMenuState");
        this.option = 0;
        this.pointer = new Triangle(0, 0, 25);
        this.pointer.setAngle(Math.PI / 2);
        this.pointer.color = Color.BLACK;

        this.newGameBox = new TextBox(parent, "New Game", 0, 0, WIDTH, HEIGHT / 6);
        this.continueBox = new TextBox(parent, "Continue", 0, this.newGameBox.height, WIDTH, HEIGHT / 6);
        this.settingsBox = new TextBox(
            parent,
            "Settings",
            0,
            this.continueBox.height + this.continueBox.y,
            WIDTH,
            HEIGHT / 6
        );
        this.newGameBox.static = false;
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

        let offset = 16 * PIXEL_HEIGHT;
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
        if (this.parent.joypad.state.DOWN && this.option < 2) {
            this.option++;
        }

        if (this.parent.joypad.state.UP && this.option > 0) {
            this.option--;
        }

        if (this.parent.joypad.state.A) {
            switch (this.option) {
                case 0:
                    // New Game
                    this.parent.exitState();
                    this.parent.enterState(new NewGameState(this.parent));
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

        if (this.parent.joypad.state.B) {
            this.parent.exitState();
            this.parent.enterState(new TitleScreenState(this.parent));
        }
    }
    update(g: P5): void {}

    joypadUp(key: string): void {}
}
