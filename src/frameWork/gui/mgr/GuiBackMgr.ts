/**
 * @author 雪糕 
 * @desc GUI背景管理器
 * @date 2018-04-11 14:46:20 
 * @Last Modified by: 雪糕
 * @Last Modified time: 2018-11-06 20:07:21
 */
class GuiBackMgr {
    private static _instance: GuiBackMgr;
    private _root: GuiSubLayer;

    private constructor() {
        if (GuiBackMgr._instance) {
            throw new Error("GuiBackMgr 单例");
        }
    }

    public static get instance(): GuiBackMgr {
        if (!GuiBackMgr._instance) {
            GuiBackMgr._instance = new GuiBackMgr();
        }
        return GuiBackMgr._instance;
    }

    public init(layer: GuiLayer) {
        this._root = new GuiSubLayer();
        this._root.displayObject.name = "backLayer";
        this._root.gobject.setSize(layer.width, layer.height);
        this._root.gobject.addRelation(layer.gobject, fairygui.RelationType.Size);
        layer.addChild(this._root);
    }

    /** 舞台自适应 保持与舞台一致的宽高 */
    public onStageResize(): void {
        this._root.onStageResize();
    }
}