"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FadeOutState = exports.FadeInState = exports.FadeState = void 0;
const main_1 = require("../main");
const geometry_1 = require("../geometry");
const state_1 = require("./state");
const Color = require("../color");
const Functions = require("../functions");
class FadeState extends state_1.BaseState {
    constructor(into, color) {
        super();
        this.into = into;
        this.fadeSlate = new geometry_1.Rectangle(0, 0, (0, main_1.WIDTH)(), (0, main_1.HEIGHT)());
        if (color) {
            this.fadeSlate.color = color;
        }
        else {
            this.fadeSlate.color = Color.BLACK;
        }
        this.duration = 60;
    }
    get amt() {
        return this.timer / this.duration;
    }
    init(g) { }
    update(g) {
        if (this.timer % 3 == 0) {
            let sig;
            if (this.fadeOutState) {
                // fade out
                sig = Functions.fadeUpSigmoid(this.amt);
            }
            else {
                // fade in
                sig = Functions.fadeDownSigmoid(this.amt);
            }
            this.fadeSlate.color[3] = g.p.map(sig, 0, 1, 0, 255);
            //gPrint(`${this.name}: ${this.fadeSlate.color[3] / 255}, ${this.fadeUpState}`);
        }
        if (this.timer >= this.duration) {
            if (this.fadeOutState) {
                // this is fade out
                g.stateMachine.exitState(); // exit fade
                g.stateMachine.exitState(); // exit underlying state
                g.stateMachine.enterState(this.into); // enter new state
                //g.stateMachine.exitState();
            }
            else {
                // this is fade in
                g.stateMachine.exitState();
                // g.stateMachine.enterState(this.into);
            }
        }
        this.timer++;
        this.fadeSlate.update(g);
    }
    draw(g) {
        this.fadeSlate.draw(g);
    }
    resize(g) { }
    joypadDown(g) { }
    joypadUp(g) { }
}
exports.FadeState = FadeState;
class FadeInState extends FadeState {
    constructor(into, color) {
        super(into, color);
        this.name = "FadeInState";
        this.fadeOutState = false;
    }
}
exports.FadeInState = FadeInState;
class FadeOutState extends FadeState {
    constructor(into, color) {
        super(into, color);
        this.name = "FadeOutState";
        this.fadeOutState = true;
    }
}
exports.FadeOutState = FadeOutState;
