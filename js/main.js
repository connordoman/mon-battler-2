"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MONSTER_BATTLER_2 = exports.print = exports.TEXT_SIZE = exports.TILE_HEIGHT = exports.TILE_WIDTH = exports.PIXEL_HEIGHT = exports.PIXEL_WIDTH = exports.HEIGHT = exports.WIDTH = exports.DEBUG = void 0;
const P5 = require("p5");
const state_1 = require("./state");
const titlescreen_1 = require("./titlescreen");
exports.DEBUG = true;
exports.WIDTH = 720;
exports.HEIGHT = 480;
exports.PIXEL_WIDTH = 3;
exports.PIXEL_HEIGHT = 3;
exports.TILE_WIDTH = 16 * exports.PIXEL_WIDTH;
exports.TILE_HEIGHT = 16 * exports.PIXEL_HEIGHT;
exports.TEXT_SIZE = exports.PIXEL_HEIGHT * 10.6;
// debug print function
function print(...args) {
    if (exports.DEBUG) {
        console.log(...args);
    }
}
exports.print = print;
// main p5 logic
const MONSTER_BATTLER_2 = (p5) => {
    let stateMachine = new state_1.StateMachine(p5);
    let randomNoiseOnce = false;
    let keyTimer = 0;
    p5.setup = () => {
        print("Monster Battler 2.0.0");
        p5.createCanvas(exports.WIDTH, exports.HEIGHT);
        p5.background(0);
        p5.frameRate(60);
        p5.stroke(255);
        p5.strokeWeight(1);
        stateMachine.enterState(new titlescreen_1.TitleScreenState(stateMachine));
    };
    p5.draw = () => {
        p5.noStroke();
        // Random noise pattern (no loop only)
        // this.randomNoisePattern();
        if (keyTimer !== 0) {
            keyTimer++;
        }
        else if (keyTimer >= 60) {
            keyTimer = 0;
        }
        stateMachine.update(p5);
        stateMachine.draw(p5);
    };
    p5.keyPressed = () => {
        stateMachine.keyPressed(p5.key);
    };
    p5.keyReleased = () => {
        stateMachine.keyReleased(p5.key);
    };
    let randomNoisePattern = () => {
        if (!randomNoiseOnce) {
            for (let i = 0; i < exports.WIDTH; i += exports.PIXEL_WIDTH) {
                for (let j = 0; j < exports.HEIGHT; j += exports.PIXEL_HEIGHT) {
                    p5.fill(randomColor());
                    p5.rect(i, j, i + exports.PIXEL_WIDTH, j + exports.PIXEL_HEIGHT);
                }
            }
        }
        randomNoiseOnce = true;
    };
    let randomColor = () => {
        return p5.color(p5.random(0, 255), p5.random(0, 255), p5.random(0, 255));
    };
};
exports.MONSTER_BATTLER_2 = MONSTER_BATTLER_2;
new P5(exports.MONSTER_BATTLER_2);
