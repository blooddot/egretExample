/**
 * @author 雪糕 
 * @desc 示例基类
 * @date 2020-02-08 16:23:34 
 * @Last Modified by: 雪糕
 * @Last Modified time: 2020-02-16 23:19:04
 */
abstract class ExBase implements IPool {
    public abstract onInit(...args);

    public abstract onUnInit();

    private _className: string;
    public setClassName(value: string) {
        this._className = value;
    }
    /** 类名 */
    public get className(): string {
        return this._className;
    }

    private _showed: boolean;
    /** 外部不访问 也不重写 */
    public $show(...args: any[]) {
        this._showed = true;
        this.onShow();
    }

    protected abstract onShow();

    /** 外部不访问 也不重写 */
    public $hide() {
        if (!this._showed) return;
        this.onHide();
    }

    protected abstract onHide();
}