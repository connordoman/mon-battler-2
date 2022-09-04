import * as P5 from "p5";
import { StateMachine } from "./statemachine";
import * as Color from "./color";
import { MAP_PALET_TOWN, OverworldMap, OverworldState } from "./states/overworld";
import { ASCII_KEYS, JoypadController } from "./joypad";
import { SplashScreenState } from "./states/splashscreen";
import { Camera } from "./camera";

export const DEBUG: boolean = true;

export const MAX_PIXEL: number = 2;
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

export let pixelWidth: number = MAX_PIXEL;
export let pixelHeight: number = MAX_PIXEL;

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
    p: P5;
    canv: P5.Element;
    map: OverworldMap;
    camera: Camera;
    stateMachine: StateMachine;
    joypad: JoypadController;
    key: string;
    keyCode: number;
    tileWidth: number;
    tileHeight: number;
    textSize: number;
    frameRate: number;
    orientation: number;

    constructor(p: P5, canv: P5.Element, map: OverworldMap, stateMachine: StateMachine, joypad: JoypadController) {
        this.p = p;
        this.canv = canv;
        this.map = map;
        this.camera = new Camera(0, 0);
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

    reloadGameData(): void {}

    getKeyString(): string {
        let k: string;
        switch (this.keyCode) {
            case ASCII_KEYS.escape:
                k = "ESCAPE";
                break;
            case ASCII_KEYS.enter:
                k = "ENTER";
                break;
            case ASCII_KEYS.backspace:
                k = "BACKSPACE";
                break;
            case ASCII_KEYS.delete:
                k = "DELETE";
                break;
            case ASCII_KEYS.up:
                k = "UP";
                break;
            case ASCII_KEYS.down:
                k = "DOWN";
                break;
            case ASCII_KEYS.left:
                k = "LEFT";
                break;
            case ASCII_KEYS.right:
                k = "RIGHT";
                break;
            default:
                k = this.key;
        }
        return `${k}, ${this.keyCode}`;
    }
}

// game object type
export interface GameObject {
    update(g: GameData): void;
    draw(g: GameData): void;
    resize(g: GameData): void;
    joypadDown(g: GameData): void;
    joypadUp(g: GameData): void;
}

// debug print function
export function gPrint(...args: any[]): void {
    if (DEBUG) {
        console.log(...args);
    }
}

// get pixels from css rem units
export function gGetPixelsFromRem(rem: number): number {
    return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
}

// main p5 logic
export const MONSTER_BATTLER_2 = (p5: P5) => {
    let keyTimer = 0;
    let g: GameData;
    let debugFrameRate: string;

    let reloadGameData = (g: GameData) => {
        g.textSize = pixelHeight * 10;
        g.tileWidth = pixelWidth * 16;
        g.tileHeight = pixelHeight * 16;
    };

    p5.setup = () => {
        gPrint("Monster Battler 2.0.0");

        let canv = p5.createCanvas(WIDTH(), HEIGHT());
        canv.id("game-canvas");
        canv.parent("game-area");

        let maxWidth = MAX_PIXEL * GAME_WIDTH;
        let maxHeight = MAX_PIXEL * GAME_HEIGHT;
        if (window.innerWidth / maxWidth < 1 || window.innerHeight / maxHeight < 1) {
            p5.windowResized();
        }

        g = new GameData(p5, canv, new OverworldMap(), new StateMachine(), new JoypadController());
        g.p = p5;
        g.canv = canv;
        g.map = new OverworldMap();
        g.stateMachine = new StateMachine();
        g.joypad = new JoypadController();
        g.key = "";
        g.keyCode = 0;
        g.tileWidth = pixelWidth * 16;
        g.tileHeight = pixelHeight * 16;
        g.textSize = pixelHeight * 10;
        g.frameRate = 60;
        g.orientation = ORIENTATION_DESKTOP;

        g.p.frameRate(g.frameRate);
        g.p.background(0);
        g.p.frameRate(60);
        g.p.stroke(255);
        g.p.strokeWeight(1);
        g.p.textFont("monospace");

        g.stateMachine = new StateMachine();
        g.stateMachine.enterState(new OverworldState());

        // GAME_DATA.map.initializeFromArray(MAP_PALET_TOWN);

        JoypadController.deployJoypadHTML(g);
        JoypadController.deployControlsTable();
    };

    let fpsString = () => {
        return p5.frameRate().toFixed(2);
    };

    p5.draw = () => {
        if (keyTimer !== 0) {
            keyTimer++;
        } else if (keyTimer >= 30) {
            keyTimer = 0;
        }

        g.stateMachine.update(g);
        g.joypad.update(g);

        g.p.noStroke();

        g.stateMachine.draw(g);

        // draw state stack on top of everything
        if (DEBUG) {
            if (g.p.frameCount % 30 === 0) {
                debugFrameRate = fpsString();
            }

            let states = g.stateMachine.stateArray();
            let overlayString = "";

            overlayString += "Orientation: " + gOrientationStr(g.orientation);
            overlayString += "\n";
            overlayString += "FPS: " + debugFrameRate;
            overlayString += "\n";
            overlayString += "-------------";
            overlayString += "\n";
            overlayString += "State Stack: ";

            let i = 0;
            for (let s of states) {
                overlayString += `\n${i++}: ${s.name}[${s.phase}]`;
            }

            let maxBoxHeight = (g.textSize / 2) * overlayString.split("\n").length;

            p5.fill(Color.SLATE_GLASS);
            p5.rect(0, 0, WIDTH(), g.textSize + maxBoxHeight);
            p5.fill(Color.OFF_WHITE);
            p5.textSize(g.textSize / 2);
            p5.textAlign(p5.LEFT, p5.TOP);
            p5.text(overlayString, g.textSize / 4, g.textSize / 4);
        }
    };

    p5.keyPressed = () => {
        if (p5.keyCode === p5.ESCAPE) {
            console.log("Exiting...");
            p5.noLoop();
        }

        g.key = p5.key;
        g.keyCode = p5.keyCode;
        g.joypad.pressJoypadKey(g);
    };

    p5.keyReleased = () => {
        g.joypad.releaseJoypadKey(g);
        g.key = "";
        g.keyCode = 0;
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
            g.orientation = ORIENTATION_PORTRAIT;
        } else if (hRatio < 1) {
            wRatio = hRatio;
            width = hRatio * maxWidth;
            height = window.innerHeight;
            g.orientation = ORIENTATION_LANDSCAPE;
        } else {
            wRatio = 1;
            hRatio = 1;
            width = maxWidth;
            height = maxHeight;
            g.orientation = ORIENTATION_DESKTOP;
        }

        pixelWidth = wRatio * MAX_PIXEL;
        pixelHeight = hRatio * MAX_PIXEL;

        g.reloadGameData();
        p5.resizeCanvas(width, height);
        g.stateMachine.resize(g);

        let gameCanv = document.getElementById(g.canv.id()) as HTMLCanvasElement;
        let controls = document.getElementById("controls") as HTMLTableElement;
        switch (g.orientation) {
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

        JoypadController.repositionJoypad(g, gameCanv);
    };
};

new P5(MONSTER_BATTLER_2);
