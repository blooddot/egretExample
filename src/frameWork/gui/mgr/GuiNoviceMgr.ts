/**
 * @author 雪糕 
 * @desc GUI新手管理器
 * @date 2018-04-11 14:53:57 
 * @Last Modified by: 雪糕
 * @Last Modified time: 2020-02-27 21:13:22
 */
class GuiNoviceMgr {
    private static _instance: GuiNoviceMgr;
    private _root: GuiSubLayer;
    /** 当前打开提示层 */
    protected _noviceMap: Dictionary<string, GuiNovice>;
    /** 窗口开启参数集合 */
    protected _noviceArgs: Dictionary<string, NoviceVO>;
    /** 缓存窗口 */
    protected _cacheNoviceMap: Dictionary<string, GuiNovice>;
    /**mask alpha */
    protected _maskLayerAlpha: number = 0.5;
    protected _maskLayerColor: number = 0x000000;

    protected _maskLayer: egret.Shape = new egret.Shape();
    private constructor() {
        if (GuiNoviceMgr._instance) {
            throw new Error("GuiNoviceMgr 单例");
        }
        this._noviceMap = new Dictionary<string, GuiNovice>();
        this._noviceArgs = new Dictionary<string, NoviceVO>();
        this._cacheNoviceMap = new Dictionary<string, GuiNovice>();
    }

    public static get instance(): GuiNoviceMgr {
        if (!GuiNoviceMgr._instance) {
            GuiNoviceMgr._instance = new GuiNoviceMgr();
        }
        return GuiNoviceMgr._instance;
    }

    public init(layer: GuiLayer) {
        this._root = new GuiSubLayer();
        this._root.displayObject.name = "noviceLayer";
        layer.addChild(this._root);

        this._maskLayer.name = 'noviceMaskLayer';
        this._root.gobject.setSize(layer.width, layer.height);
        this._root.gobject.addRelation(layer.gobject, fairygui.RelationType.Size);
        this._root.addChild(this._maskLayer);
    }

    /** 舞台自适应 保持与舞台一致的宽高 */
    public onStageResize(): void {
        this._root.onStageResize();
        this._noviceMap.forEach(novice => {
            novice.onStageResize();
        });
    }

    public openNovice(cls: typeof GuiNovice, data: NoviceVO) {
        let noviceClass: any = cls;
        let noviceName = util.getQualifiedClassName(cls);
        let guiNovice = this._cacheNoviceMap.getValue(noviceName);
        if (this.isNoviceShowed(cls)) {
            return;
        }
        if (!guiNovice) {
            guiNovice = new noviceClass();
            guiNovice.gcomponent = fairygui.UIPackage.createObject(guiNovice.pkgName, guiNovice.resName).asCom;
            if (guiNovice.needCache) {
                this._cacheNoviceMap.setValue(noviceName, guiNovice);
            }
        }
        guiNovice.noviceName = noviceName;
        this._noviceArgs.setValue(noviceName, data);
        if (guiNovice.inited) {
            this.showNovice(guiNovice)
        }
        else {
            this.initNovice(guiNovice, noviceName);
        }
    }

    public closeNovice(cls: typeof GuiNovice) {
        let noviceName = util.getQualifiedClassName(cls);
        if (!this.isNoviceShowed(cls)) {
            return;
        }
        let guiNovice: GuiNovice = this._noviceMap.getValue(noviceName);
        this._noviceMap.remove(noviceName);
        this._noviceArgs.remove(noviceName);

        guiNovice.addEventListener(GuiEvent.GUI_NOVICE_HIDED, this.onNoviceClosed, this);
        guiNovice.hide();

    }

    public closeAllNovice() {
        this._noviceMap.forEach(novice => {
            novice.addEventListener(GuiEvent.GUI_NOVICE_HIDED, this.onNoviceClosed, this);
            novice.hide();
        });
        this._noviceMap.clear();
        this._noviceArgs.clear();
    }

    protected onNoviceClosed(e: GuiEvent) {
        let guiNovice: GuiNovice = e.target;
        guiNovice.removeEventListener(GuiEvent.GUI_NOVICE_HIDED, this.onNoviceClosed, this);

        if (!guiNovice.needCache) {
            if (this._cacheNoviceMap.containsKey(guiNovice.noviceName)) {
                this._cacheNoviceMap.remove(guiNovice.noviceName);
            }
            guiNovice.dispose();
        }
    }

    protected showNovice(guiNovice: GuiNovice) {
        let data = this._noviceArgs.getValue(guiNovice.noviceName);
        guiNovice.show(data);
        guiNovice.addEventListener(GuiEvent.GUI_NOVICE_SHOWED, this.onNoviceShowed, this);
        guiNovice.gobject.setSize(this._root.width, this._root.height);
        guiNovice.gobject.addRelation(this._root.gobject, fairygui.RelationType.Size);
        this._root.addChild(guiNovice);
    }

    protected onNoviceShowed(e: GuiEvent): void {
        let guiNovice = e.target as GuiNovice;
        guiNovice.removeEventListener(GuiEvent.GUI_NOVICE_SHOWED, this.onNoviceShowed, this);
        this._noviceMap.setValue(guiNovice.noviceName, guiNovice);
    }

    protected initNovice(guiNovice: GuiNovice, noviceName: string): void {
        guiNovice.noviceName = noviceName;
        guiNovice.addEventListener(GuiEvent.GUI_NOVICE_INITED, this.onNoviceInited, this);
        guiNovice.init();
    }

    protected onNoviceInited(e: GuiEvent) {
        let guiNovice = e.target as GuiNovice;
        guiNovice.removeEventListener(GuiEvent.GUI_NOVICE_INITED, this.onNoviceInited, this);
        this.showNovice(guiNovice);
    }

    public isNoviceShowed(noviceName: Function): boolean {
        let clsName = egret.getQualifiedClassName(noviceName);
        return this._noviceMap.containsKey(clsName);
    }

    public setMaskLayerAlpha(alpha: number) {
        this._maskLayerAlpha = alpha;
    }

    public drawMaskLayer(...splitRects: egret.Rectangle[]) {
        this._maskLayer.parent.setChildIndex(this._maskLayer, 0);
        this._maskLayer.visible = true;
        this._maskLayer.touchEnabled = true;
        this._maskLayer.graphics.clear();
        this._maskLayer.graphics.beginFill(this._maskLayerColor, this._maskLayerAlpha);
        let lineYs: number[] = [];
        for (let i = 0; i < splitRects.length; i++) {
            let rect = splitRects[i]
            lineYs.push(rect.top, rect.bottom);
        }
        lineYs.sort((lineY1, lineY2): number => {
            return lineY1 - lineY2;
        });
        splitRects.sort((rect1, rect2): number => {
            return rect1.x - rect2.x
        });
        let underLine = 0;
        for (let i = 0; i < lineYs.length; i++) {
            let curX = 0;
            let lineY = lineYs[i];
            for (let j = 0; j < splitRects.length; j++) {
                let rect = splitRects[j];
                if (lineY > rect.top && lineY <= rect.bottom) {
                    this._maskLayer.graphics.drawRect(curX, underLine, rect.left - curX, lineY - underLine);
                    curX = rect.right;
                }
            }
            this._maskLayer.graphics.drawRect(curX, underLine, this._root.width - curX, lineY - underLine);//最后一个
            underLine = lineY;
        }
        this._maskLayer.graphics.drawRect(0, underLine, this._root.width, this._root.height - underLine);
        this._maskLayer.graphics.endFill();
    }

    public hideMaskLayer() {
        this._maskLayer.graphics.clear();
        this._maskLayer.visible = false;
        this._maskLayer.touchEnabled = false;
    }

    public getMaskLayerHashCode() {
        return this._maskLayer.hashCode;
    }

    public get root() {
        return this._root;
    }
}