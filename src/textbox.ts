import * as P5 from "p5";
import * as Color from "./color";
import { Rectangle, Triangle, Vector } from "./geometry";
import { TEXT_SIZE, TILE_HEIGHT, TILE_WIDTH, gPrint } from "./main";
import { BaseState } from "./state";
import { StateMachine } from "./statemachine";

export class TextBox extends Rectangle {
    parent: StateMachine;
    msg: string;
    static: boolean;
    textColor: Color.Color;
    lineSize: number;

    seen: boolean;

    constructor(parent: StateMachine, msg: string, x: number, y: number, w: number, h: number) {
        super(x, y, w, h);
        this.parent = parent;
        this.msg = msg.trim();
        this.static = false;
        this.color = Color.WHITE;
        this.textColor = Color.DARK_GREEN;
        this.lineSize = w - 2 * TILE_WIDTH;

        this.seen = false;
    }

    reset(msg: string): void {
        this.msg = msg.trim();
        this.static = false;
        this.seen = false;
    }

    update(g: P5): void {}

    draw(g: P5): void {
        g.push();
        g.translate(this.x, this.y);
        g.textSize(TEXT_SIZE);

        g.fill(g.color(this.color));
        g.stroke(g.color(12, 35, 68));
        g.strokeWeight(4);
        g.rect(4, 4, this.width - 8, this.height - 8, 8);

        g.fill(g.color(this.textColor));
        g.noStroke();
        g.textAlign(g.LEFT, g.TOP);
        g.text(this.msg, TILE_WIDTH, TILE_HEIGHT * 0.55);
        g.pop();
    }
}

export class TextBoxState extends BaseState {
    parent: StateMachine;
    textbox: TextBox;
    textboxArrow: TextBoxArrow;
    message: string;
    typed: string;
    timer: number;
    wrappable: boolean;
    typing: boolean;
    letterCount: number;
    wordCount: number;
    words: string[];
    lineCount: number;
    charInterval: number;

    constructor(parent: StateMachine, textbox: TextBox) {
        super(parent, `TextBoxState: ${textbox.msg.slice(0, 17)}...`);
        this.textbox = textbox;
        this.textboxArrow = new TextBoxArrow(
            textbox.x + textbox.width - TILE_WIDTH / 2,
            textbox.y + textbox.height - TILE_HEIGHT / 1.5
        );
        this.parent = parent;
        this.message = textbox.msg;
        this.typed = "";
        this.timer = 0;
        this.wrappable = false;
        this.typing = true;
        this.letterCount = 0;
        this.wordCount = 1;
        this.words = this.message.split(" ");
        this.lineCount = 0;
        this.charInterval = 4;
    }

    update(g: P5): void {
        this.textbox.update(g);

        if (this.textbox.seen) {
            this.parent.exitState();
            return;
        }

        if (this.textbox.static) {
            return;
        }

        if (this.wrappable) {
            this.textboxArrow.update(g);
        }

        if (this.typing && this.timer % this.charInterval == 0) {
            let char = this.message.charAt(this.letterCount);
            gPrint(`\tCurrent char: ${char}`);

            if (char === " ") {
                let nextWord = this.words[this.wordCount];
                let lines = this.typed.split("\n");
                let newLine = lines[lines.length - 1] + " " + nextWord;
                let lineLength = g.textWidth(newLine);

                gPrint(lines);
                gPrint("Current line + nextWord: " + newLine);
                gPrint("Pixel width of this line: " + lineLength);
                gPrint(`\tNext Word: ${nextWord}`);

                this.wordCount++;

                if (lineLength >= this.textbox.lineSize) {
                    char = "\n";
                }
            }

            if (char === "\n") {
                if (this.lineCount == 1) {
                    this.wrappable = true;
                    this.typing = false;
                    char = "";
                } else {
                    this.lineCount++;
                }
            }

            this.typed += char;

            this.letterCount++;

            if (this.letterCount >= this.message.length) {
                this.typing = false;
                this.wrappable = false;
                this.letterCount = 0;
                this.wordCount = 0;
            }
        }
        this.timer++;
    }
    draw(g: P5): void {
        if (this.textbox.static) {
            this.textbox.msg = this.message;
            this.textbox.draw(g);
        } else {
            this.textbox.msg = this.typed;
            this.textbox.draw(g);
        }

        if (this.wrappable) {
            this.textboxArrow.draw(g);
        }
    }

    joypadDown(key: string): void {
        if (this.parent.joypad.state.A || this.parent.joypad.state.B) {
            if (this.wrappable) {
                this.lineCount = 0;
                this.typed = "";
                this.typing = true;
                this.wrappable = false;
            } else if (!this.typing) {
                this.parent.exitState();
            } else {
                this.charInterval = 1;
            }
        }
    }

    joypadUp(key: string): void {
        this.charInterval = 4;
    }
}

export class TextBoxArrow extends Triangle {
    offset: number;
    timer: number;
    originY: number;
    constructor(x: number, y: number) {
        super(x, y, TILE_WIDTH / 3);
        this.setAngle(Math.PI);
        this.offset = 0;
        this.timer = 0;
        this.color = Color.RED;
        this.originY = this.y;
    }

    update(g: P5) {
        if (this.timer % 20 == 0) {
            if (this.offset > 2) {
                this.position = new Vector(this.x, this.originY);
                this.offset = 0;
            }

            let space = this.offset * (this.height / 3);
            this.position = new Vector(this.x, this.originY + space);

            gPrint(`TextBoxArrow: (${this.x}, ${this.y}) at offset = ${this.offset} with space = ${space}`);

            this.offset++;
        }

        this.timer++;
    }

    draw(g: P5) {
        super.draw(g);
    }
}
