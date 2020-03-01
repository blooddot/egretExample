/**
  @author long 
  @desc 
  @date 2018-09-19 11:50:10 
 * @Last Modified by: long
 * @Last Modified time: 2018-12-17 14:13:20
 */
abstract class GuiNovice extends GuiComponent {
    protected _endCallback: () => void;
    protected _inited: boolean;
    /** 是否缓存 缓存后存到WindowManager里 */
    public needCache: boolean = false;
    public noviceName: string;

    public abstract get pkgName(): string;

    public abstract get resName(): string;

    public set gcomponent(value: fairygui.GComponent) {
        egret.superSetter(GuiNovice, this, "gcomponent", value);
        this.gcomponent.focusable = true;
        this.displayObject.addEventListener(egret.Event.ADDED_TO_STAGE, this.__onShown, this);
        this.displayObject.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.__onHidden, this);
    }

    public get gcomponent(): fairygui.GComponent {
        return egret.superGetter(GuiAlert, this, "gcomponent");
    }

    //-------------------------init
    public init(): void {
        if (this._inited) {
            return;
        }
        this._inited = true;
        this.onInit();
        this.dispatchEventWith(GuiEvent.GUI_NOVICE_INITED, false);
    }

    protected onInit(): void { }

    //--------------------------show
    public show(data?: any): void { }

    protected __onShown(evt: egret.Event): void {
        this.dispatchEventWith(GuiEvent.GUI_NOVICE_SHOWED, false);
        this.doShowAnimation();
    }

    /**
     * 显示时的动画效果
     */
    protected doShowAnimation(): void {
        this.onShown();
    }

    protected onShown(): void {
        this.onStageResize();
    }

    //--------------------------hide
    public hide(data?: any): void {
        this.doHideAnimation();
    }

    /**
     * 关闭时的动画效果
     */
    protected doHideAnimation(): void {
        this.hideImmediately();
    }

    public hideImmediately(): void {
        this.removeFromParent();
    }

    protected __onHidden(evt: egret.Event): void {
        this.dispatchEventWith(GuiEvent.GUI_NOVICE_HIDED, false);
        this.onHide();
    }

    protected onHide(): void {

    }

    public onStageResize(): void { }

    protected onDispose(): void {
        let self = this;
        self.displayObject.removeEventListener(egret.Event.ADDED_TO_STAGE, self.__onShown, self);
        self.displayObject.removeEventListener(egret.Event.REMOVED_FROM_STAGE, self.__onHidden, self);
        if (self.parent != null) {
            self.hideImmediately();
        }
        super.onDispose();
    }

    public get inited(): boolean {
        return this._inited;
    }
}