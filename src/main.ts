import * as P5 from "p5";
import { StateMachine } from "./state";
import { SplashScreenState } from "./splashscreen";
import { TitleScreenState } from "./titlescreen";

export const WIDTH = 720;
export const HEIGHT = 480;
export const PIXEL_WIDTH = 3;
export const PIXEL_HEIGHT = 3;

export const MONSTER_BATTLER_2 = (p5: P5) => {
    const LIGHT_GREEN = p5.color(155, 188, 15);
    const OFF_WHITE = p5.color("#FAF9F6");

    let stateMachine = new StateMachine(p5);

    let randomNoiseOnce = false;

    let keyTimer = 0;

    p5.setup = () => {
        console.log("Monster Battler 2.0.0");
        p5.createCanvas(WIDTH, HEIGHT);

        p5.background(0);
        p5.frameRate(60);
        p5.stroke(255);
        p5.strokeWeight(1);

        stateMachine.enter(new TitleScreenState(stateMachine));
    };

    p5.draw = () => {
        p5.background(OFF_WHITE);
        p5.noStroke();
        // Random noise pattern (no loop only)
        // this.randomNoisePattern();

        if (keyTimer !== 0) {
            keyTimer++;
        } else if (keyTimer >= 60) {
            keyTimer = 0;
        }
        stateMachine.update();
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
        return p5.color(
            p5.random(0, 255),
            p5.random(0, 255),
            p5.random(0, 255)
        );
    };
};

new P5(MONSTER_BATTLER_2);
