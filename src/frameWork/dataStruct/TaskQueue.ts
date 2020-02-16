/*
 * @Author: xianqian 
 * @Date: 2018-12-14 20:07:28 
 * @Last Modified by: 雪糕
 * @Last Modified time: 2020-02-16 21:31:41
 */
/**任务队列 */
class TaskQueue {
    protected _queue: LinkedList<TaskDelegate> = new LinkedList<TaskDelegate>();
    // private _finishCB: () => void;

    public get length(): number {
        return this._queue.length;
    }

    // public setFinishCB(finishCB: () => void) {
    //     this._finishCB = finishCB;
    // }

    /**执行下一个任务 执行时会从列表移除任务 */
    public execute(): TaskDelegate {
        if (this._queue.length === 0) {
            return;
        }

        let task = this.pop();
        task.callBack(...task.parm);
        return task;
        // if (this._queue.length <= 0 && this._finishCB) {
        //     this._finishCB();
        // }
    }

    /**清空所有任务 */
    public clear() {
        this._queue.forEach((value) => {
            pool.push(value);
        });
        this._queue.clear();
    }

    /**任务进队列 */
    public push(cb: Function, thisObject: any, ...parm: any[]): LinkedNode<TaskDelegate> {
        let task = pool.pop(TaskDelegate);
        task.refQueue = this;
        task.callBack = cb.bind(thisObject);
        task.parm = parm;
        return this._queue.add(task);
    }

    /**任务出队列 */
    private pop(): TaskDelegate {
        let task = this._queue.head.value;
        this._queue.remove(this._queue.head);

        pool.push(task);
        return task;
    }

    /**移走某个任务 */
    public removeTask(taskNode: LinkedNode<TaskDelegate>) {
        this._queue.remove(taskNode);
    }
}

/**任务委托 */
class TaskDelegate implements IPool {
    public refQueue: TaskQueue;
    public callBack: Function;
    public parm: any;

    public onInit(...args: any[]): void {
        this.refQueue = null;
        this.callBack = null;
        this.parm = null;
    }
    public onUnInit(): void {
        //不要在这里清空数据 外部还会用到参数
    }

    // /**任务完成后调用 */
    // public finish() {
    //     this.refQueue.execute();
    // }
}