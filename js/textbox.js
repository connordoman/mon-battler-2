"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextBoxArrow = exports.TextBoxState = exports.TextBox = void 0;
const Color = require("./color");
const geometry_1 = require("./geometry");
const main_1 = require("./main");
const state_1 = require("./state");
class TextBox extends geometry_1.Rectangle {
    constructor(parent, msg, x, y, w, h) {
        super(x, y, w, h);
        this.parent = parent;
        this.msg = msg.trim();
        this.static = false;
        this.color = Color.WHITE;
        this.textColor = Color.DARK_GREEN;
        this.lineSize = w - 2 * main_1.TILE_WIDTH;
        this.seen = false;
    }
    reset(msg) {
        this.msg = msg.trim();
        this.static = false;
        this.seen = false;
    }
    update(g) { }
    draw(g) {
        g.push();
        g.translate(this.x, this.y);
        g.fill(g.color(this.color));
        g.stroke(g.color(12, 35, 68));
        g.strokeWeight(4);
        g.rect(4, 4, this.width - 8, this.height - 8, 8);
        g.noStroke();
        g.fill(g.color(this.textColor));
        g.textAlign(g.LEFT, g.TOP);
        g.textSize(main_1.TEXT_SIZE);
        g.text(this.msg, main_1.TILE_WIDTH, main_1.TILE_HEIGHT * 0.55);
        g.pop();
    }
}
exports.TextBox = TextBox;
class TextBoxState extends state_1.BaseState {
    constructor(parent, textbox) {
        super(parent, `TextBoxState: ${textbox.msg.slice(0, 17)}...`);
        this.textbox = textbox;
        this.textboxArrow = new TextBoxArrow(textbox.x + textbox.width - main_1.TILE_WIDTH / 2, textbox.y + textbox.height - main_1.TILE_HEIGHT / 1.5);
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
    update(g) {
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
            (0, main_1.print)(`\tCurrent char: ${char}`);
            if (char === " ") {
                let nextWord = this.words[this.wordCount];
                let lines = this.typed.split("\n");
                let newLine = lines[lines.length - 1] + " " + nextWord;
                let lineLength = g.textWidth(newLine);
                (0, main_1.print)(lines);
                (0, main_1.print)("Current line + nextWord: " + newLine);
                (0, main_1.print)("Pixel width of this line: " + lineLength);
                (0, main_1.print)(`\tNext Word: ${nextWord}`);
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
                }
                else {
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
    draw(g) {
        if (this.textbox.static) {
            this.textbox.msg = this.message;
            this.textbox.draw(g);
        }
        else {
            this.textbox.msg = this.typed;
            this.textbox.draw(g);
        }
        if (this.wrappable) {
            this.textboxArrow.draw(g);
        }
    }
    joypadDown(key) {
        if (this.parent.joypad.state.A || this.parent.joypad.state.B) {
            if (this.wrappable) {
                this.lineCount = 0;
                this.typed = "";
                this.typing = true;
                this.wrappable = false;
            }
            else if (!this.typing) {
                this.parent.exitState();
            }
            else {
                this.charInterval = 1;
            }
        }
    }
    joypadUp(key) {
        this.charInterval = 4;
    }
}
exports.TextBoxState = TextBoxState;
class TextBoxArrow extends geometry_1.Triangle {
    constructor(x, y) {
        super(x, y, main_1.TILE_WIDTH / 3);
        this.setAngle(Math.PI);
        this.offset = 0;
        this.timer = 0;
        this.color = Color.RED;
        this.originY = this.y;
    }
    update(g) {
        if (this.timer % 20 == 0) {
            if (this.offset > 2) {
                this.position = new geometry_1.Vector(this.x, this.originY);
                this.offset = 0;
            }
            let space = this.offset * (this.height / 3);
            this.position = new geometry_1.Vector(this.x, this.originY + space);
            (0, main_1.print)(`TextBoxArrow: (${this.x}, ${this.y}) at offset = ${this.offset} with space = ${space}`);
            this.offset++;
        }
        this.timer++;
    }
    draw(g) {
        super.draw(g);
    }
}
exports.TextBoxArrow = TextBoxArrow;
