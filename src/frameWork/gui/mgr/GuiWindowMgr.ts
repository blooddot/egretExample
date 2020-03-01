
/**
 * @author 雪糕
 * @desc GUI窗口层
 * @date 2018-04-11 15:32:19
 * @Last Modified by: 雪糕
 * @Last Modified time: 2020-02-27 21:19:30
 */
class GuiWindowMgr extends GuiViewStackMgr {
    private static _instance: GuiWindowMgr;

    /** 当前打开窗口集合 */
    protected _viewStackMap: Dictionary<string, GuiWindow>;
    /** 窗口开启参数集合 */
    protected _viewStackArgsMap: Dictionary<string, { className: string, data?: any, callBack?: (className: string) => void }>;
    /** 缓存窗口 */
    protected _cacheViewStackMap: Dictionary<string, GuiWindow>;

    /** 窗体深度map */
    protected _subLayerMap: Dictionary<gui.eWindowDepth, GuiSubLayer>;

    // /**画面质量 */
    // public quality: number;
    // private _lastQuality: number;
    // private _isBlur: boolean;

    // private _blurLoader: egret.Bitmap;

    // private _screenUILowerFpsTaskID: number;//全屏界面降帧任务

    /** 窗口堆栈 */
    protected _stack: typeof GuiWindow[];

    protected constructor() {
        if (GuiWindowMgr._instance) {
            throw new Error("GuiWindowManager 单例");
        }
        super();

        this._subLayerMap = new Dictionary<gui.eWindowDepth, GuiSubLayer>();
        this._stack = [];
    }

    public static get instance(): GuiWindowMgr {
        if (!GuiWindowMgr._instance) {
            GuiWindowMgr._instance = new GuiWindowMgr();
        }
        return GuiWindowMgr._instance;
    }

    public init(layer: GuiLayer) {
        this._root = new GuiSubLayer();
        this._root.displayObject.name = "windowLayer";
        this._root.gobject.setSize(layer.width, layer.height);
        this._root.gobject.addRelation(layer.gobject, fairygui.RelationType.Size);
        layer.addChild(this._root);
        let depths = [gui.eWindowDepth.blur, gui.eWindowDepth.bottom, gui.eWindowDepth.middle, gui.eWindowDepth.top];
        for (const iterator of depths) {
            let subLayer = new GuiSubLayer();
            subLayer.displayObject.name = gui.eWindowDepth[iterator];
            subLayer.gobject.setSize(this._root.width, this._root.height);
            subLayer.gobject.addRelation(this._root.gobject, fairygui.RelationType.Size);
            this._root.addChild(subLayer);
            this._subLayerMap.setValue(iterator, subLayer);
        }
        // this._blurLoader = new egret.Bitmap();
        // this._blurLoader.filters = [new egret.BlurFilter(50, 50), new egret.BlurFilter(15, 15)];
        // this._blurLoader.cacheAsBitmap = true;
        // this._blurLoader.scaleX = 1.2;
        // this._blurLoader.scaleY = 1.2;
        // this._isBlur = false;
        // this._screenUILowerFpsTaskID = -1;
    }


    /** 窗口是否打开 */
    public isWindowShowing(cls: typeof GuiWindow): boolean {
        return this.isViewStackShowing(cls);
    }

    /**
     * 获取打开的窗体
     * @param cls
     */
    public getShowingWindow<T extends GuiWindow>(cls: new () => T): T {
        return this.getShowingViewStack(cls) as T;
    }

    /**
     * 打开窗体
     *
     * @param {string} pkgName
     * @param {string} cls
     * @param {*} [data=undefined]
     * @param {(className: string) => void} [callBack=null]
     * @memberof GuiWindowManager2
     */
    public openWindow(cls: typeof GuiWindow, data?: any, winDepth?: gui.eWindowDepth, callBack?: (className: string) => void): GuiWindow {
        let className: string = util.getQualifiedClassName(cls);
        let t = performance.now();
        let guiWindow = this.openViewStack(cls, data, callBack) as GuiWindow;
        if (!guiWindow) {
            return null;
        }
        if (winDepth) {
            guiWindow.windowDepth = winDepth;
        }
        if (guiWindow.inited) {
            this.showViewStack(guiWindow);
        } else {
            this.initViewStack(guiWindow, className);
        }
        notice.dispatcherNotice(NoticeID.openWin, guiWindow);
        logger.info(LOG_TAG.gui, `open ${className} time: ${performance.now() - t}`);
        return guiWindow;
    }

    /** 显示窗体 */
    protected showViewStack(guiWindow: GuiWindow): void {
        super.showViewStack(guiWindow);
        this.setWindowDepth(guiWindow, guiWindow.windowDepth);
        // this.refreshBlurFilter();
        this.refreshModal();
    }

    /** 关闭窗体 */
    public closeWindow(cls: typeof GuiWindow, data?: any, dispose?: boolean): GuiWindow {
        let viewStack = this.closeViewStack(cls, data, dispose) as GuiWindow;
        // this.refreshBlurFilter();

        if (this._stack) {
            this.popFromStack();
        }
        notice.dispatcherNotice(NoticeID.closeWin, viewStack);
        return viewStack as GuiWindow;
    }

    /** 关闭所有打开的窗体 */
    public closeAllWindow(winNoCloseArr?: typeof GuiWindow[], isCleanCache?: boolean): void {
        this.closeAllViewStack(winNoCloseArr);
        if (isCleanCache == true) {
            this.cleanCacheViewStack();
        }
    }

    /** 将窗体拉到对应层次的最上面 */
    public bringUpWindow(cls: typeof GuiWindow): void {
        if (this.isViewStackShowing(cls)) {
            let className = util.getQualifiedClassName(cls);
            let guiWindow: GuiWindow = this._viewStackMap.getValue(className);
            this.setWindowDepth(guiWindow, guiWindow.windowDepth);
        }
    }

    /** 设置窗体深度 */
    public setWindowDepth(winDefine: GuiWindow | typeof GuiWindow, windowDepth: gui.eWindowDepth): void {
        let guiWindow: GuiWindow;
        if (winDefine instanceof GuiWindow) {
            guiWindow = winDefine;
        } else {
            let className: string = util.getQualifiedClassName(winDefine);
            guiWindow = this._viewStackMap.getValue(className);
            if (!guiWindow) {
                throw Error(`${guiWindow} is not open`);
            }
        }
        if (guiWindow.parent) {
            let preWinContainer = this._subLayerMap.getValue(guiWindow.windowDepth);
            guiWindow.gobject.removeRelation(preWinContainer.gobject, fairygui.RelationType.Size);
            guiWindow.removeFromParent();
        }

        let windowContainer = this._subLayerMap.getValue(windowDepth);
        guiWindow.windowDepth = windowDepth;
        guiWindow.gobject.setSize(windowContainer.width, windowContainer.height);
        guiWindow.gobject.addRelation(windowContainer.gobject, fairygui.RelationType.Size);

        windowContainer.addChild(guiWindow);
    }
    // public refreshBlurFilter(): void {
    //     let needBlur = false;
    //     this._viewStackMap.forEach((value: GuiWindow) => {
    //         if (value.needBlur) {
    //             needBlur = true;
    //             return false;
    //         }
    //     });

    //     if (needBlur == this._isBlur) {
    //         return;
    //     }
    //     this._isBlur = needBlur;

    //     let blurLayer = this._subLayerMap.getValue(gui.eWindowDepth.blur);
    //     if (needBlur) {
    //         //模糊时说明是全屏界面 可以降帧
    //         if (this._screenUILowerFpsTaskID < 0) {
    //             this._screenUILowerFpsTaskID = FrameRateMgr.instance.addLowerFpsTask(GameDefine.FRAME_RATE.screenUIRate);
    //         }

    //         //渲染模糊时 这些层级隐藏
    //         let bottomLayer = this._subLayerMap.getValue(gui.eWindowDepth.bottom);
    //         let middleLayer = this._subLayerMap.getValue(gui.eWindowDepth.middle);
    //         let topLayer = this._subLayerMap.getValue(gui.eWindowDepth.top);
    //         bottomLayer.visible = false;
    //         middleLayer.visible = false;
    //         topLayer.visible = false;

    //         this._lastQuality = this.quality;
    //         if (this.quality <= 2) {
    //             let renderTexture: egret.RenderTexture = new egret.RenderTexture();

    //             // renderTexture.drawToTexture(egret.MainContext.instance.stage, new egret.Rectangle(-5, -5, 1500, 1500));
    //             // renderTexture.drawToTexture(GuiAdaptManager.instance.stage);
    //             this._blurLoader.width = ScreenAdapter.stageWidth;
    //             this._blurLoader.height = ScreenAdapter.stageHeight;
    //             this._blurLoader.x = - this._blurLoader.width / 10;
    //             this._blurLoader.y = - this._blurLoader.height / 10;
    //             renderTexture.drawToTexture(ScreenAdapter.stage, new egret.Rectangle(0, 0, blurLayer.width, blurLayer.height));
    //             this._blurLoader.texture = renderTexture;
    //             blurLayer.addChild(this._blurLoader);
    //         } else {
    //             for (let i = 0; i < blurLayer.numChildren; i++) {
    //                 blurLayer.getChildAt(i).filters = [new egret.BlurFilter(50, 50), new egret.BlurFilter(15, 15)];
    //             }
    //             // SceneManager.instance.setSceneBlur(true);
    //         }

    //         bottomLayer.visible = true;
    //         middleLayer.visible = true;
    //         topLayer.visible = true;
    //     }
    //     else {
    //         this.cleanBlur();
    //     }
    // }

    // private cleanBlur() {
    //     let blurLayer = this._subLayerMap.getValue(gui.eWindowDepth.blur);
    //     //全屏界面 降帧恢复
    //     if (this._screenUILowerFpsTaskID > 0) {
    //         FrameRateMgr.instance.removeLowerFpsTask(this._screenUILowerFpsTaskID);
    //         this._screenUILowerFpsTaskID = -1;
    //     }

    //     if (this._lastQuality <= 2) {
    //         display.removeFromParent(this._blurLoader);
    //         if (this._blurLoader.texture) {
    //             this._blurLoader.texture.dispose();
    //         }
    //     } else {
    //         for (let i = 0; i < blurLayer.numChildren; i++) {
    //             blurLayer.getChildAt(i).filters = null;
    //         }
    //         // SceneManager.instance.setSceneBlur(false);
    //     }
    // }

    public refreshModal(): GuiWindow {
        let guiWindow = super.refreshModal() as GuiWindow;
        if (!guiWindow) {
            return null;
        }
        if (this._modal) {
            if (this._modal.parent) {
                this._modal.gobject.removeRelation(this._modal.parent, fairygui.RelationType.Size);
                this._modal.removeFromParent();
            }

            let windowContainer = this._subLayerMap.getValue(guiWindow.windowDepth);
            this._modal.gobject.setSize(this._root.width, this._root.height);
            this._modal.gobject.addRelation(this._root.gobject, fairygui.RelationType.Size);
            windowContainer.addChildAt(this._modal, windowContainer.getChildIndex(guiWindow));
        }

        return guiWindow;
    }

    /** 传输数据 */
    public transferData(cls: typeof GuiWindow, transId: gui.eTransId = gui.eTransId.default, ...param): void {
        let className: string = util.getQualifiedClassName(cls);
        let cacheView = this._cacheViewStackMap.getValue(className);
        if (cacheView) {
            cacheView.receiveData(transId, ...param);
        }
    }

    /** 舞台自适应 保持与舞台一致的宽高 */
    public onStageResize(): void {
        this._subLayerMap.forEach((value: GuiSubLayer) => {
            value.onStageResize();
        });

        if (this._modal) {
            this._modal.onStageResize();
        }
        super.onStageResize();

        // this._isBlur = false;
        // this.cleanBlur();
        // this.refreshBlurFilter();
    }

    /** 放到窗口堆栈中 */
    public pushToStack(cls: typeof GuiWindow): void {
        let viewStack: GuiWindow = this.closeWindow(cls);
        if (viewStack) {
            this._stack.push(cls);
        }
    }

    /** 从窗口堆栈中拿出 */
    public popFromStack(): void {
        if (this._stack.length == 0) {
            return;
        }

        let cls: typeof GuiWindow = this._stack.pop();
        this.openWindow(cls);
    }

    // public get isBlur() {
    //     return this._isBlur;
    // }
}