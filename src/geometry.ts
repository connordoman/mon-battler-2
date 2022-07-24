import * as P5 from "p5";
import * as Color from "./color";

export class Vector {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    add(v: Vector): Vector {
        return new Vector(this.x + v.x, this.y + v.y);
    }

    sub(v: Vector): Vector {
        return new Vector(this.x - v.x, this.y - v.y);
    }

    mul(s: number): Vector {
        return new Vector(this.x * s, this.y * s);
    }

    div(s: number): Vector {
        return new Vector(this.x / s, this.y / s);
    }

    mag(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    normalize(): Vector {
        return this.div(this.mag());
    }

    dot(v: Vector): number {
        return this.x * v.x + this.y * v.y;
    }

    cross(v: Vector): number {
        return this.x * v.y - this.y * v.x;
    }
}

export interface Shape {
    update(g: P5): void;
    draw(g: P5): void;
}

export abstract class Polygon implements Shape {
    x: number;
    y: number;
    width: number;
    height: number;
    color: Color.Color;
    stroke: Color.Color;
    outline: number;

    constructor(x: number, y: number, width: number, height: number) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = Color.BLACK;
        this.stroke = Color.BLACK;
        this.outline = 0;
    }

    set position(pos: Vector) {
        this.x = pos.x;
        this.y = pos.y;
    }

    get position(): Vector {
        return new Vector(this.x, this.y);
    }

    abstract update(g: P5): void;
    abstract draw(g: P5): void;
}

export class Rectangle extends Polygon {
    constructor(x: number, y: number, width: number, height: number) {
        super(x, y, width, height);
    }

    update(g: P5) {}

    draw(g: P5) {
        g.fill(g.color(this.color));
        g.rect(this.x, this.y, this.width, this.height);
    }
}

export class Circle extends Polygon {
    constructor(x: number, y: number, radius: number) {
        super(x, y, radius * 2, radius * 2);
    }

    update(g: P5): void {}

    draw(g: P5): void {
        g.fill(g.color(this.color));
        g.ellipse(this.x, this.y, this.width, this.height);
    }
}

export class Triangle extends Polygon {
    angle: number;
    x1: number;
    x2: number;
    x3: number;
    y1: number;
    y2: number;
    y3: number;

    constructor(x: number, y: number, side: number) {
        super(x, y, side, side * Math.sqrt(3 / 4));
        this.angle = 0;

        // compute geometry
        this.x1 = this.x2 = this.x3 = this.y1 = this.y2 = this.y3 = 0;

        this.computeGeometry();
    }

    setSize(size: number) {
        this.width = size;
        this.height = size * Math.sqrt(3 / 4);
        this.computeGeometry();
    }

    computeGeometry(): void {
        let a = (this.width / 2) * Math.tan(Math.PI / 6);
        let c = this.height - a;
        let hW = this.width / 2;
        this.x1 = hW;
        this.y1 = a;
        this.x2 = 0;
        this.y2 = -c;
        this.x3 = -hW;
        this.y3 = this.y1;
    }

    setAngle(theta: number) {
        this.angle = theta;
    }

    rotateClockwise() {
        this.angle += Math.PI / 3;
    }

    rotateCounterClockwise() {
        this.angle -= Math.PI / 3;
    }

    update(g: P5): void {}

    draw(g: P5): void {
        g.push();
        // Rotating is easier with p5 because I dont wanna do math (yet)
        g.translate(this.x, this.y);
        g.rotate(this.angle);

        g.fill(g.color(this.color));

        g.beginShape();
        // lower right point
        g.vertex(this.x1, this.y1);
        // top point
        g.vertex(this.x2, this.y2);
        // lower left point
        g.vertex(this.x3, this.y3);
        g.endShape(g.CLOSE);
        g.pop();
    }
}
