"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getP5Color = exports.SLATE_GLASS = exports.OFF_WHITE = exports.DARK_BLUE = exports.DARK_GREEN = exports.DARK_RED = exports.LIGHT_MAGENTA = exports.LIGHT_CYAN = exports.LIGHT_YELLOW = exports.LIGHT_RED = exports.LIGHT_BLUE = exports.LIGHT_GREEN = exports.DARK_GRAY = exports.LIGHT_GRAY = exports.GRAY = exports.TRANSPARENT = exports.MAGENTA = exports.CYAN = exports.YELLOW = exports.BLUE = exports.GREEN = exports.RED = exports.BLACK = exports.WHITE = void 0;
exports.WHITE = [255, 255, 255, 255];
exports.BLACK = [0, 0, 0, 255];
exports.RED = [255, 0, 0, 255];
exports.GREEN = [0, 255, 0, 255];
exports.BLUE = [0, 0, 255, 255];
exports.YELLOW = [255, 255, 0, 255];
exports.CYAN = [0, 255, 255, 255];
exports.MAGENTA = [255, 0, 255, 255];
exports.TRANSPARENT = [0, 0, 0, 0];
exports.GRAY = [128, 128, 128, 255];
exports.LIGHT_GRAY = [192, 192, 192, 255];
exports.DARK_GRAY = [64, 64, 64, 255];
exports.LIGHT_GREEN = [155, 188, 15, 255];
exports.LIGHT_BLUE = [0, 0, 255, 255];
exports.LIGHT_RED = [255, 0, 0, 255];
exports.LIGHT_YELLOW = [255, 255, 0, 255];
exports.LIGHT_CYAN = [0, 255, 255, 255];
exports.LIGHT_MAGENTA = [255, 0, 255, 255];
exports.DARK_RED = [68, 12, 35, 255];
exports.DARK_GREEN = [35, 68, 12, 255];
exports.DARK_BLUE = [12, 35, 68, 255];
exports.OFF_WHITE = [250, 249, 246, 255];
exports.SLATE_GLASS = [81, 81, 81, 128];
const getP5Color = (p5, color) => {
    return p5.color(color[0], color[1], color[2], color[3]);
};
exports.getP5Color = getP5Color;
