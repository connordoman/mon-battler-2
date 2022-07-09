"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Triangle = exports.Circle = exports.Rectangle = exports.Polygon = exports.Vector = void 0;
const Color = require("./color");
class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    add(v) {
        return new Vector(this.x + v.x, this.y + v.y);
    }
    sub(v) {
        return new Vector(this.x - v.x, this.y - v.y);
    }
    mul(s) {
        return new Vector(this.x * s, this.y * s);
    }
    div(s) {
        return new Vector(this.x / s, this.y / s);
    }
    mag() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    normalize() {
        return this.div(this.mag());
    }
    dot(v) {
        return this.x * v.x + this.y * v.y;
    }
    cross(v) {
        return this.x * v.y - this.y * v.x;
    }
}
exports.Vector = Vector;
class Polygon {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = Color.BLACK;
        this.stroke = Color.BLACK;
        this.outline = 0;
    }
    set position(pos) {
        this.x = pos.x;
        this.y = pos.y;
    }
    get position() {
        return new Vector(this.x, this.y);
    }
}
exports.Polygon = Polygon;
class Rectangle extends Polygon {
    constructor(x, y, width, height) {
        super(x, y, width, height);
    }
    update(g) { }
    draw(g) {
        g.fill(g.color(this.color));
        g.rect(this.x, this.y, this.width, this.height);
    }
}
exports.Rectangle = Rectangle;
class Circle extends Polygon {
    constructor(x, y, radius) {
        super(x, y, radius * 2, radius * 2);
    }
    update(g) { }
    draw(g) {
        g.fill(g.color(this.color));
        g.ellipse(this.x, this.y, this.width, this.height);
    }
}
exports.Circle = Circle;
class Triangle extends Polygon {
    constructor(x, y, side) {
        super(x, y, side, side * Math.sqrt(3 / 4));
        this.angle = 0;
        // compute geometry
        this.x1 = this.x2 = this.x3 = this.y1 = this.y2 = this.y3 = 0;
        this.computeGeometry();
    }
    computeGeometry() {
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
    setAngle(theta) {
        this.angle = theta;
    }
    rotateClockwise() {
        this.angle += Math.PI / 3;
    }
    rotateCounterClockwise() {
        this.angle -= Math.PI / 3;
    }
    update(g) { }
    draw(g) {
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
exports.Triangle = Triangle;
