import * as P5 from "p5";
import { PIXEL_HEIGHT } from "./main";
import { BaseState, StateMachine } from "./state";
import { TitleScreenState } from "./titlescreen";
import { Triangle, Vector } from "./geometry";

export class MainMenuState extends BaseState {
    option: number;
    items: string[];
    pointer: Triangle;
    constructor(parent: StateMachine) {
        super(parent, "TitleScreenState");
        this.option = 0;
        this.items = ["New Game", "Continue", "Settings"];
        this.pointer = new Triangle(0, 0, 25);
        this.pointer.setAngle(Math.PI / 2);
        this.pointer.color = 255;
    }

    draw(g: P5) {
        super.draw(g);

        g.background(0);
        g.fill(255);
        g.textSize(32);
        let offset = 16 * PIXEL_HEIGHT;
        let arrowX = offset / 2;
        let arrowY = offset;
        for (let i = 0; i < this.items.length; i++) {
            if (i === this.option) {
                g.textAlign(g.CENTER, g.CENTER);
                arrowX = offset / 2;
                arrowY = offset * (i + 1);
            }
            g.textAlign(g.LEFT);
            g.text(`${this.items[i]}`, offset, offset + i * offset);
        }
        this.pointer.position = new Vector(arrowX, arrowY);
        this.pointer.draw(g);
    }

    joypadDown() {
        if (
            this.parent.joypad.state.DOWN &&
            this.option < this.items.length - 1
        ) {
            this.option++;
        }

        if (this.parent.joypad.state.UP && this.option > 0) {
            this.option--;
        }

        if (this.parent.joypad.state.B) {
            this.parent.exit();
            this.parent.enter(new TitleScreenState(this.parent));
        }
    }
}
