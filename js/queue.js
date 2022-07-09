"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CircularQueue = exports.Queue = void 0;
class Queue {
    constructor() {
        this.queue = [];
        this.size = 0;
    }
    resize() {
        let newQueue = new Array(this.queue.length * 2);
        for (let i = 0; i < this.queue.length; i++) {
            newQueue[i] = this.queue[i];
        }
        this.queue = newQueue;
    }
    push(item) {
        if (this.size === this.queue.length) {
            this.resize();
        }
        this.queue[this.size] = item;
        this.size++;
    }
    pop() {
        let front = this.queue[0];
        this.queue.splice(0, 1);
        this.size--;
        return front;
    }
    peek() {
        if (this.size === 0) {
            return null;
        }
        return this.queue[0];
    }
    isEmpty() {
        return this.size === 0;
    }
    clear() {
        this.queue = [];
        this.size = 0;
    }
}
exports.Queue = Queue;
class CircularQueue {
    constructor() {
        this.queue = [];
        this.size = 0;
        this.front = -1;
        this.back = -1;
    }
    resize() {
        let newQueue = new Array(this.queue.length * 2);
        for (let i = 0; i < this.queue.length; i++) {
            newQueue[i] = this.queue[i];
        }
        this.queue = newQueue;
    }
    enqueue(item) {
        if (this.size === this.queue.length) {
            this.resize();
        }
        if (this.front === -1) {
            this.front = 0;
        }
        if (this.back === -1) {
            this.back = 0;
        }
        this.queue[this.back] = item;
        this.back = (this.back + 1) % this.queue.length;
        this.size++;
    }
    dequeue() {
        if (this.isEmpty()) {
            return null;
        }
        let frontItem = this.queue[this.front];
        this.queue.splice(this.front, 1);
        this.size--;
        if (this.front === this.back) {
            this.front = -1;
            this.back = -1;
        }
        else {
            this.front = (this.front + 1) % this.queue.length;
        }
        return frontItem;
    }
    peek() {
        if (this.isEmpty()) {
            return null;
        }
        return this.queue[this.front];
    }
    isEmpty() {
        return this.size === 0;
    }
    frontToBack() {
        if (this.isEmpty()) {
            return [];
        }
        if (this.front === this.back) {
            return [this.queue[this.front]];
        }
        // find forward and backward directions
        let frontToBack = this.queue.slice(this.front, this.queue.length);
        let backToFront = this.queue.slice(0, this.back);
        // combine the two arrays
        return frontToBack.concat(backToFront);
    }
    backToFront() {
        if (this.isEmpty()) {
            return [];
        }
        if (this.front === this.back) {
            return [this.queue[this.front]];
        }
        // find forward and backward directions
        let frontToBack = this.queue.slice(this.queue.length, this.front);
        let backToFront = this.queue.slice(this.back, 0);
        // combine the two arrays
        return backToFront.concat(frontToBack);
    }
    toString() {
        let result = "[ ";
        for (let item of this.frontToBack()) {
            result += item + ", ";
        }
        return this.queue.toString() + " ]";
    }
}
exports.CircularQueue = CircularQueue;
