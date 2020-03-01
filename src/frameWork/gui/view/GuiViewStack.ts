/**
 * @author 雪糕 
 * @desc 堆栈式显示视图
 * @date 2018-10-04 20:08:27 
 * @Last Modified by: 雪糕
 * @Last Modified time: 2020-02-27 23:11:34
 */
abstract class GuiViewStack extends GuiGroup {
    /** 关闭按钮 fairygui编辑器里命名为 btnClose*/
    protected _btnClose: fairygui.GObject;
    /** 拖拽区域，当触摸到该区域时，此窗口可拖动 fairygui编辑器里命名为 dragArea */
    protected _dragArea: fairygui.GObject;
    /** 是否已经初始化 */
    protected _inited: boolean;
    /** 是否缓存 */
    public needCache: boolean = true;
    /** 类名 */
    protected _className: string;
    /** 遮罩类型 gui.MODAL_NAME */
    public abstract get modalName(): typeof GuiModal;
    /** fairyGui项目中的包名 gui.PKG_NAME */
    public abstract get pkgName(): string;
    /** fairyGui项目中的资源名 */
    public abstract get resName(): string;
    /**界面打开动画 */
    protected _showAnimType: gui.eShowAnimType = gui.eShowAnimType.default;

    public get className(): string {
        return this._className;
    }

    public set className(value: string) {
        this.gcomponent._rootContainer.name = this._className = value;
    }

    public constructor() {
        super();
    }

    public set gcomponent(value: fairygui.GComponent) {
        egret.superSetter(GuiViewStack, this, "gcomponent", value);
        this.gcomponent.focusable = true;
        this.btnClose = this._gcomponent.getChild('btnClose');

        let area = this._gcomponent.getChild("dragArea");
        if (area && !capabilities.isMobile) {
            this.dragArea = area;
        }

        this.displayObject.addEventListener(egret.Event.ADDED_TO_STAGE, this.__onShown, this);
        this.displayObject.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.__onHidden, this);
    }

    public get gcomponent(): fairygui.GComponent {
        return egret.superGetter(GuiViewStack, this, "gcomponent");
    }

    //-------------------------init
    public init(): void {
        if (this._inited) {
            return;
        }

        this._inited = true;
        this.onInit();
    }

    protected onInit(): void { }

    /**
     * 显示之前会调用
     * @param data 
     */
    public show(...data: any[]): void {
        super.show();
    }

    protected __onShown(evt: egret.Event): void {
        this.dispatchEventWith(GuiEvent.GUI_VIEW_STACK_SHOWED, false);
        this.gobject.x = this.gobject.y = 0;
        this.doShowAnimation();
    }

    /**
     * 显示时的动画效果
     */
    protected doShowAnimation() {
        this.onShown();

        if (this._showAnimType === gui.eShowAnimType.none) return;

        let oriPivotX = this.gcomponent.pivotX;
        let oriPivotY = this.gcomponent.pivotY;
        let tw = egret.Tween.get(this.gcomponent);
        switch (this._showAnimType) {
            case gui.eShowAnimType.default:
                tw.set({ alpha: 0.8, scaleX: 0.95, scaleY: 0.95, pivotX: 0.5, pivotY: 0.5, touchable: false })
                    .to({ scaleX: 1, scaleY: 1, alpha: 1 }, 200)
                    .set({ pivotX: oriPivotX, pivotY: oriPivotY, touchable: true });
                break;
            case gui.eShowAnimType.fullScreen:
            case gui.eShowAnimType.alpha:
                tw.set({ alpha: 0, touchable: false })
                    .to({ alpha: 1 }, 150)
                    .set({ touchable: true });
                break;
            default:
                break;
        }
    }

    /**
     * 在显示动画效果播放完之后调用
     */
    protected onShown(): void {
        this.onStageResize();
    }

    /**
     * 关闭之前会调用
     * @param data 关闭时传输过来的数据
     */
    public hide(data?: any): void {
        super.hide(data);
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
        this.dispatchEventWith(GuiEvent.GUI_VIEW_STACK_HIDED, false);
        this.onHide();
    }

    /**
     * 关闭之后会调用
     */
    protected onHide(): void { }

    public get btnClose(): fairygui.GObject {
        return this._btnClose;
    }

    public set btnClose(value: fairygui.GObject) {
        if (this._btnClose) {
            // this._btnClose.removeEventListener(egret.TouchEvent.TOUCH_END, this.onCloseClick, this);
            this._btnClose.removeClickListener(this.onCloseClick, this);
        }
        this._btnClose = value;
        if (this._btnClose) {
            // this._btnClose.addEventListener(egret.TouchEvent.TOUCH_END, this.onCloseClick, this);
            this._btnClose.addClickListener(this.onCloseClick, this);
        }
    }

    protected onCloseClick(evt: egret.Event): void {
        this.close();
    }

    public abstract close();

    public get dragArea(): fairygui.GObject {
        return this._dragArea;
    }

    public set dragArea(value: fairygui.GObject) {
        if (this._dragArea != value) {
            if (this._dragArea != null) {
                this._dragArea.draggable = false;
                this._dragArea.removeEventListener(fairygui.DragEvent.DRAG_START, this.__dragStart, this);
            }

            this._dragArea = value;
            if (this._dragArea != null) {
                if ((this._dragArea instanceof fairygui.GGraph) && (<fairygui.GGraph><any>(this._dragArea)).displayObject == null) {
                    this._dragArea.asGraph.drawRect(0, 0, 0, 0, 0);
                }
                this._dragArea.draggable = true;
                this._dragArea.addEventListener(fairygui.DragEvent.DRAG_START, this.__dragStart, this);
            }
        }
    }

    public get isShowing(): boolean {
        return this.parent != null;
    }

    public get inited(): boolean {
        return this._inited;
    }

    protected __dragStart(evt: fairygui.DragEvent): void {
        evt.preventDefault();

        this.gcomponent.startDrag(evt.touchPointID);
    }

    public onStageResize(): void { }

    protected onDispose(): void {
        let self = this;
        if (this._btnClose) {
            this._btnClose.removeClickListener(this.onCloseClick, this);
        }
        this.displayObject.removeEventListener(egret.Event.ADDED_TO_STAGE, this.__onShown, this);
        this.displayObject.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.__onHidden, this);
        if (self.parent != null) {
            self.hideImmediately();
        }
        super.onDispose();
    }
}