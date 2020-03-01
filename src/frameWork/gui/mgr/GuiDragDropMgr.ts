/**
 * @author 雪糕 
 * @desc GUI拖拽控制器
 * @date 2018-04-11 20:13:11 
 * @Last Modified by: 雪糕
 * @Last Modified time: 2020-02-27 21:07:44
 */
class GuiDragDropMgr extends egret.EventDispatcher {
    private _agent: GuiLoader;
    private _sourceData: any;

    private _root: GuiSubLayer;

    public get agent(): GuiLoader {
        return this._agent;
    }

    private static _instance: GuiDragDropMgr;
    public static get instance(): GuiDragDropMgr {
        if (GuiDragDropMgr._instance == null)
            GuiDragDropMgr._instance = new GuiDragDropMgr();
        return GuiDragDropMgr._instance;
    }

    private constructor() {
        if (GuiDragDropMgr._instance) {
            throw new Error("GuiDragDropMgr 单例");
        }
        super();
        this._agent = new GuiLoader(new fairygui.GLoader());
        this._agent.gloader.draggable = true;
        this._agent.gloader.touchable = false;//important
        this._agent.gloader.setSize(60, 60);
        this._agent.gloader.setPivot(0.5, 0.5, true);
        this._agent.gloader.align = fairygui.AlignType.Center;
        this._agent.gloader.verticalAlign = fairygui.VertAlignType.Middle;
        this._agent.gloader.fill = fairygui.LoaderFillType.Scale;
        this._agent.gloader.sortingOrder = 1000000;
        this._agent.gloader.addEventListener(fairygui.DragEvent.DRAG_END, this.__dragEnd, this);
    }

    public init(layer: GuiLayer) {
        this._root = new GuiSubLayer();
        this._root.displayObject.name = "dragDropLayer";
        layer.addChild(this._root);
    }

    // public get dragAgent(): fairygui.GObject {
    //     return this._agent.gloader;
    // }

    public get dragging(): boolean {
        return this._agent.gloader.parent != null;
    }

    public startDrag(srouce: string | egret.Texture, sourceData: any, touchPointID: number = -1, parent: GuiComponent = this._root): void {
        if (this._agent.gloader.parent != null)
            return;

        this._sourceData = sourceData;

        if (typeof srouce == "string") {
            gui.setIconAsync(this._agent.gloader, srouce);
        } else if (srouce instanceof egret.Texture) {
            this._agent.gloader.texture = srouce
        }

        // if (typeof icon == 'string') {
        // }
        // else if (icon instanceof egret.Texture) {
        //     this._agent.gloader.texture = icon as egret.Texture;
        // }
        parent.gcomponent.addChild(this._agent.gloader);

        // let pt: egret.Point = fairygui.GRoot.inst.globalToLocal(fairygui.GRoot.mouseX, fairygui.GRoot.mouseY);
        let pt: egret.Point = parent.displayObject.globalToLocal(fairygui.GRoot.mouseX, fairygui.GRoot.mouseY);

        this._agent.gloader.setXY(pt.x, pt.y);
        this._agent.gloader.startDrag(touchPointID);
    }

    public cancel(): void {
        if (this._agent.gloader.parent != null) {
            this._agent.gloader.stopDrag();
            this._agent.gloader.removeFromParent();
            this._sourceData = null;
        }
    }

    private __dragEnd(evt: fairygui.DragEvent): void {
        // this._agent.gloader.texture = null;
        gui.setIconAsync(this._agent.gloader, null);
        if (this._agent.gloader.parent == null) {
            //cancelled
            return;
        }

        this._agent.gloader.removeFromParent();

        let sourceData: any = this._sourceData;
        this._sourceData = null;
        let obj: fairygui.GObject = fairygui.GRoot.inst.getObjectUnderPoint(evt.stageX, evt.stageY);
        while (obj != null) {
            if (obj.hasEventListener(fairygui.DropEvent.DROP)) {
                let dropEvt: fairygui.DropEvent = new fairygui.DropEvent(fairygui.DropEvent.DROP);
                dropEvt.data = sourceData;
                obj.requestFocus();
                obj.dispatchEvent(dropEvt);
                return;
            }

            obj = obj.parent;
        }

        let event = new fairygui.DragEvent(fairygui.DragEvent.DRAG_END, evt.stageX, evt.stageY, evt.touchPointID);
        event.data = sourceData;
        this.dispatchEvent(event);
    }
}