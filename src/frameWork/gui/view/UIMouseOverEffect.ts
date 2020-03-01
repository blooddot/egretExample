/*
 * @Author: xiangqian 
 * @Date: 2019-11-27 21:48:36 
 * @Last Modified by: xiangqian
 * @Last Modified time: 2019-11-27 23:03:03
 */
/**
 * 按钮或者类似button控制器上鼠标悬浮效果 默认就会自动启动效果 可以随时关掉打开
 * 如果是UI引用该组件对象 可以不释放引用
 * */
class UIMouseOverEffect {
    private _target: fairygui.GObject;
    private _ctrl: fairygui.Controller;//button控制器
    private _defaultPage: string;
    private _overPage: string;
    private _enable: boolean;

    public constructor(target: fairygui.GComponent, ctrlName: string = "button", defaultPage: string = "up", overPage: string = "over") {
        if (!target) {
            logger.error(LOG_TAG.gui, `UIMouseOverEffect target is null`);
            return;
        }

        this._target = target;
        this._ctrl = target.getController(ctrlName);

        if (!this._ctrl) {
            logger.error(LOG_TAG.gui, `UIMouseOverEffect controller not find=${ctrlName}`);
            return;
        }
        this._defaultPage = defaultPage;
        this._overPage = overPage;

        this.enableEffect();
    }

    /**over效果 生效 */
    public enableEffect() {
        if (!this._target || !this._ctrl) {
            return;
        }

        if (this._enable) {
            return;
        }
        this._enable = true;

        // this._target.addEventListener(mouse.MouseEvent.MOUSE_OVER, this.overEffect, this);
        // this._target.addEventListener(mouse.MouseEvent.MOUSE_OUT, this.defaultEffect, this);
    }
    /**over效果 失效 */
    public disableEffect() {
        if (!this._target || !this._ctrl) {
            return;
        }

        if (!this._enable) {
            return;
        }
        this._enable = false;

        this.defaultEffect();//恢复默认状态

        // this._target.removeEventListener(mouse.MouseEvent.MOUSE_OVER, this.overEffect, this);
        // this._target.removeEventListener(mouse.MouseEvent.MOUSE_OUT, this.defaultEffect, this);
    }

    private defaultEffect() {
        this._ctrl.selectedPage = this._defaultPage;
    }

    private overEffect() {
        this._ctrl.selectedPage = this._overPage;
    }
}