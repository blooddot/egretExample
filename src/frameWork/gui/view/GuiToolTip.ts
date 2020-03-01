/**
 * @author 雪糕 
 * @desc 
 * @date 2018-07-02 19:08:02 
 * @Last Modified by: 雪糕
 * @Last Modified time: 2020-01-07 23:30:54
 */
abstract class GuiToolTip extends GuiComponent {
    protected _direct: gui.eDirect;
    protected _posObj: GuiObject | fairygui.GObject | egret.DisplayObject;
    protected _bindObj: GuiObject | fairygui.GObject | egret.DisplayObject;

    public abstract get pkgName(): string;

    public abstract get resName(): string;

    protected _className: string;

    protected _offsetX: number;
    protected _offsetY: number;

    public get className(): string {
        return this._className;
    }

    public set className(value: string) {
        this.gcomponent._rootContainer.name = this._className = value;
    }

    public get posObj(): GuiObject | fairygui.GObject | egret.DisplayObject {
        return this._posObj;
    }

    public get bindObj(): GuiObject | fairygui.GObject | egret.DisplayObject {
        return this._bindObj;
    }

    /**
     * 根据参数显示到相应位置
     * @param direct 方向
     * @param posObj 用于定位坐标的物体
     * @param parent 父节点
     * @param data 数据
     * @param offsetX x偏移值
     * @param offsetY y偏移值
     */
    public show(direct: gui.eDirect, posObj: GuiObject | fairygui.GObject | egret.DisplayObject, parent: GuiComponent | fairygui.GComponent | egret.DisplayObjectContainer, data?: any, offsetX: number = 0, offsetY: number = 0): void {
        this._direct = direct;
        this._posObj = posObj;
        this._bindObj = parent;
        this._offsetX = offsetX;
        this._offsetY = offsetY;
        this.initData(data);
        display.addChild(parent, this);
        this.onStageResize();
        this.onShown(parent)
    }

    /**
     * 初始化数据
     * @param data 
     */
    protected abstract initData(data?: any): void;

    protected onShown(parent: GuiComponent | fairygui.GComponent | egret.DisplayObjectContainer): void {
    }


    public onStageResize(): void {
        let pt: egret.Point = util.localToLocal(0, 0, this._posObj, this._bindObj);

        pt.x = pt.x + this._offsetX;
        pt.y = pt.y + this._offsetY;
        let posObjWidth = this._posObj.width;
        let posObjHeight = this._posObj.height;

        if (this._direct == gui.eDirect.dynamic) {
            let directX = gui.eDirect.left;
            if (pt.x - this.width < 0) {
                //超过左边了
                directX = gui.eDirect.right;
            } else if (pt.x + this.width > this._bindObj.width) {
                //超过右边了
                directX = gui.eDirect.left;
            } else {
                //reserve
            }

            let directY = gui.eDirect.none;
            if (pt.y - this.height < 0) {
                //超过上边了
                directY = gui.eDirect.down;
            } else if (pt.y + this.height > this._bindObj.height) {
                //超过下面了
                directY = gui.eDirect.up;
            } else {
                //reserve
            }
            this._direct = directX + directY;
        }

        switch (this._direct) {
            case gui.eDirect.none:
                this.x = pt.x;
                this.y = pt.y;
                break;
            case gui.eDirect.up:
                this.x = pt.x + (posObjWidth - this.width) / 2;
                this.y = pt.y - this.height;
                break;
            case gui.eDirect.down:
                // this.x = pt.x + this.width / 2;
                this.x = pt.x + (posObjWidth - this.width) / 2;
                this.y = pt.y + posObjHeight;
                break;
            case gui.eDirect.left:
                this.x = pt.x - this.width;
                this.y = pt.y + (posObjHeight - this.height) / 2;;
                break;
            case gui.eDirect.right:
                this.x = pt.x + posObjWidth;
                this.y = pt.y + (posObjHeight - this.height) / 2;;
                break;
            case gui.eDirect.leftUp:
                this.x = pt.x - this.width;
                this.y = pt.y - this.height;
                break;
            case gui.eDirect.leftDown:
                this.x = pt.x - this.width;
                this.y = pt.y + posObjHeight;
                break;
            case gui.eDirect.rightUp:
                this.x = pt.x + posObjWidth;
                this.y = pt.y - this.height;
                break;
            case gui.eDirect.rightDown:
                this.x = pt.x + posObjWidth;
                this.y = pt.y + posObjHeight;
                break;
            case gui.eDirect.center:
                this.x = pt.x + (posObjWidth - this.width) / 2;
                this.y = pt.y + (posObjHeight - this.height) / 2;
                break;
        }
    }
}