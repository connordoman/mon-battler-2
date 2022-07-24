import * as P5 from "p5";
import { StateMachine } from "./statemachine";
import { TitleScreenState } from "./states/titlescreen";
import * as Color from "./color";
import { OverworldMap } from "./states/overworld";
import { JoypadController } from "./joypad";

export const DEBUG: boolean = true;

export const MAX_PIXEL: number = 3;
export const GAME_WIDTH: number = 240;
export const GAME_HEIGHT: number = 160;

export const ORIENTATION_PORTRAIT: number = 0;
export const ORIENTATION_LANDSCAPE: number = 1;
export const ORIENTATION_DESKTOP: number = 2;

export function gOrientationStr(orientation: number): string {
    switch (orientation) {
        case ORIENTATION_PORTRAIT:
            return "portrait";
        case ORIENTATION_LANDSCAPE:
            return "landscape";
        case ORIENTATION_DESKTOP:
            return "desktop";
        default:
            return "unknown";
    }
}

export let pixelWidth: number = 3;
export let pixelHeight: number = 3;

export const ACTUAL_PIXEL_WIDTH = (pixels?: number): number => {
    if (pixels) {
        return pixels * pixelWidth;
    }
    return GAME_WIDTH * pixelWidth;
};
export const ACTUAL_PIXEL_HEIGHT = (pixels?: number): number => {
    if (pixels) {
        return pixels * pixelHeight;
    }
    return GAME_HEIGHT * pixelHeight;
};
export const WIDTH = () => ACTUAL_PIXEL_WIDTH();
export const HEIGHT = () => ACTUAL_PIXEL_HEIGHT();

export class GameData {
    canv: P5.Element;
    map: OverworldMap;
    stateMachine: StateMachine;
    joypad: JoypadController;
    key: string;
    keyCode: number;
    tileWidth: number;
    tileHeight: number;
    textSize: number;
    frameRate: number;
    orientation: number;

    constructor(canv: P5.Element, map: OverworldMap, stateMachine: StateMachine, joypad: JoypadController) {
        this.canv = canv;
        this.map = map;
        this.stateMachine = stateMachine;
        this.joypad = joypad;
        this.key = "";
        this.keyCode = 0;
        this.tileWidth = pixelWidth * 16;
        this.tileHeight = pixelWidth * 16;
        this.textSize = pixelHeight * 10;
        this.frameRate = 60;
        this.orientation = ORIENTATION_PORTRAIT;
    }
}

// game object type
export interface GameObject {
    update(g: P5): void;
    draw(g: P5): void;
    resize(g: P5): void;
    joypadDown(key: string): void;
    joypadUp(key: string): void;
}

// debug print function
export function gPrint(...args: any[]): void {
    if (DEBUG) {
        console.log(...args);
    }
}

// get pixels from css rem units
export function gConvertRemToPixels(rem: number): number {
    return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
}

export const GAME_DATA: GameData = {
    canv: new P5.Element("canvas"),
    map: new OverworldMap(),
    stateMachine: new StateMachine(),
    joypad: new JoypadController(),
    key: "",
    keyCode: 0,
    tileWidth: pixelWidth * 16,
    tileHeight: pixelHeight * 16,
    textSize: pixelHeight * 10,
    frameRate: 60,
    orientation: ORIENTATION_PORTRAIT,
};

// main p5 logic
export const MONSTER_BATTLER_2 = (p5: P5) => {
    let keyTimer = 0;
    let fps = `${GAME_DATA.frameRate}`;

    let reloadGameData = () => {
        GAME_DATA.textSize = pixelHeight * 10;
        GAME_DATA.tileWidth = pixelWidth * 16;
        GAME_DATA.tileHeight = pixelHeight * 16;
    };

    p5.setup = () => {
        gPrint("Monster Battler 2.0.0");

        let canv = p5.createCanvas(WIDTH(), HEIGHT());
        canv.id("game-canvas");
        canv.parent("game-area");
        GAME_DATA.canv = canv;

        let maxWidth = MAX_PIXEL * GAME_WIDTH;
        let maxHeight = MAX_PIXEL * GAME_HEIGHT;
        if (window.innerWidth / maxWidth < 1 || window.innerHeight / maxHeight < 1) {
            p5.windowResized();
        }

        p5.frameRate(GAME_DATA.frameRate);

        p5.background(0);
        p5.frameRate(60);
        p5.stroke(255);
        p5.strokeWeight(1);
        p5.textFont("monospace");

        GAME_DATA.stateMachine = new StateMachine();
        GAME_DATA.stateMachine.enterState(new TitleScreenState());

        JoypadController.deployJoypadHTML(p5);
        JoypadController.deployControlsTable();
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

        if (p5.frameCount % GAME_DATA.frameRate == 0) {
            fps = p5.frameRate().toFixed(2);
        }

        // draw state stack on top of everything
        if (DEBUG) {
            let states = GAME_DATA.stateMachine.stateArray();

            p5.fill(Color.SLATE_GLASS);
            p5.rect(0, 0, WIDTH(), GAME_DATA.textSize + (states.length + 1) * (GAME_DATA.textSize / 2));
            p5.fill(Color.OFF_WHITE);
            p5.textSize(GAME_DATA.textSize / 2);
            p5.textAlign(p5.LEFT, p5.TOP);
            p5.text(
                "FPS: " + fps,
                GAME_DATA.textSize / 4,
                GAME_DATA.textSize / 4 + (GAME_DATA.textSize / 2) * states.length
            );

            p5.text(
                "Orientation: " + gOrientationStr(GAME_DATA.orientation),
                GAME_DATA.textSize / 4,
                GAME_DATA.textSize / 4 + (GAME_DATA.textSize / 2) * (states.length + 1)
            );

            for (let i = 0; i < states.length; i++) {
                p5.text(
                    `${i}: ${states[i].name}[${states[i].phase}]`,
                    GAME_DATA.textSize / 4,
                    GAME_DATA.textSize / 4 + i * (GAME_DATA.textSize / 2)
                );
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

    p5.windowResized = () => {
        let maxWidth = GAME_WIDTH * MAX_PIXEL;
        let maxHeight = GAME_HEIGHT * MAX_PIXEL;
        let width = 0;
        let height = 0;
        let wRatio = window.innerWidth / maxWidth;
        let hRatio = window.innerHeight / maxHeight;

        if (wRatio < 1) {
            hRatio = wRatio;
            width = window.innerWidth;
            height = wRatio * maxHeight;
            GAME_DATA.orientation = ORIENTATION_PORTRAIT;
        } else if (hRatio < 1) {
            wRatio = hRatio;
            width = hRatio * maxWidth;
            height = window.innerHeight;
            GAME_DATA.orientation = ORIENTATION_LANDSCAPE;
        } else {
            wRatio = 1;
            hRatio = 1;
            width = maxWidth;
            height = maxHeight;
            GAME_DATA.orientation = ORIENTATION_DESKTOP;
        }

        pixelWidth = wRatio * MAX_PIXEL;
        pixelHeight = hRatio * MAX_PIXEL;

        reloadGameData();
        p5.resizeCanvas(width, height);
        GAME_DATA.stateMachine.resize(p5);

        let gameCanv = document.getElementById(GAME_DATA.canv.id()) as HTMLCanvasElement;
        let controls = document.getElementById("controls") as HTMLTableElement;
        switch (GAME_DATA.orientation) {
            case ORIENTATION_PORTRAIT:
                if (controls) controls.style.display = "none";
                if (gameCanv) gameCanv.style.margin = "2em";
                break;
            case ORIENTATION_LANDSCAPE:
                if (controls) controls.style.display = "none";
                if (gameCanv) gameCanv.style.margin = "0";
                break;
            case ORIENTATION_DESKTOP:
                if (gameCanv) gameCanv.style.margin = "2em";
                break;
            default:
                break;
        }

        JoypadController.repositionJoypad(gameCanv);
    };
};

new P5(MONSTER_BATTLER_2);
