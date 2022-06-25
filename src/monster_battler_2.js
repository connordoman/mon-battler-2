"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const P5 = require("p5");
class Stack {
    constructor() {
        this.stack = [];
    }
    push(item) {
        this.stack.push(item);
    }
    pop() {
        return this.stack.pop();
    }
    peek() {
        return this.stack[this.stack.length - 1];
    }
    isEmpty() {
        return this.stack.length === 0;
    }
    clear() {
        this.stack = [];
    }
}
const KEY_LAYOUT = {
    UP: false,
    DOWN: false,
    LEFT: false,
    RIGHT: false,
    SPACE: false,
    ENTER: false,
    ESCAPE: false,
};
class KeyStatus {
    constructor(g) {
        this.g = g;
        this.keyStatus = Object.assign({}, KEY_LAYOUT);
    }
    setKeyStatus(key, status) {
        this.keyStatus[key] = status;
    }
    getKeyStatus(key) {
        return this.keyStatus[key];
    }
    getKeyDown() {
        return this.g.keyCode;
    }
}
class BaseState {
    constructor(g, name) {
        this.g = g;
        this.name = name;
        this.keyState = new KeyStatus(g);
    }
    onEnter() {
        console.log(`State "${this.name}" entered`);
    }
    onExit() {
        console.log(`State "${this.name}" exited`);
    }
    update() {
        this.g.text(this.keyState.getKeyDown(), 10, 10);
    }
    draw() { }
    keyDown() { }
}
class SplashScreenState extends BaseState {
    constructor(g) {
        super(g, "SplashScreenState");
        this.timer = 0;
        this.timer = 0;
    }
    onEnter() {
        console.log(`State "${this.name}" entered`);
    }
    onExit() {
        console.log(`State "${this.name}" exited`);
    }
    update() {
        super.update();
        this.g.background(0);
        if (this.timer % 60 < 30) {
            this.g.fill(255);
            this.g.textSize(32);
            this.g.textAlign(this.g.CENTER, this.g.CENTER);
            this.g.text("Press any key to start", this.g.width / 2, this.g.height / 2);
        }
        this.timer++;
    }
    keyDown() { }
}
class StateMachine {
    constructor(g) {
        this.g = g;
        this.states = new Stack();
    }
    enter(state) {
        this.states.push(state);
        this.currentState().onEnter();
    }
    currentState() {
        return this.states.peek();
    }
    exit() {
        if (!this.states.isEmpty()) {
            this.currentState().onExit();
            this.states.pop();
        }
    }
    update() {
        if (!this.states.isEmpty()) {
            this.currentState().update(this);
        }
        else {
        }
    }
}
const MONSTER_BATTLER_2 = (p5) => {
    const WIDTH = 720;
    const HEIGHT = 480;
    const PIXEL_WIDTH = 3;
    const PIXEL_HEIGHT = 3;
    const LIGHT_GREEN = p5.color(155, 188, 15);
    const OFF_WHITE = p5.color("#FAF9F6");
    let stateMachine = new StateMachine(p5);
    let randomNoiseOnce = false;
    p5.setup = () => {
        console.log("Monster Battler 2.0.0");
        p5.createCanvas(WIDTH, HEIGHT);
        p5.background(0);
        p5.frameRate(60);
        p5.stroke(255);
        p5.strokeWeight(1);
        stateMachine.enter(new SplashScreenState(p5));
    };
    p5.draw = () => {
        p5.background(OFF_WHITE);
        p5.noStroke();
        // Random noise pattern (no loop only)
        // this.randomNoisePattern();
        stateMachine.update();
    };
    p5.keyPressed = () => {
        stateMachine.currentState().keyDown(p5.keyCode);
    };
    let randomNoisePattern = () => {
        if (!randomNoiseOnce) {
            for (let i = 0; i < WIDTH; i += PIXEL_WIDTH) {
                for (let j = 0; j < HEIGHT; j += PIXEL_HEIGHT) {
                    p5.fill(randomColor());
                    p5.rect(i, j, i + PIXEL_WIDTH, j + PIXEL_HEIGHT);
                }
            }
        }
        randomNoiseOnce = true;
    };
    let randomColor = () => {
        return p5.color(p5.random(0, 255), p5.random(0, 255), p5.random(0, 255));
    };
};
new P5(MONSTER_BATTLER_2);
