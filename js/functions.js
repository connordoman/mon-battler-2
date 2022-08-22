"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fadeDownSigmoid = exports.fadeUpSigmoid = exports.sigmoid = void 0;
function sigmoid(z) {
    let k = 2;
    return 1 / (1 + Math.exp(-z / k));
}
exports.sigmoid = sigmoid;
function fadeUpSigmoid(x) {
    return 1 - fadeDownSigmoid(x);
}
exports.fadeUpSigmoid = fadeUpSigmoid;
function fadeDownSigmoid(x) {
    let k = 16;
    return -1 / (1 + Math.exp((0.5 - x) * k)) + 1;
}
exports.fadeDownSigmoid = fadeDownSigmoid;
