/**
 * @author 雪糕 
 * @desc GUI错误管理器
 * @date 2018-04-11 15:27:03 
 * @Last Modified by: 雪糕
 * @Last Modified time: 2020-02-28 00:25:44
 */
class GuiErrorMgr extends GuiViewStackMgr {
    protected static _instance: GuiErrorMgr;

    /** 当前打开警告集合 */
    protected _viewStackMap: Dictionary<string, GuiAlert>;
    /** 窗口开启参数集合 */
    protected _viewStackArgsMap: Dictionary<string, { className: string, data?: any, callBack?: (className: string) => void }>;
    /** 缓存窗口 */
    protected _cacheViewStackMap: Dictionary<string, GuiAlert>;

    private _seqList: GuiToast[]; //顺序显示队列
    private _seqToastMap: Dictionary<gui.eToastType, GuiToast[]>;
    protected _seqRunning: boolean;

    protected constructor() {
        if (GuiErrorMgr._instance) {
            throw new Error("GuiErrorMgr 单例");
        }
        super();
        this._seqToastMap = new Dictionary();
        this._seqList = [];
        this._seqRunning = false;
    }

    public static get instance(): GuiErrorMgr {
        if (!GuiErrorMgr._instance) {
            GuiErrorMgr._instance = new GuiErrorMgr();
        }
        return GuiErrorMgr._instance;
    }

    public init(layer: GuiLayer) {
        this._root = new GuiSubLayer();
        this._root.displayObject.name = "errorLayer";
        this._root.gobject.setSize(layer.width, layer.height);
        this._root.gobject.addRelation(layer.gobject, fairygui.RelationType.Size);
        layer.addChild(this._root);
    }

    /** error相关-------------------------------- */
    /** 
     * 弹出提示框
     * @param data  数据             
     * @param factor  1=1s，默认2s                  
     * @param cls 提示样式 默认CommonToast
    */
    public showToast(data: any, cls: typeof GuiToast, toastType: gui.eToastType = gui.eToastType.default, factor: number = 2): void {
        let toast = this.createToast(cls);
        if (!this._seqToastMap.getValue(toastType)) {
            this._seqToastMap.setValue(toastType, []);
            this._seqToastMap.getValue(toastType).push(toast);
        }
        toast.show(data, toastType, factor);
        this._root.addChild(toast);
    }

    public pushSeqToast(content: string, cls: typeof GuiToast): void {
        let toast = this.createToast(cls);
        // toast.content = content;
        toast.gobject.alpha = 0;
        this._seqList.push(toast);
        if (!this._seqRunning) {
            this.showSeqToast();
        }
    }

    private showSeqToast() {
        if (this._seqList.length == 0) {
            this._seqRunning = false;
            return;
        }
        this._seqRunning = true;
        let toast = this._seqList.shift();
        toast.removeFromParent();
        toast.gobject.setXY(Math.round((this._root.gobject.width - toast.gobject.width) / 2) + 20, Math.round((this._root.gobject.height - toast.gobject.height) / 2) - 50);
        let tw: egret.Tween = egret.Tween.get(toast);
        tw.to({ alpha: 1 }, 200).wait(500).to({ alpha: 0, y: 20 }, 800).call(this.showSeqToastComplete, this, [toast]);
    }

    private showSeqToastComplete(toast: GuiToast) {
        this.showToastComplete(toast);
        this.showSeqToast();
    }

    private showToastComplete(toast: GuiToast): void {
        toast.removeFromParent();
        toast.dispose();
    }

    private createToast(cls: typeof GuiToast): GuiToast {
        let toastClass: any = cls;
        let toast: GuiToast = new toastClass();
        toast.gcomponent = fairygui.UIPackage.createObject(toast.pkgName, toast.resName).asCom;
        toast.toastName = util.getQualifiedClassName(cls);
        return toast;
    }

    /** Alert相关-------------------------------- */

    /** 警告是否打开 */
    public isAlertShowed(cls: typeof GuiAlert): boolean {
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
        if (this.isAlertShowed(cls) == false) {
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
    public openAlert(cls: typeof GuiAlert, data?: AlertVO, callBack?: (alertName: string) => void): void {
        let className: string = util.getQualifiedClassName(cls);
        let guiAlert = this.openViewStack(cls, callBack, data) as GuiAlert;
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
        super.showViewStack(guiAlert)
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