/**
 * @author 雪糕
 * @desc GUI弹出文字层
 * @date 2018-04-11 15:33:23
 * @Last Modified by: 雪糕
 * @Last Modified time: 2020-02-27 21:13:48
 */
class GuiToastMgr {
    private static _instance: GuiToastMgr;
    private _root: GuiSubLayer;
    private _seqList: GuiToast[]; //顺序显示队列
    private _seqToastMap: Dictionary<gui.eToastType, GuiToast[]> = new Dictionary();
    private _seqRunning: boolean = false;
    private _lastToast: GuiToast;

    private constructor() {
        if (GuiToastMgr._instance) {
            throw new Error("GuiToastMgr 单例");
        }
    }

    public static get instance(): GuiToastMgr {
        if (!GuiToastMgr._instance) {
            GuiToastMgr._instance = new GuiToastMgr();
        }
        return GuiToastMgr._instance;
    }

    /**
     * Getter root
     * @return {GuiSubLayer}
     */
    public get root(): GuiSubLayer {
        return this._root;
    }

    public init(layer: GuiLayer) {
        this._root = new GuiSubLayer();
        this._root.displayObject.name = "toastLayer";
        this._root.gobject.setSize(layer.width, layer.height);
        this._root.gobject.addRelation(layer.gobject, fairygui.RelationType.Size);
        layer.addChild(this._root);
    }

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
        // if (this._lastToast) {
        //     this._lastToast.hideEarly();
        // }
        // this._lastToast = toast;
        // let toast = this.createToast(cls);
        // toast.content = content;
        // this._root.addChild(toast);
        // toast.gobject.setXY(Math.round((this.root.gobject.width - toast.gobject.width) / 2), Math.round((this.root.gobject.height - toast.gobject.height)*0.35));
        // let toastY: number = toast.gobject.y;

        // let tw: egret.Tween = egret.Tween.get(toast.gobject);
        // tw.to({ y: Math.round((this.root.gobject.height - toast.gobject.height)*0.2)}, 400)
        // .wait(1000 * factor).to({alpha:0},400)
        // .call(this.showToastComplete, this, [toast]);
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
        toast.gobject.setXY(Math.round((this.root.gobject.width - toast.gobject.width) / 2) + 20, Math.round((this.root.gobject.height - toast.gobject.height) / 2) - 50);
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

    /** 舞台自适应 保持与舞台一致的宽高 */
    public onStageResize(): void {
        this._root.onStageResize();
    }

    public get seqToastMap() {
        return this._seqToastMap;
    }
}