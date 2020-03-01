/**
 * @author 雪糕 
 * @desc GUI警告层
 * @date 2018-04-11 15:35:18 
 * @Last Modified by: 雪糕
 * @Last Modified time: 2020-02-28 00:05:56
 */
class GuiAlertMgr extends GuiViewStackMgr {
    private static _instance: GuiAlertMgr;

    /** 当前打开警告集合 */
    protected _viewStackMap: Dictionary<string, GuiAlert>;
    /** 窗口开启参数集合 */
    protected _viewStackArgsMap: Dictionary<string, { className: string, callBack?: (className: string) => void, args?: any[] }>;
    /** 缓存窗口 */
    protected _cacheViewStackMap: Dictionary<string, GuiAlert>;

    protected constructor() {
        if (GuiAlertMgr._instance) {
            throw new Error("GuiAlertMgr 单例");
        }
        super();
    }

    public static get instance(): GuiAlertMgr {
        if (!GuiAlertMgr._instance) {
            GuiAlertMgr._instance = new GuiAlertMgr();
        }
        return GuiAlertMgr._instance;
    }

    public init(layer: GuiLayer) {
        this._root = new GuiSubLayer();
        this._root.displayObject.name = "alertLayer";
        this._root.gobject.setSize(layer.width, layer.height);
        this._root.gobject.addRelation(layer.gobject, fairygui.RelationType.Size);
        layer.addChild(this._root);
    }

    /** 警告是否打开 */
    public isAlertShowing(cls: typeof GuiAlert): boolean {
        return this.isViewStackShowing(cls);
    }

    /**
     * 获取打开的视图
     * @param cls 
     */
    public getShowingAlert<T extends GuiAlert>(cls: new () => T): T {
        return this.getShowingViewStack(cls) as T;
    }

    /** 显示或关闭警告 如果是打开则关闭 如果关闭则打开 */
    public openOrCloseAlert(cls: typeof GuiAlert, data?: any, callBack?: (className: string) => void): void {
        if (this.isAlertShowing(cls) == false) {
            this.openAlert(cls, data, callBack);
        } else {
            this.closeAlert(cls, data);
        }
    }

    /**
     * 打开警告
     * 
     * @param {string} pkgName 
     * @param {string} cls 
     * @param {*} [data=undefined] 
     * @param {(alertName: string) => void} [callBack=null] 
     * @memberof GuiAlertManager
     */
    public openAlert(cls: typeof GuiAlert, callBack?: (alertName: string) => void, ...args: any[]): void {
        let className: string = util.getQualifiedClassName(cls);
        let guiAlert = this.openViewStack(cls, callBack, ...args) as GuiAlert;
        if (!guiAlert) {
            return;
        }
        if (guiAlert.inited) {
            this.showViewStack(guiAlert);
        } else {
            this.initViewStack(guiAlert, className);
        }
    }

    /** 显示警告 */
    protected showViewStack(guiAlert: GuiAlert): void {
        super.showViewStack(guiAlert);
        if (guiAlert.parent) {
            guiAlert.gobject.removeRelation(this._root.gobject.parent, fairygui.RelationType.Size);
            guiAlert.removeFromParent();
        }
        guiAlert.gobject.setSize(this._root.width, this._root.height);
        guiAlert.gobject.addRelation(this._root.gobject, fairygui.RelationType.Size);
        this._root.addChild(guiAlert);
        this.refreshModal();
    }

    /** 关闭警告 */
    public closeAlert(cls: typeof GuiViewStack, data?: any, dispose?: boolean): void {
        this.closeViewStack(cls, data, dispose);
    }

    /** 关闭所有打开的警告 */
    public closeAllAlert(alertNoCloseArr?: typeof GuiWindow[]): void {
        this.closeAllViewStack(alertNoCloseArr);
    }

    public refreshModal(): GuiAlert {
        let guiAlert = super.refreshModal() as GuiAlert;
        if (!guiAlert) {
            return null;
        }
        if (this._modal) {
            this._modal.onStageResize();
            this._modal.gobject.setSize(this._root.width, this._root.height);
            this._modal.gobject.addRelation(this._root.gobject, fairygui.RelationType.Size);
            this._root.addChildAt(this._modal, this._root.getChildIndex(guiAlert));
        }

        return guiAlert;
    }
}