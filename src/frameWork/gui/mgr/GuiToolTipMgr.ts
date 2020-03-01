/**
 * @author 雪糕 
 * @desc GUI提示信息层
 * @date 2018-04-11 15:38:43 
 * @Last Modified by: 雪糕
 * @Last Modified time: 2020-02-27 21:14:50
 */
class GuiToolTipMgr {
    private static _instance: GuiToolTipMgr;
    private _root: GuiSubLayer;

    private _hoverTipMap: Dictionary<number, GuiHoverTip>;
    private _toolTipMap: Dictionary<string, GuiToolTip>;

    private constructor() {
        if (GuiToolTipMgr._instance) {
            throw new Error("GuiToolTipMgr 单例");
        }
    }

    public static get instance(): GuiToolTipMgr {
        if (!GuiToolTipMgr._instance) {
            GuiToolTipMgr._instance = new GuiToolTipMgr();
        }
        return GuiToolTipMgr._instance;
    }

    public init(layer: GuiLayer) {
        this._root = new GuiSubLayer();
        this._root.displayObject.name = "toolTipLayer";
        this._root.gobject.setSize(layer.width, layer.height);
        this._root.gobject.addRelation(layer.gobject, fairygui.RelationType.Size);
        layer.addChild(this._root);

        this._hoverTipMap = new Dictionary<number, GuiHoverTip>();
        this._toolTipMap = new Dictionary<string, GuiToolTip>();
    }

    /** 舞台自适应 保持与舞台一致的宽高 */
    public onStageResize(): void {
        this._root.onStageResize();

        this._toolTipMap.forEach((value: GuiToolTip) => {
            value.onStageResize();
        });
    }

    /**
     * 显示toolTip
     * @param posObj 用来定位的object
     * @param cls 显示的toolTip类型
     * @param data 数据
     * @param direct 显示方向
     * @param offsetX x轴偏移量
     * @param offsetY y轴偏移量
     * @param parent toolTip的父节点
     */
    public showToolTip(posObj: GuiComponent | fairygui.GComponent | egret.DisplayObject, cls: typeof GuiToolTip, data?: any, direct: gui.eDirect = gui.eDirect.left, offsetX: number = 0, offsetY: number = 0, parent: GuiComponent | fairygui.GComponent | egret.DisplayObjectContainer = this._root): void {
        let clsName: string = util.getQualifiedClassName(cls);
        let toolTip: GuiToolTip = this._toolTipMap.getValue(clsName);
        if (!toolTip) {
            toolTip = this.createToolTip(cls);
            this._toolTipMap.setValue(clsName, toolTip);
        }
        this.hideToolTip(cls);
        toolTip.show(direct, posObj, parent, data, offsetX, offsetY);
    }

    private createToolTip(cls: typeof GuiToolTip): GuiToolTip {
        let toolTipClass: any = cls;
        let toolTip: GuiToolTip = new toolTipClass();
        toolTip.gcomponent = fairygui.UIPackage.createObject(toolTip.pkgName, toolTip.resName).asCom;
        toolTip.className = util.getQualifiedClassName(cls);
        return toolTip;
    }

    public hideToolTip(cls: typeof GuiToolTip, isDispose: boolean = false): void {
        let clsName: string = util.getQualifiedClassName(cls);
        let toolTip: GuiToolTip = this._toolTipMap.getValue(clsName);

        if (toolTip) {
            toolTip.removeFromParent();
            if (isDispose) {
                toolTip.dispose();
                this._toolTipMap.remove(clsName);
            }
        }
    }

    public hideAllToolTip(): void {
        this._toolTipMap.forEach((value: GuiToolTip, key: string) => {
            let cls = util.getClassDefinition(key);
            GuiToolTipMgr.instance.hideToolTip(cls);
        });
        this._root.removeChildren();
    }

    public getShowingTooltip<T extends GuiToolTip>(cls: new () => T): T {
        return this._toolTipMap.getValue(util.getQualifiedClassName(cls)) as T;
    }

    /** 视图是否打开 */
    public isTooltipShowing(cls: typeof GuiToolTip): boolean {
        return this._toolTipMap.containsKey(util.getQualifiedClassName(cls));
    }

    // /** 添加悬浮提示 */
    // public addHoverTip(hoverObj: GuiComponent | fairygui.GComponent | egret.DisplayObject, posObj: GuiComponent | fairygui.GComponent | egret.DisplayObject, cls: typeof GuiHoverTip, data?: any, direct: gui.eDirect = gui.eDirect.left, offsetX: number = 0, offsetY: number = 0, parent: GuiComponent | fairygui.GComponent | egret.DisplayObjectContainer = this._root): void {
    //     //鼠键
    //     let hoverTip: GuiHoverTip = this._hoverTipMap.getValue(hoverObj.hashCode);
    //     if (!hoverTip) {
    //         hoverTip = this.createHoverTip(cls);
    //         this._hoverTipMap.setValue(hoverObj.hashCode, hoverTip);
    //     }

    //     hoverTip.initHoverInfo(direct, hoverObj, posObj, parent, data, offsetX, offsetY);
    //     if (SettingManager.instance.getOptionValue(eSettingOption.keyboardEnable)) {
    //         hoverObj.addEventListener(mouse.MouseEvent.MOUSE_OVER, this.onHoverMouseOver, this);
    //         hoverObj.addEventListener(mouse.MouseEvent.MOUSE_OUT, this.onHoverMouseOut, this);
    //     } else {
    //         //触屏
    //     }
    // }

    // /** 移除悬浮提示 */
    // public removeHoverTip(hoverObj: GuiComponent | fairygui.GComponent | egret.DisplayObject): void {
    //     let hoverTip: GuiHoverTip = this._hoverTipMap.getValue(hoverObj.hashCode);
    //     if (!hoverTip) {
    //         return;
    //     }

    //     this._hoverTipMap.remove(hoverObj.hashCode);
    //     hoverTip.removeFromParent();
    //     hoverTip.dispose();
    // }


    // private onHoverMouseOver(evt: egret.TouchEvent) {
    //     let hashCode = (evt.currentTarget as egret.DisplayObject).hashCode;
    //     let hoverTip = this._hoverTipMap.getValue(hashCode);
    //     if (hoverTip) {
    //         hoverTip.showDefault();
    //     }

    //     if (evt.currentTarget instanceof fairygui.GComponent) {
    //         let ctrlButton = evt.currentTarget.getController("button");
    //         if (ctrlButton && ctrlButton.hasPage("over")) {
    //             ctrlButton.selectedPage = "over";
    //         }
    //     }
    // }

    // private onHoverMouseOut(evt: egret.TouchEvent) {
    //     let hashCode = (evt.currentTarget as egret.DisplayObject).hashCode;
    //     let hoverTip = this._hoverTipMap.getValue(hashCode);
    //     if (hoverTip) {
    //         hoverTip.removeFromParent();
    //     }

    //     if (evt.currentTarget instanceof fairygui.GComponent) {
    //         let ctrlButton = evt.currentTarget.getController("button");
    //         if (ctrlButton && ctrlButton.selectedPage === "over") {
    //             if (evt.currentTarget instanceof fairygui.GButton) {
    //                 if (evt.currentTarget.selected) {
    //                     ctrlButton.selectedPage = "down";
    //                 } else {
    //                     ctrlButton.selectedPage = "up";
    //                 }
    //             } else {
    //                 ctrlButton.selectedPage = "up";
    //             }
    //         }
    //     }
    // }

    // private createHoverTip(cls: typeof GuiHoverTip): GuiHoverTip {
    //     let toolTipClass: any = cls;
    //     let toolTip: GuiHoverTip = new toolTipClass();
    //     toolTip.gcomponent = fairygui.UIPackage.createObject(toolTip.pkgName, toolTip.resName).asCom;
    //     toolTip.className = util.getQualifiedClassName(cls);
    //     return toolTip;
    // }
}