"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextBoxArrow = exports.PressAnyKeyTextBoxState = exports.TextBoxState = exports.PressAnyKeyTextbox = exports.TextBox = exports.EN_CONTINUE = void 0;
const Color = require("../color");
const geometry_1 = require("../geometry");
const main_1 = require("../main");
const state_1 = require("./state");
exports.EN_CONTINUE = "Press any key to continue...";
class TextBox extends geometry_1.Rectangle {
    constructor(g, msg, x, y, w, h) {
        super(x, y, w, h);
        this.msg = msg.trim();
        this.static = false;
        this.color = Color.WHITE;
        this.textColor = Color.SLATE;
        this.lineSize = w - 2 * g.tileHeight;
        this.seen = false;
    }
    reset(msg) {
        this.msg = msg.trim();
        this.static = false;
        this.seen = false;
    }
    update(g) {
        if (g.p.textSize() !== g.textSize) {
            g.p.textSize(g.textSize);
        }
    }
    draw(g) {
        g.p.push();
        g.p.translate(this.x, this.y);
        g.p.fill(g.p.color(this.color));
        g.p.stroke(g.p.color(12, 35, 68));
        g.p.strokeWeight(2 * main_1.pixelWidth);
        g.p.rect(2 * main_1.pixelWidth, 2 * main_1.pixelHeight, this.width - 4 * main_1.pixelWidth, this.height - 4 * main_1.pixelHeight, g.tileHeight / 4);
        g.p.noStroke();
        g.p.fill(g.p.color(this.textColor));
        g.p.textAlign(g.p.LEFT, g.p.TOP);
        if (this.static && this.msg.indexOf("\n") < 0) {
            g.p.text(this.msg, g.tileWidth, this.height / 2 - (g.textSize * this.msg.split("\n").length) / 2);
        }
        else {
            g.p.text(this.msg, g.tileWidth, g.tileHeight * 0.48);
        }
        g.p.pop();
    }
    resize() {
        this.resizeAndReposition();
    }
}
exports.TextBox = TextBox;
class PressAnyKeyTextbox extends TextBox {
    constructor(g, x, y, w, h) {
        super(g, exports.EN_CONTINUE, x, y, w, h);
    }
}
exports.PressAnyKeyTextbox = PressAnyKeyTextbox;
class TextBoxState extends state_1.BaseState {
    constructor(g, textbox) {
        super();
        this.name = `TextBoxState: ${textbox.msg.slice(0, 17)}...`;
        this.textbox = textbox;
        this.textboxArrow = new TextBoxArrow(g, textbox.x + textbox.width - g.tileWidth / 2, textbox.y + textbox.height - g.tileHeight / 1.5);
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
    init(g) { }
    update(g) {
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
                (0, main_1.gPrint)(`\tNext Word: ${nextWord}`);
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
    resize(g) {
        this.textbox.resize();
        this.textboxArrow = new TextBoxArrow(g, this.textbox.x + this.textbox.width - g.tileWidth / 2, this.textbox.y + this.textbox.height - g.tileHeight / 1.5);
    }
    joypadDown(g) {
        if (g.joypad.state.A || g.joypad.state.B) {
            if (this.wrappable) {
                this.lineCount = 0;
                this.typed = "";
                this.typing = true;
                this.wrappable = false;
            }
            else if (!this.typing) {
                g.stateMachine.exitState();
            }
            else {
                this.charInterval = 1;
            }
        }
    }
    joypadUp(g) {
        this.charInterval = 4;
    }
}
exports.TextBoxState = TextBoxState;
class PressAnyKeyTextBoxState extends TextBoxState {
    constructor(g, textbox) {
        super(g, textbox);
        this.name = `PressAnyKeyTextboxState: ${textbox.msg.slice(0, 17)}...`;
        this.closable = false;
    }
    joypadDown(g) {
        super.joypadDown(g);
        if (!this.closable && !this.typing) {
            this.closable = true;
        }
    }
    joypadUp(g) {
        super.joypadUp(g);
        if (this.closable) {
            g.stateMachine.exitState();
        }
    }
}
exports.PressAnyKeyTextBoxState = PressAnyKeyTextBoxState;
class TextBoxArrow extends geometry_1.Triangle {
    constructor(g, x, y) {
        super(x, y, g.tileWidth / 3);
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
            (0, main_1.gPrint)(`TextBoxArrow: (${this.x}, ${this.y}) at offset = ${this.offset} with space = ${space}`);
            this.offset++;
        }
        this.timer++;
    }
    draw(g) {
        super.draw(g);
    }
}
exports.TextBoxArrow = TextBoxArrow;
