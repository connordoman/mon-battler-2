import * as P5 from "p5";
import { StateMachine } from "./statemachine";
import { TitleScreenState } from "./states/titlescreen";
import * as Color from "./color";
import { OverworldMap } from "./states/overworld";
import { JoypadController } from "./joypad";

export const DEBUG: boolean = true;

export const WIDTH: number = 720;
export const HEIGHT: number = 480;
export const PIXEL_WIDTH: number = 3;
export const PIXEL_HEIGHT: number = 3;
export const TILE_WIDTH: number = 16 * PIXEL_WIDTH;
export const TILE_HEIGHT: number = 16 * PIXEL_HEIGHT;
export const TEXT_SIZE: number = PIXEL_HEIGHT * 10.6;
export const FRAME_RATE: number = 60;

export type GameData = {
    map: OverworldMap;
    stateMachine: StateMachine;
    joypad: JoypadController;
    key: string;
    keyCode: number;
};

// game object type
export interface GameObject {
    update(g: P5): void;
    draw(g: P5): void;
    joypadDown(): void;
    joypadUp(): void;
}

// debug print function
export function gPrint(...args: any[]): void {
    if (DEBUG) {
        console.log(...args);
    }
}

export const GAME_DATA: GameData = {
    map: new OverworldMap(),
    stateMachine: new StateMachine(),
    joypad: new JoypadController(),
    key: "",
    keyCode: 0,
};

// main p5 logic
export const MONSTER_BATTLER_2 = (p5: P5) => {
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

        GAME_DATA.stateMachine = new StateMachine();
        GAME_DATA.stateMachine.enterState(new TitleScreenState());
    };

    p5.draw = () => {
        if (keyTimer !== 0) {
            keyTimer++;
        } else if (keyTimer >= 30) {
            keyTimer = 0;
        }

        GAME_DATA.stateMachine.update(p5);
        GAME_DATA.joypad.update(p5);

        p5.noStroke();

        GAME_DATA.stateMachine.draw(p5);

        if (p5.frameCount % FRAME_RATE == 0) {
            fps = p5.frameRate().toFixed(2);
        }

        if (DEBUG) {
            let states = GAME_DATA.stateMachine.stateArray();

            p5.fill(Color.SLATE_GLASS);
            p5.rect(0, 0, WIDTH, TEXT_SIZE + states.length * (TEXT_SIZE / 2));
            p5.fill(Color.OFF_WHITE);
            p5.textSize(TEXT_SIZE / 2);
            p5.textAlign(p5.LEFT, p5.TOP);
            p5.text("FPS: " + fps, TEXT_SIZE / 4, TEXT_SIZE / 4 + (TEXT_SIZE / 2) * states.length);

            for (let i = 0; i < states.length; i++) {
                p5.text(`${i}: ${states[i].name}`, TEXT_SIZE / 4, TEXT_SIZE / 4 + i * (TEXT_SIZE / 2));
            }
        }
    };

    p5.keyPressed = () => {
        GAME_DATA.key = p5.key;
        GAME_DATA.keyCode = p5.keyCode;
        GAME_DATA.joypad.pressJoypadKey();
    };

    p5.keyReleased = () => {
        GAME_DATA.joypad.releaseJoypadKey();
        GAME_DATA.key = "";
        GAME_DATA.keyCode = 0;
    };
};

new P5(MONSTER_BATTLER_2);
