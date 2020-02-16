/*
 * @Author: xianqian 
 * @Date: 2018-12-14 16:06:21 
 * @Last Modified by: xiangqian
 * @Last Modified time: 2019-10-30 13:59:11
 */

/**链表节点 */
class LinkedNode<T> {
    public prev: LinkedNode<T> = null;
    public next: LinkedNode<T> = null;
    public value: T;

    constructor(v: T) {
        this.value = v;
    }
}

/**链表 */
class LinkedList<T> {
    private _head: LinkedNode<T>;
    private _tail: LinkedNode<T>;
    private _length: number = 0;

    public get length(): number {
        return this._length;
    }

    /**头 链表空没有头 */
    public get head(): LinkedNode<T> {
        return this._head;
    }

    /**尾 链表空没有尾 */
    public get tail(): LinkedNode<T> {
        return this._tail;
    }

    /**添加元素 链表尾 */
    public add(add: T): LinkedNode<T> {
        let node = new LinkedNode<T>(add);
        if (!this._tail) {
            this._head = this._tail = node;
        }
        else {
            this._tail.next = node;
            node.prev = this._tail;
            this._tail = node;
        }
        this._length++;
        return node;
    }

    /**插入元素 在item之前 */
    public insert(item: LinkedNode<T>, add: T): LinkedNode<T> {
        if (this._length === 0 || !item) {
            return null;
        }

        //item已经无效
        if (item !== this._head && !item.prev) {
            return null;
        }

        let node = new LinkedNode<T>(add);
        if (item !== this._head) {
            item.prev.next = node;
            node.prev = item.prev;
        }
        else {
            node.prev = null;
            this._head = node;
        }
        item.prev = node;
        node.next = item;

        this._length++;
        return node;
    }

    /**删除节点 */
    public remove(r: LinkedNode<T>): boolean {
        if (this._length === 0) {
            return false;
        }

        if (!r) {
            return false;
        }

        //已经无效
        if (r !== this._head && !r.prev) {
            return false;
        }

        //已经无效
        if (r !== this._tail && !r.next) {
            return false;
        }

        if (r === this._head && r === this._tail) {
            this._head = this._tail = null;
        }
        else if (r === this._head) {
            this._head = r.next;
            this._head.prev = null;
        }
        else if (r === this._tail) {
            this._tail = r.prev;
            this._tail.next = null;
        }
        else {
            r.prev.next = r.next;
            r.next.prev = r.prev;
        }

        this.destroyNode(r);
        this._length--;

        return true;
    }

    /**清空链表 */
    public clear() {
        if (this._length === 0) {
            return;
        }

        //清理node 防止外部劫持操作
        let e: LinkedNode<T> = this._head;
        let t: LinkedNode<T>;
        while (e) {
            t = e;
            e = e.next;

            this.destroyNode(t);
        }

        this._head = this._tail = null;
        this._length = 0;
    }

    /**
     * 遍历
     * @param callback (value: T) => any
     */
    public forEach(callback: (value: T) => any): void {
        let cur = this._head;
        while (cur) {
            callback(cur.value);
            cur = cur.next;
        }
    }

    /**摧毁节点 */
    private destroyNode(node: LinkedNode<T>) {
        if (!node) {
            return;
        }
        node.prev = null;
        node.next = null;
        node.value = null;
    }
}