"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextBoxArrow = exports.PressAnyKeyTextBoxState = exports.TextBoxState = exports.PressAnyKeyTextbox = exports.TextBox = exports.EN_CONTINUE = void 0;
const Color = require("../color");
const geometry_1 = require("../geometry");
const main_1 = require("../main");
const state_1 = require("./state");
exports.EN_CONTINUE = "Press any key to continue...";
class TextBox extends geometry_1.Rectangle {
    constructor(msg, x, y, w, h) {
        super(x, y, w, h);
        this.posRatio = new geometry_1.Vector(x / (0, main_1.WIDTH)(), y / (0, main_1.HEIGHT)());
        this.dimRatio = new geometry_1.Vector(w / (0, main_1.WIDTH)(), h / (0, main_1.HEIGHT)());
        this.msg = msg.trim();
        this.static = false;
        this.color = Color.WHITE;
        this.textColor = Color.SLATE;
        this.lineSize = w - 2 * main_1.GAME_DATA.tileHeight;
        this.seen = false;
    }
    reset(msg) {
        this.msg = msg.trim();
        this.static = false;
        this.seen = false;
    }
    update(g) {
        if (g.textSize() !== main_1.GAME_DATA.textSize) {
            g.textSize(main_1.GAME_DATA.textSize);
        }
    }
    draw(g) {
        g.push();
        g.translate(this.x, this.y);
        g.fill(g.color(this.color));
        g.stroke(g.color(12, 35, 68));
        g.strokeWeight(2 * main_1.pixelWidth);
        g.rect(2 * main_1.pixelWidth, 2 * main_1.pixelHeight, this.width - 4 * main_1.pixelWidth, this.height - 4 * main_1.pixelHeight, main_1.GAME_DATA.tileHeight / 4);
        g.noStroke();
        g.fill(g.color(this.textColor));
        g.textAlign(g.LEFT, g.TOP);
        if (this.static && this.msg.indexOf("\n") < 0) {
            g.text(this.msg, main_1.GAME_DATA.tileWidth, this.height / 2 - (main_1.GAME_DATA.textSize * this.msg.split("\n").length) / 2);
        }
        else {
            g.text(this.msg, main_1.GAME_DATA.tileWidth, main_1.GAME_DATA.tileHeight * 0.48);
        }
        g.pop();
    }
    resize() {
        if (this.width !== this.dimRatio.x * (0, main_1.WIDTH)()) {
            this.width = this.dimRatio.x * (0, main_1.WIDTH)();
        }
        if (this.height !== this.dimRatio.y * (0, main_1.HEIGHT)()) {
            this.height = this.dimRatio.y * (0, main_1.HEIGHT)();
        }
        if (this.x !== this.posRatio.x * (0, main_1.WIDTH)()) {
            this.x = this.posRatio.x * (0, main_1.WIDTH)();
        }
        if (this.y !== this.posRatio.y * (0, main_1.HEIGHT)()) {
            this.y = this.posRatio.y * (0, main_1.HEIGHT)();
        }
        this.posRatio = new geometry_1.Vector(this.x / (0, main_1.WIDTH)(), this.y / (0, main_1.HEIGHT)());
        this.dimRatio = new geometry_1.Vector(this.width / (0, main_1.WIDTH)(), this.height / (0, main_1.HEIGHT)());
    }
}
exports.TextBox = TextBox;
class PressAnyKeyTextbox extends TextBox {
    constructor(x, y, w, h) {
        super(exports.EN_CONTINUE, x, y, w, h);
    }
}
exports.PressAnyKeyTextbox = PressAnyKeyTextbox;
class TextBoxState extends state_1.BaseState {
    constructor(textbox) {
        super();
        this.name = `TextBoxState: ${textbox.msg.slice(0, 17)}...`;
        this.textbox = textbox;
        this.textboxArrow = new TextBoxArrow(textbox.x + textbox.width - main_1.GAME_DATA.tileWidth / 2, textbox.y + textbox.height - main_1.GAME_DATA.tileHeight / 1.5);
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
        main_1.GAME_DATA.joypad.clearKeys();
    }
    update(g) {
        this.textbox.update(g);
        if (this.textbox.seen) {
            main_1.GAME_DATA.stateMachine.exitState();
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
                let lineLength = g.textWidth(newLine);
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
        this.textboxArrow = new TextBoxArrow(this.textbox.x + this.textbox.width - main_1.GAME_DATA.tileWidth / 2, this.textbox.y + this.textbox.height - main_1.GAME_DATA.tileHeight / 1.5);
    }
    joypadDown(key) {
        if (main_1.GAME_DATA.joypad.state.A || main_1.GAME_DATA.joypad.state.B) {
            if (this.wrappable) {
                this.lineCount = 0;
                this.typed = "";
                this.typing = true;
                this.wrappable = false;
            }
            else if (!this.typing) {
                main_1.GAME_DATA.stateMachine.exitState();
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
class PressAnyKeyTextBoxState extends TextBoxState {
    constructor(textbox) {
        super(textbox);
        this.name = `PressAnyKeyTextboxState: ${textbox.msg.slice(0, 17)}...`;
        this.closable = false;
    }
    joypadDown(key) {
        super.joypadDown(key);
        if (!this.closable && !this.typing) {
            this.closable = true;
        }
    }
    joypadUp(key) {
        super.joypadUp(key);
        if (this.closable) {
            main_1.GAME_DATA.stateMachine.exitState();
        }
    }
}
exports.PressAnyKeyTextBoxState = PressAnyKeyTextBoxState;
class TextBoxArrow extends geometry_1.Triangle {
    constructor(x, y) {
        super(x, y, main_1.GAME_DATA.tileWidth / 3);
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
