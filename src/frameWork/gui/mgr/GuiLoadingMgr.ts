/**
 * @author 雪糕 
 * @desc UI加载管理器
 * @date 2018-04-11 14:53:16 
 * @Last Modified by: 雪糕
 * @Last Modified time: 2020-02-27 21:12:20
 */
class GuiLoadingMgr {
    private static _instance: GuiLoadingMgr;
    private _root: GuiSubLayer;
    private _loading: egret.DisplayObject | fairygui.GComponent;
    private _lock: egret.Sprite;

    private constructor() {
        if (GuiLoadingMgr._instance) {
            throw new Error("GuiLoadingMgr 单例");
        }
    }

    public static get instance(): GuiLoadingMgr {
        if (!GuiLoadingMgr._instance) {
            GuiLoadingMgr._instance = new GuiLoadingMgr();
        }
        return GuiLoadingMgr._instance;
    }

    public init(layer: GuiLayer) {
        this._root = new GuiSubLayer();
        this._root.displayObject.name = "loadingLayer";
        this._root.gobject.setSize(layer.width, layer.height);
        this._root.gobject.addRelation(layer.gobject, fairygui.RelationType.Size);
        layer.addChild(this._root);
    }

    /** 舞台自适应 保持与舞台一致的宽高 */
    public onStageResize(): void {
        this._root.onStageResize();
    }

    public addLoading(loading: egret.DisplayObject | fairygui.GComponent, lock?: egret.Sprite): void {
        if (loading) {
            this._loading = loading;
            this._root.addChild(this._loading);
        }
        if (lock) {
            this._lock = lock;
            this._root.addChild(this._lock);
        }
    }

    public async hideLoading(loading: egret.DisplayObject | fairygui.GComponent, lock?: egret.Sprite) {
        if (loading) {
            this._loading = loading;
            display.removeFromParent(this._loading);
        }
        if (lock) {
            this._lock = lock;
            display.removeFromParent(this._lock);
        }
    }

    public hideCurLoading() {
        if (this._loading) {
            display.removeFromParent(this._loading);
        }
        if (this._lock) {
            display.removeFromParent(this._lock);
        }
    }

    public get isLoading(): boolean {
        return !!this._loading;
    }
}