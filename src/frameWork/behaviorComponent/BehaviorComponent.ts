/**
 * @author 雪糕 
 * @desc 非对象池行为组件 挂载在BehaviorOwner上 一般只需要继承onAdd onDestory
 *          未使用对象池 场景内或者大量的需要使用对象池版本BehaviorPoolComponent
 * @date 2020-02-08 17:34:57 
 * @Last Modified by: 雪糕
 * @Last Modified time: 2020-02-16 22:12:11
 */
class BehaviorComponent extends HashObjectExt {
    private _refOwner: BehaviorOwner;//引用的主体
    private _enable: boolean;//是否启用 没启用的不会自动执行方法 主要针对监听的某些事件触发

    public get enable(): boolean {
        return this._enable;
    }
    public set enable(e: boolean) {
        if (this._enable === e) {
            return;
        }
        this._enable = e;
        if (e) {
            this.onEnable();
        }
        else {
            this.onDisable();
        }
    }

    /** !!业务层不使用 */
    public constructor() {
        super();
    }

    /** 引用的母体 */
    public get refOwner(): BehaviorOwner {
        return this._refOwner;
    }

    /** 摧毁自己 */
    public destory() {
        if (this.checkExist()) {
            this._refOwner.removeOneComponent(this);
        }
    }

    /** 当被添加到母体时触发 */
    protected onAdd(...args: any[]) {

    }

    /** 当从母体删除时触发 */
    protected onDestory() {

    }

    /** 当被启用 */
    protected onEnable() {

    }

    /** 当取消启用 */
    protected onDisable() {

    }

    /** 检查是否已经被销毁 子类方法应该都要检查 */
    public checkExist(): boolean {
        if (this._refOwner) {
            return true;
        }

        logger.warn(LOG_TAG.frameWork, `behaviorComponent is destroyed`);
        return false;
    }

    /** 业务层不使用 给Owner使用 */
    public $destory() {
        this.enable = false;
        this.onDestory();
        this._refOwner = null;
    }

    /** 业务层不使用 给Owner使用 */
    public $addToOwner(owner: BehaviorOwner, ...args: any[]) {
        this._refOwner = owner;
        this.enable = true;
        this.onAdd(...args);
    }
}