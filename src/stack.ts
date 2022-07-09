export class Stack<T> {
    stack: Array<T>;
    count: number;

    constructor() {
        this.stack = [];
        this.count = 0;
    }

    push(item: T) {
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
        return this.count;
    }

    bottomUp(): Array<T> {
        if (this.count === 0) {
            return [];
        }
        return this.stack.slice(0);
    }
}
