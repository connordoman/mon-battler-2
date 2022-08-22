"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Stack = void 0;
class Stack {
    constructor() {
        this.stack = [];
        this.count = 0;
    }
    push(item) {
        this.stack.push(item);
        this.count++;
    }
    pop() {
        if (this.isEmpty()) {
            return null;
        }
        this.count--;
        return this.stack.pop();
    }
    peek() {
        return this.stack[this.count - 1];
    }
    isEmpty() {
        return this.size() === 0;
    }
    clear() {
        this.stack = [];
        this.count = 0;
    }
    size() {
        if (this.stack === undefined) {
            return 0;
        }
        else if (this.count < 0) {
            return (this.count = 0);
        }
        return this.count;
    }
    get array() {
        return this.stack.slice(0);
    }
}
exports.Stack = Stack;
