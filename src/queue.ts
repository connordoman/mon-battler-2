export class Queue<T> {
    queue: Array<T>;
    size: number;

    constructor() {
        this.queue = [];
        this.size = 0;
    }

    resize() {
        let newQueue = new Array<T>(this.queue.length * 2);
        for (let i = 0; i < this.queue.length; i++) {
            newQueue[i] = this.queue[i];
        }
        this.queue = newQueue;
    }

    push(item: T) {
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
