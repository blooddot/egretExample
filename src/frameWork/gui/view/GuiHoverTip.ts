/**
 * @author 雪糕 
 * @desc 
 * @date 2019-09-10 20:31:54 
 * @Last Modified by: 雪糕
 * @Last Modified time: 2019-09-10 20:42:32
 */
abstract class GuiHoverTip extends GuiToolTip {
    private _hoverObj: GuiObject | fairygui.GObject | egret.DisplayObject;

    private _data: any;

    private _parent: GuiComponent | fairygui.GComponent | egret.DisplayObjectContainer;

    /**
     * 根据参数显示到相应位置
     * @param direct 方向
     * @param hoverObj 悬浮的对象
     * @param posObj 用于定位坐标的物体
     * @param parent 父节点
     * @param data 数据
     * @param offsetX x偏移值
     * @param offsetY y偏移值
     */
    public initHoverInfo(direct: gui.eDirect, hoverObj: GuiObject | fairygui.GObject | egret.DisplayObject, posObj: GuiObject | fairygui.GObject | egret.DisplayObject, parent: GuiComponent | fairygui.GComponent | egret.DisplayObjectContainer, data?: any, offsetX: number = 0, offsetY: number = 0): void {
        this._direct = direct;
        this._hoverObj = hoverObj;
        this._posObj = posObj;
        this._bindObj = parent;
        this._offsetX = offsetX;
        this._offsetY = offsetY;
        this._data = data;
        this._parent = parent;

        // this.initData(data);
        // DisplayUtil.addChild(parent, this);
        // this.onStageResize();
        // this.onShown(parent)
    }

    public showDefault() {
        this.show(this._direct, this._posObj, this._parent, this._data, this._offsetX, this._offsetY);
    }
}