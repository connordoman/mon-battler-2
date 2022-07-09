import * as P5 from "p5";
import { StateMachine } from "./statemachine";
import { SplashScreenState } from "./splashscreen";
import { TitleScreenState } from "./titlescreen";
import * as Color from "./color";

export const DEBUG: boolean = false;

export const WIDTH: number = 720;
export const HEIGHT: number = 480;
export const PIXEL_WIDTH: number = 3;
export const PIXEL_HEIGHT: number = 3;
export const TILE_WIDTH: number = 16 * PIXEL_WIDTH;
export const TILE_HEIGHT: number = 16 * PIXEL_HEIGHT;
export const TEXT_SIZE: number = PIXEL_HEIGHT * 10.6;
export const FRAME_RATE: number = 60;

// game object type
export interface GameObject {
    update(g: P5): void;
    draw(g: P5): void;
    joypadDown(key: string): void;
    joypadUp(key: string): void;
}

// debug print function
export function gPrint(...args: any[]): void {
    if (DEBUG) {
        console.log(...args);
    }
}

// main p5 logic
export const MONSTER_BATTLER_2 = (p5: P5) => {
    let stateMachine = new StateMachine(p5);

    let randomNoiseOnce = false;

    let keyTimer = 0;

    let fps = `${FRAME_RATE}`;

    p5.setup = () => {
        gPrint("Monster Battler 2.0.0");
        let canv = p5.createCanvas(WIDTH, HEIGHT);
        canv.parent("game-area");

        p5.frameRate(FRAME_RATE);

        p5.background(0);
        p5.frameRate(60);
        p5.stroke(255);
        p5.strokeWeight(1);

        stateMachine.enterState(new TitleScreenState(stateMachine));
    };

    p5.draw = () => {
        p5.noStroke();
        // Random noise pattern (no loop only)
        // this.randomNoisePattern();

        if (keyTimer !== 0) {
            keyTimer++;
        } else if (keyTimer >= 60) {
            keyTimer = 0;
        }
        stateMachine.update(p5);
        stateMachine.draw(p5);

        if (p5.frameCount % FRAME_RATE == 0) {
            fps = p5.frameRate().toFixed(2);
        }

        if (DEBUG) {
            let states = stateMachine.states.bottomUp();

            p5.fill(Color.SLATE_GLASS);
            p5.rect(0, 0, WIDTH, TEXT_SIZE / 2 + states.length * (TEXT_SIZE / 2));
            p5.fill(Color.OFF_WHITE);
            p5.textSize(TEXT_SIZE / 2);
            p5.textAlign(p5.LEFT, p5.TOP);
            p5.text("FPS: " + fps, TEXT_SIZE, TEXT_SIZE);

            for (let i = 0; i < states.length; i++) {
                p5.text(`${i}: ${states[i].name}`, TEXT_SIZE / 4, TEXT_SIZE / 4 + i * (TEXT_SIZE / 2));
            }
        }
    };

    p5.keyPressed = () => {
        stateMachine.keyPressed(p5.key);
    };

    p5.keyReleased = () => {
        stateMachine.keyReleased(p5.key);
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
