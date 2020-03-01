/**
 * @author 雪糕 
 * @desc GUI场景管理器
 * @date 2018-04-11 14:35:01 
 * @Last Modified by: long
 * @Last Modified time: 2019-11-12 14:28:04
 */
class GuiSceneMgr {
    private static _instance: GuiSceneMgr;
    private _root: GuiSubLayer;
    private _childList: GuiGroup[];

    private constructor() {
        if (GuiSceneMgr._instance) {
            throw new Error("GuiSceneMgr 单例");
        }
    }

    public static get instance(): GuiSceneMgr {
        if (!GuiSceneMgr._instance) {
            GuiSceneMgr._instance = new GuiSceneMgr();
        }
        return GuiSceneMgr._instance;
    }

    public init(layer: GuiLayer) {
        this._root = new GuiSubLayer();
        this._root.displayObject.name = "sceneLayer";
        this._root.gobject.setSize(layer.width, layer.height);
        this._root.gobject.addRelation(layer.gobject, fairygui.RelationType.Size);
        layer.addChild(this._root);
        this._childList = [];
    }

    /**添加一个UI 销毁的时候一定要调用 removeChild*/
    public addChild(child: GuiGroup, needRetain: boolean = false): void {
        child.gobject.setSize(this._root.width, this._root.height);
        child.gobject.addRelation(this._root.gobject, fairygui.RelationType.Size);
        child.retain = needRetain;
        this._root.addChild(child);
        this._childList.push(child);
    }

    public addChildAt(child: GuiGroup, index: number): void {
        child.gobject.setSize(this._root.width, this._root.height);
        child.gobject.addRelation(this._root.gobject, fairygui.RelationType.Size);
        this._root.addChildAt(child, index);
        this._childList.push(child);
    }

    /**销毁一个UI */
    public removeChild(child: GuiGroup, needRetain: boolean = false): void {
        child.removeFromParent();
        let index = this._childList.indexOf(child);
        if (index >= 0) {
            this._childList.splice(index, 1);
        }
    }

    /** 舞台自适应 保持与舞台一致的宽高 */
    public onStageResize(): void {
        this._root.onStageResize();
        for (const iterator of this._childList) {
            iterator.onStageResize();
        }
    }

    public get root(): GuiLayer {
        return this._root;
    }
}