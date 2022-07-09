"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FadeOutState = exports.FadeInState = exports.FadeTransitionState = exports.FadeState = void 0;
const Color = require("./color");
const state_1 = require("./state");
class FadeState extends state_1.BaseState {
    constructor(parent, duration, color) {
        super(parent, "FadeState");
        this.duration = duration;
        this.color = color;
        this.timer = 0;
        this.fadeIn = false;
    }
    finished() {
        return this.timer >= this.duration;
    }
    update(g) {
        if (!this.finished()) {
            this.timer++;
        }
        else {
            this.parent.exitState();
        }
    }
    draw(g) {
        if (this.finished())
            return;
        if (this.timer % 2 == 0) {
            if (this.fadeIn) {
                this.color = [this.color[0], this.color[1], this.color[2], (this.timer * 255) / this.duration];
            }
            else {
                this.color = [this.color[0], this.color[1], this.color[2], 255 - (this.timer * 255) / this.duration];
            }
        }
        g.fill(g.color(this.color));
        g.rect(0, 0, g.width, g.height);
    }
    joypadDown(key) { }
    joypadUp(key) { }
}
exports.FadeState = FadeState;
class FadeTransitionState extends state_1.BaseState {
    constructor(parent, name, background) {
        super(parent, `${name}(FadeTransitionState)`);
        this.fadeInState = new FadeInState(this.parent, Color.BLACK);
        this.fadeOutState = new FadeOutState(this.parent, Color.BLACK);
        this.transitionFinished = false;
        this.background = background;
    }
    update(g) { }
    draw(g) {
        g.background(g.color(this.background));
    }
    joypadDown(key) { }
    joypadUp(key) { }
    onEnter(g) {
        super.onEnter(g);
        this.parent.enterState(this.fadeInState);
    }
    onExit(g) {
        super.onExit(g);
        this.parent.enterState(this.fadeOutState);
    }
}
exports.FadeTransitionState = FadeTransitionState;
class FadeInState extends FadeState {
    constructor(parent, color) {
        super(parent, 60, color);
        this.fadeState = new FadeState(this.parent, 60, color);
        this.fadeState.fadeIn = true;
    }
    update(g) {
        super.update(g);
        if (this.fadeState.finished()) {
            this.parent.exitState();
        }
        else {
            this.parent.enterState(this.fadeState);
        }
    }
    draw(g) { }
    joypadDown(key) { }
    joypadUp(key) { }
}
exports.FadeInState = FadeInState;
class FadeOutState extends FadeState {
    constructor(parent, color) {
        super(parent, 60, color);
        this.fadeState = new FadeState(this.parent, 60, color);
        this.fadeState.fadeIn = false;
    }
    update(g) {
        super.update(g);
        if (this.fadeState.finished()) {
            this.parent.exitState();
        }
        else {
            this.parent.enterState(this.fadeState);
        }
    }
    draw(g) { }
    joypadDown(key) { }
    joypadUp(key) { }
}
exports.FadeOutState = FadeOutState;
