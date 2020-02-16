/**
 * @author 雪糕 
 * @desc 
 * @date 2020-02-08 19:25:26 
 * @Last Modified by: 雪糕
 * @Last Modified time: 2020-02-08 19:29:03
 */
abstract class BaseModel extends EventDispatcherExt {
    private _inited: boolean;

    constructor() {
        super();
        this._inited = true;
        this.onInit();
    }

    protected abstract onInit();

    public unInit() {
        if (!this._inited) {
            console.error(`销毁了未初始化的实例`);
            return;
        }

        this._inited = false;
        this.onUnInit();
    }

    protected abstract onUnInit();
}