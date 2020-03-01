/**
 * @author 雪糕 
 * @desc GUI控制组件
 * @date 2018-04-11 15:49:40 
 * @Last Modified by: long
 * @Last Modified time: 2019-07-18 21:09:00
 */
class GuiObject extends egret.EventDispatcher {
    /* 是否释放了资源 */
    public isDisposed: boolean;

    /* 是否常驻 */
    public retain: boolean;

    /* 显示对象 */
    protected _displayObject: egret.DisplayObject;

    /** fairygui对象 */
    protected _gobject: fairygui.GObject;

    public set gobject(value: fairygui.GObject) {
        this._gobject = value;
        this._displayObject = value.displayObject;
        this.childrenCreated();
    }

    /**
     * Getter GObject
     * @return {fairygui.GObject}
     */
    public get gobject(): fairygui.GObject {
        // if (!this._gobject) {
        //     throw new egret.error("Non-existent gobject");
        // }
        return this._gobject;
    }

    /**
     * Getter view
     * @return {egret.DisplayObject}
     */
    public get displayObject(): egret.DisplayObject {
        if (!this._displayObject) {
            throw new egret.error("Non-existent displayObject");
        }
        return this._displayObject;
    }

    public get visible(): boolean {
        if (this.gobject) {
            return this.gobject.visible;
        } else if (this.displayObject) {
            return this.displayObject.visible;
        } else {
            throw new egret.error("Non-existent displayObject");
        }
    }

    public set visible(value: boolean) {
        if (this.gobject) {
            this.gobject.visible = value;
        } else if (this.displayObject) {
            this.displayObject.visible = value;
        } else {
            throw new egret.error("Non-existent displayObject");
        }
    }

    public get x(): number {
        if (this.gobject) {
            return this.gobject.x;
        } else if (this.displayObject) {
            return this.displayObject.x;
        } else {
            throw new egret.error("Non-existent displayObject");
        }
    }

    public set x(value: number) {
        if (this.gobject) {
            this.gobject.x = value;
        } else if (this.displayObject) {
            this.displayObject.x = value;
        } else {
            throw new egret.error("Non-existent displayObject");
        }
    }

    public get y(): number {
        if (this.gobject) {
            return this.gobject.y;
        } else if (this.displayObject) {
            return this.displayObject.y;
        } else {
            throw new egret.error("Non-existent displayObject");
        }
    }

    public set y(value: number) {
        if (this.gobject) {
            this.gobject.y = value;
        } else if (this.displayObject) {
            this.displayObject.y = value;
        } else {
            throw new egret.error("Non-existent displayObject");
        }
    }

    public get width(): number {
        if (this.gobject) {
            return this.gobject.width;
        } else if (this.displayObject) {
            return this.displayObject.width;
        } else {
            throw new egret.error("Non-existent displayObject");
        }
    }

    public set width(value: number) {
        if (this.gobject) {
            this.gobject.width = value;
        } else if (this.displayObject) {
            this.displayObject.width = value;
        } else {
            throw new egret.error("Non-existent displayObject");
        }
    }

    public get height(): number {
        if (this.gobject) {
            return this.gobject.height;
        } else if (this.displayObject) {
            return this.displayObject.height;
        } else {
            throw new egret.error("Non-existent displayObject");
        }
    }

    public set height(value: number) {
        if (this.gobject) {
            this.gobject.height = value;
        } else if (this.displayObject) {
            this.displayObject.height = value;
        } else {
            throw new egret.error("Non-existent displayObject");
        }
    }

    public get anchorX(): number {
        return this.displayObject.anchorOffsetX;
    }

    public set anchorX(value: number) {
        this.displayObject.anchorOffsetX = value;
    }

    public get anchorY(): number {
        return this.displayObject.anchorOffsetY;
    }

    public set anchorY(value: number) {
        this.displayObject.anchorOffsetY = value;
    }

    protected childrenCreated(): void { }

    public localToGlobal(localX?: number, localY?: number, resultPoint?: egret.Point): egret.Point {
        if (this.gobject) {
            return this.gobject.displayObject.localToGlobal();
        } else if (this.displayObject) {
            return this.displayObject.localToGlobal();
        } else {
            throw new egret.error("Non-existent displayObject");
        }
    }

    public globalToLocal(stageX?: number, stageY?: number, resultPoint?: egret.Point): egret.Point {
        if (this.gobject) {
            return this.gobject.displayObject.globalToLocal();
        } else if (this.displayObject) {
            return this.displayObject.globalToLocal();
        } else {
            throw new egret.error("Non-existent displayObject");
        }
    }

    public removeFromParent(): void {
        if (this.gobject && this.parent) {
            this.gobject.removeFromParent();
        } else if (this.displayObject && this.displayObject.parent) {
            this.displayObject.parent.removeChild(this.displayObject);
        } else {
            //reserve
        }
    }

    public get parent(): fairygui.GComponent {
        if (this.gobject) {
            return this.gobject.parent;
        }

        return null;
    }

    public get originParent(): egret.DisplayObjectContainer {
        if (this.displayObject) {
            return this.displayObject.parent;
        }

        return null;
    }

    public constructor(obj?: fairygui.GObject | egret.DisplayObject) {
        super();
        if (obj) {
            if (obj instanceof fairygui.GObject) {
                this.gobject = obj;
            } else if (obj instanceof egret.DisplayObject) {
                this._displayObject = obj;
            } else {
                //reserve
            }
        }
    }

    /**
     * 销毁对象
     * 
     * @returns {void} 
     * @memberof GuiObject
     */
    public dispose(): void {
        if (this.isDisposed) {
            return;
        }
        this.isDisposed = true;
        this.onDispose();
    }

    protected onDispose(): void {
        this.removeFromParent();
        if (this.gobject) {
            this.gobject.dispose();
        } else {
            //reserve
        }
    }
}