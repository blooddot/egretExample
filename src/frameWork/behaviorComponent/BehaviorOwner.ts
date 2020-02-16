/**
 * @author 雪糕 
 * @desc 行为组件的宿主
 * @date 2020-02-08 17:37:15 
 * @Last Modified by: 雪糕
 * @Last Modified time: 2020-02-08 17:48:02
 */
class BehaviorOwner extends HashObjectExt {
    private _refComponents: BehaviorComponent[] = [];
    private _enable: boolean = false;//是否启用 没启用的不会自动执行方法 主要针对监听的某些事件触发
    protected _inited: boolean = false;

    public get enable(): boolean {
        return this._enable;
    }
    public set enable(value: boolean) {
        if (this._enable === value) {
            return;
        }

        this._enable = value;
        if (value) {
            this.onEnable();
        } else {
            this.onDisable();
        }
    }

    public get inited(): boolean {
        return this._inited;
    }

    /** 初始化 Owner需要初始化才能生效 */
    public init(): boolean {
        if (this._inited) {
            return false;
        }
        this._inited = true;
        this.onInit();
        this.enable = true;
        return true;
    }

    /** 摧毁自己 外部引用也需要主动断开 */
    public destroy() {
        if (!this._inited) {
            return;
        }
        this._inited = false;
        this.enable = false;
        this.onDestroy();
        this.destoryAllComponent();
    }

    protected onInit() {

    }

    protected onDestroy() {

    }

    protected onEnable() {
    }

    protected onDisable() {
    }

    public hasComponent(cls: typeof BehaviorComponent): boolean {
        for (let c of this._refComponents) {
            if (c instanceof cls) {
                return true;
            }
        }
        return false;
    }

    /**获取某个类型的组件 没有返回null */
    public getComponent<T extends BehaviorComponent>(cls: new () => T): T {
        for (let c of this._refComponents) {
            if (c instanceof cls) {
                return c as T;
            }
        }
        return null;
    }

    //暂时不提供加载多个同类型组件 都用getAdd替代
    /**母体上添加一个T类型的组件 返回添加的组件*/
    protected addComponent<T extends BehaviorComponent>(c: new () => T): T {
        let target: T = null;

        //如果是对象池对象则从对象池拿 TODO:实在没办法了  只能这种傻逼写法 支持混淆
        if (RELEASE) {
            if (c.prototype.__types__.indexOf(BehaviorPoolComponent.prototype["__class__"]) >= 0) {
                target = pool.pop(c as any) as any;
            }
        }
        else {
            if ("onInit" in c.prototype && "onUnInit" in c.prototype) {
                target = pool.pop(c as any) as any;
            }
        }

        //对象池没有拿到
        if (!target) {
            target = new c();
        }

        this._refComponents.push(target);
        target.$addToOwner(this);
        return target;
    }

    /**删除母体上所有的某个类型组件 */
    public removeTypeComponent(cls: typeof BehaviorComponent) {
        for (let i = 0; i < this._refComponents.length; i++) {
            if (this._refComponents[i] instanceof cls) {
                this.destoryComponent(i);
                i--;
            }
        }
    }

    /**删除母体上的某个组件 */
    public removeOneComponent(cls: typeof BehaviorComponent | BehaviorComponent) {
        let index = -1;
        if (cls instanceof BehaviorComponent) {
            index = this._refComponents.indexOf(cls);
        } else {
            index = this._refComponents.findIndex((o) => o instanceof cls);
        }

        if (index >= 0) {
            this.destoryComponent(index);
        }
    }

    /**一定能获取到某个类型组件 没有就自动添加 */
    public getAddComponent<T extends BehaviorComponent>(c: new () => T): T {
        let target: T = this.getComponent<T>(c);
        if (target) {
            return target;
        }

        return this.addComponent(c);
    }

    //真实删掉组件
    private destoryComponent(index: number) {
        if (this._refComponents.length > index) {
            //也许被别人组件删除了
            if (this._refComponents[index].refOwner) {
                let cpt = this._refComponents[index];
                this._refComponents.splice(index, 1);
                cpt.$destory();
            }
        }
    }

    //删除所有组件
    private destoryAllComponent() {
        //倒序删除 防止有些组件的依赖关系
        let i = this._refComponents.length - 1;
        for (i; i >= 0; i--) {
            //有可能被别人删除了
            if (this._refComponents.length > 0) {
                this._refComponents.pop().$destory();
            }
        }
    }

    //遍历所有启用的组件 子类可以扩展 一般是针对所有组件通用方法使用  比如每帧执行等
    protected foreachEnabledComponent(f: Function) {
        for (let c of this._refComponents) {
            if (c.enable) {
            }
        }
    }
}