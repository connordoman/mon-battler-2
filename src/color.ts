import * as P5 from "p5";
export type Color = [r: number, g: number, b: number, a: number];

export const WHITE: Color = [255, 255, 255, 255];
export const BLACK: Color = [0, 0, 0, 255];
export const RED: Color = [255, 0, 0, 255];
export const GREEN: Color = [0, 255, 0, 255];
export const BLUE: Color = [0, 0, 255, 255];
export const YELLOW: Color = [255, 255, 0, 255];
export const CYAN: Color = [0, 255, 255, 255];
export const MAGENTA: Color = [255, 0, 255, 255];
export const TRANSPARENT: Color = [0, 0, 0, 0];
export const TRANSPARENT_WHITE: Color = [255, 255, 255, 0];
export const GRAY: Color = [128, 128, 128, 255];
export const BROWN: Color = [123, 63, 0, 255];
export const LIGHT_GRAY: Color = [192, 192, 192, 255];
export const DARK_GRAY: Color = [64, 64, 64, 255];
export const LIGHT_GREEN: Color = [155, 188, 15, 255];
export const LIGHT_BLUE: Color = [0, 0, 255, 255];
export const LIGHT_RED: Color = [255, 0, 0, 255];
export const LIGHT_YELLOW: Color = [255, 255, 0, 255];
export const LIGHT_CYAN: Color = [0, 255, 255, 255];
export const LIGHT_MAGENTA: Color = [255, 0, 255, 255];
export const DARK_RED: Color = [68, 12, 35, 255];
export const DARK_GREEN: Color = [35, 68, 12, 255];
export const DARK_BLUE: Color = [12, 35, 68, 255];
export const OFF_WHITE: Color = [250, 249, 246, 255];
export const SLATE_GLASS: Color = [56, 64, 72, 128];
export const SLATE: Color = [56, 64, 72, 255];

export const getP5Color = (p5: P5, color: Color): P5.Color => {
    return p5.color(color[0], color[1], color[2], color[3]);
};
