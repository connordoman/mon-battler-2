import * as P5 from "p5";
import * as Color from "../color";
import { Rectangle, Triangle, Vector } from "../geometry";
import { gPrint, HEIGHT, pixelWidth, pixelHeight, WIDTH, GameData } from "../main";
import { BaseState } from "./state";

export const EN_CONTINUE = "Press any key to continue...";

export class TextBox extends Rectangle {
    msg: string;
    static: boolean;
    textColor: Color.Color;
    lineSize: number;

    seen: boolean;

    constructor(g: GameData, msg: string, x: number, y: number, w: number, h: number) {
        super(x, y, w, h);
        this.msg = msg.trim();
        this.static = false;
        this.color = Color.WHITE;
        this.textColor = Color.SLATE;
        this.lineSize = w - 2 * g.tileHeight;

        this.seen = false;
    }

    reset(msg: string): void {
        this.msg = msg.trim();
        this.static = false;
        this.seen = false;
    }

    update(g: GameData): void {
        if (g.p.textSize() !== g.textSize) {
            g.p.textSize(g.textSize);
        }
    }

    draw(g: GameData): void {
        g.p.push();
        g.p.translate(this.x, this.y);

        g.p.fill(g.p.color(this.color));
        g.p.stroke(g.p.color(12, 35, 68));
        g.p.strokeWeight(2 * pixelWidth);
        g.p.rect(
            2 * pixelWidth,
            2 * pixelHeight,
            this.width - 4 * pixelWidth,
            this.height - 4 * pixelHeight,
            g.tileHeight / 4
        );

        g.p.noStroke();
        g.p.fill(g.p.color(this.textColor));
        g.p.textAlign(g.p.LEFT, g.p.TOP);

        if (this.static && this.msg.indexOf("\n") < 0) {
            g.p.text(this.msg, g.tileWidth, this.height / 2 - (g.textSize * this.msg.split("\n").length) / 2);
        } else {
            g.p.text(this.msg, g.tileWidth, g.tileHeight * 0.48);
        }

        g.p.pop();
    }

    resize() {
        this.resizeAndReposition();
    }
}

export class PressAnyKeyTextbox extends TextBox {
    constructor(g: GameData, x: number, y: number, w: number, h: number) {
        super(g, EN_CONTINUE, x, y, w, h);
    }
}

export class TextBoxState extends BaseState {
    name: string;
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

    constructor(g: GameData, textbox: TextBox) {
        super();
        this.name = `TextBoxState: ${textbox.msg.slice(0, 17)}...`;
        this.textbox = textbox;
        this.textboxArrow = new TextBoxArrow(
            g,
            textbox.x + textbox.width - g.tileWidth / 2,
            textbox.y + textbox.height - g.tileHeight / 1.5
        );
        this.message = textbox.msg;
        this.typed = "";
        this.timer = 0;
        this.typing = true;
        this.wrappable = false;
        this.letterCount = 0;
        this.wordCount = 1;
        this.words = this.message.split(" ");
        this.lineCount = 0;
        this.charInterval = 4;

        g.joypad.clearKeys();
    }

    init(g: GameData) {}

    update(g: GameData): void {
        this.textbox.update(g);

        if (this.textbox.seen) {
            g.stateMachine.exitState();
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
            // gPrint(`\tCurrent char: ${char}`);

            if (char === " ") {
                let nextWord = this.words[this.wordCount];
                let lines = this.typed.split("\n");
                let newLine = lines[lines.length - 1] + " " + nextWord;
                let lineLength = g.p.textWidth(newLine);

                // gPrint(lines);
                // gPrint("Current line + nextWord: " + newLine);
                //gPrint("Pixel width of this line: " + lineLength);
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
    draw(g: GameData): void {
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
    resize(g: GameData): void {
        this.textbox.resize();
        this.textboxArrow = new TextBoxArrow(
            g,
            this.textbox.x + this.textbox.width - g.tileWidth / 2,
            this.textbox.y + this.textbox.height - g.tileHeight / 1.5
        );
    }

    joypadDown(g: GameData): void {
        if (g.joypad.state.A || g.joypad.state.B) {
            if (this.wrappable) {
                this.lineCount = 0;
                this.typed = "";
                this.typing = true;
                this.wrappable = false;
            } else if (!this.typing) {
                g.stateMachine.exitState();
            } else {
                this.charInterval = 1;
            }
        }
    }

    joypadUp(g: GameData): void {
        this.charInterval = 4;
    }
}

export class PressAnyKeyTextBoxState extends TextBoxState {
    closable: boolean;

    constructor(g: GameData, textbox: TextBox) {
        super(g, textbox);
        this.name = `PressAnyKeyTextboxState: ${textbox.msg.slice(0, 17)}...`;
        this.closable = false;
    }

    joypadDown(g: GameData): void {
        super.joypadDown(g);
        if (!this.closable && !this.typing) {
            this.closable = true;
        }
    }

    joypadUp(g: GameData): void {
        super.joypadUp(g);
        if (this.closable) {
            g.stateMachine.exitState();
        }
    }
}

export class TextBoxArrow extends Triangle {
    offset: number;
    timer: number;
    originY: number;
    constructor(g: GameData, x: number, y: number) {
        super(x, y, g.tileWidth / 3);
        this.setAngle(Math.PI);
        this.offset = 0;
        this.timer = 0;
        this.color = Color.RED;
        this.originY = this.y;
    }

    update(g: GameData) {
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

    draw(g: GameData) {
        super.draw(g);
    }
}
