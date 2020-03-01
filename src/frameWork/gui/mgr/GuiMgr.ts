/**
 * @author 雪糕 
 * @desc GUI管理器
 * @date 2018-04-11 14:11:04 
 * @Last Modified by: 雪糕
 * @Last Modified time: 2020-02-27 21:13:09
 */
class GuiMgr {
    private static _instance: GuiMgr;
    private _root: fairygui.GRoot;
    private _layers: Dictionary<gui.eLayerType, GuiLayer>;

    public inited: boolean;

    private constructor() {
        if (GuiMgr._instance) {
            throw new Error("GuiMgr 单例");
        }


        this._layers = new Dictionary<gui.eLayerType, GuiLayer>();
    }

    public static get instance(): GuiMgr {
        if (!GuiMgr._instance) {
            GuiMgr._instance = new GuiMgr();
        }
        return GuiMgr._instance;
    }

    public init(root: fairygui.GRoot) {
        this._root = root;
        //场景层
        let sceneLayer = this.createLayer(gui.eLayerType.scene);
        //背景层
        let backLayer = this.createLayer(gui.eLayerType.back);
        //中间层
        let middleLayer = this.createLayer(gui.eLayerType.middle);
        //前景层
        let frontLayer = this.createLayer(gui.eLayerType.front);

        GuiSceneMgr.instance.init(sceneLayer);

        GuiBackMgr.instance.init(backLayer);

        GuiWindowMgr.instance.init(middleLayer);
        GuiToolTipMgr.instance.init(middleLayer);
        GuiDragDropMgr.instance.init(middleLayer);
        GuiAlertMgr.instance.init(middleLayer);
        GuiToastMgr.instance.init(middleLayer);

        GuiLoadingMgr.instance.init(frontLayer);
        GuiNoviceMgr.instance.init(frontLayer);
        GuiErrorMgr.instance.init(frontLayer);

        this.onStageResize();
        this.inited = true;
    }

    private createLayer(name: gui.eLayerType): GuiLayer {
        let layer = new GuiLayer();
        this._layers.setValue(name, layer);
        layer.gobject.setSize(this._root.width, this._root.height);
        layer.gobject.addRelation(this._root, fairygui.RelationType.Size);
        layer.displayObject.name = gui.eLayerType[name];
        this._root.addChild(layer.gobject);

        return layer;
    }

    /** 舞台自适应 保持与舞台一致的宽高 */
    public onStageResize(): void {
        GuiSceneMgr.instance.onStageResize();

        GuiBackMgr.instance.onStageResize();

        GuiWindowMgr.instance.onStageResize();
        GuiToolTipMgr.instance.onStageResize();
        GuiAlertMgr.instance.onStageResize();
        GuiToastMgr.instance.onStageResize();

        GuiLoadingMgr.instance.onStageResize();
        GuiNoviceMgr.instance.onStageResize();
        GuiErrorMgr.instance.onStageResize();
    }
}