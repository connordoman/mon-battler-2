import * as P5 from "p5";

export function sigmoid(z: number): number {
    let k = 2;
    return 1 / (1 + Math.exp(-z / k));
}

export function fadeUpSigmoid(x: number): number {
    return 1 - fadeDownSigmoid(x);
}

export function fadeDownSigmoid(x: number): number {
    let k = 16;
    return -1 / (1 + Math.exp((0.5 - x) * k)) + 1;
}
