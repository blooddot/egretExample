/**
 * @author 雪糕 
 * @desc GUI容器
 * @date 2018-04-11 21:21:58 
 * @Last Modified by: long
 * @Last Modified time: 2019-09-23 16:57:17
 */
class GuiComponent extends GuiObject {
    private _guiOwner: GuiOwner;

    /** fairygui组件 */
    protected _gcomponent: fairygui.GComponent;

    /** 显示对象容器 */
    protected _displayObjectContainer: egret.DisplayObjectContainer;

    protected _coms: GuiComponent[];

    /**
     * Getter displayObjectContainer
     * @return {egret.DisplayObjectContainer}
     */
    public get displayObjectContainer(): egret.DisplayObjectContainer {
        if (!this._displayObjectContainer) {
            throw new egret.error(this + " Non-existent displayObjectContainer");
        }
        return this._displayObjectContainer;
    }

    public set gcomponent(value: fairygui.GComponent) {
        this._gobject = this._gcomponent = value;
        this._displayObject = this._displayObjectContainer = value.displayListContainer;
        this.childrenCreated();
    }

    /**
     * Getter gcomponent
     * @return {fairygui.GComponent}
     */
    public get gcomponent(): fairygui.GComponent {
        // if (!this._gcomponent) {
        //     throw new egret.error(this + " Non-existent gcomponent");
        // }
        return this._gcomponent;
    }

    protected get guiOwner(): GuiOwner {
        if (!this._guiOwner) {
            this._guiOwner = new GuiOwner(this);
            this._guiOwner.init();
        }

        return this._guiOwner;
    }

    public constructor(obj?: fairygui.GComponent | egret.DisplayObjectContainer) {
        super();
        if (obj) {
            if (obj instanceof fairygui.GComponent) {
                this.gcomponent = obj;
            } else if (obj instanceof egret.DisplayObjectContainer) {
                this._displayObject = this._displayObjectContainer = obj;
            } else {
                //reserve
            }
        }
    }

    public show(...data: any[]): void {
        if (this._coms) {
            this._coms.forEach(com => {
                com.show();
            });
        }
    }

    public hide(data?: any): void {
        if (this._coms) {
            this._coms.forEach(com => {
                com.hide();
            });
        }
    }

    /**
     * 添加子对象
     * 
     * @param {(GuiObject | fairygui.GObject | egret.DisplayObject)} child 
     * @memberof GuiComponent
     */
    public addChild(child: GuiObject | fairygui.GObject | egret.DisplayObject): void {
        if (child) {
            if (child instanceof GuiObject) {
                this.gcomponent.addChild(child.gobject);
            } else if (child instanceof fairygui.GObject) {
                this.gcomponent.addChild(child);
            } else if (child instanceof egret.DisplayObject) {
                this.displayObjectContainer.addChild(child);
            } else {
                //reserve
            }
        }
    }

    /**
     * 添加子对象到指定层级
     * 
     * @param {(GuiObject | fairygui.GObject | egret.DisplayObject)} child 
     * @param {number} index 
     * @memberof GuiComponent
     */
    public addChildAt(child: GuiObject | fairygui.GObject | egret.DisplayObject, index: number) {
        if (child) {
            if (child instanceof GuiObject) {
                this.gcomponent.addChildAt(child.gobject, index);
            } else if (child instanceof fairygui.GObject) {
                this.gcomponent.addChildAt(child, index);
            } else if (child instanceof egret.DisplayObject) {
                this.displayObjectContainer.addChildAt(child, index);
            } else {
                //reserve
            }
        }
    }

    public setChildIndex(child: GuiObject | fairygui.GObject | egret.DisplayObject, index: number): void {
        if (child) {
            if (child instanceof GuiObject) {
                this.gcomponent.setChildIndex(child.gobject, index);
            } else if (child instanceof fairygui.GObject) {
                this.gcomponent.setChildIndex(child, index);
            } else if (child instanceof egret.DisplayObject) {
                this.displayObjectContainer.setChildIndex(child, index);
            } else {
                //reserve
            }
        }
    }

    public setChildIndexBefore(child: GuiObject | fairygui.GObject, index: number): void {
        if (child) {
            if (child instanceof GuiObject) {
                this.gcomponent.setChildIndexBefore(child.gobject, index);
            } else if (child instanceof fairygui.GObject) {
                this.gcomponent.setChildIndexBefore(child, index);
            } else {
                //reserve
            }
        }
    }

    public getChildAt(index: number, origin?: boolean): fairygui.GObject | egret.DisplayObject {
        if (origin) {
            return this.displayObjectContainer.getChildAt(index);
        }
        return this.gcomponent.getChildAt(index);
    }

    public getChildByName(name: string): egret.DisplayObject {
        return this.displayObjectContainer.getChildByName(name);
    }

    public getChildIndex(child: GuiObject | fairygui.GObject | egret.DisplayObject): number {
        if (child) {
            if (child instanceof GuiObject) {
                return this.gcomponent.getChildIndex(child.gobject);
            } else if (child instanceof fairygui.GObject) {
                return this.gcomponent.getChildIndex(child);
            } else if (child instanceof egret.DisplayObject) {
                return this.displayObjectContainer.getChildIndex(child);
            } else {
                //reserve
                return -1;
            }
        }
    }

    public getChildById(id: string): fairygui.GObject {
        return this.gcomponent.getChildById(id);
    }

    public getChildInGroup(name: string, group: fairygui.GGroup): fairygui.GObject {
        return this.gcomponent.getChildInGroup(name, group);
    }

    public swapChildren(child1: GuiObject | fairygui.GObject | egret.DisplayObject, child2: GuiObject | fairygui.GObject | egret.DisplayObject): void {
        if ((child1 instanceof GuiObject) && (child2 instanceof GuiObject)) {
            this.gcomponent.swapChildren(child1.gobject, child2.gobject);
        } else if ((child1 instanceof fairygui.GObject) && (child2 instanceof fairygui.GObject)) {
            this.gcomponent.swapChildren(child1, child2);
        } else if ((child1 instanceof egret.DisplayObject) && (child2 instanceof egret.DisplayObject)) {
            this.displayObjectContainer.swapChildren(child1, child2);
        } else {
            //reserve
            throw new egret.error("swapChildren type must be same");
        }
    }

    public swapChildrenAt(index1: number, index2?: number, origin?: boolean): void {
        if (origin) {
            this.displayObjectContainer.swapChildrenAt(index1, index2);
        } else {
            this.gcomponent.swapChildrenAt(index1, index2);
        }
    }

    /**
     * 移除子对象
     * 
     * @param {(fairygui.GObject | egret.DisplayObject)} child 
     * @param {boolean} [dispose] 
     * @memberof GuiComponent
     */
    public removeChild(child: GuiObject | fairygui.GObject | egret.DisplayObject, dispose?: boolean): void {
        if (child) {
            if (child instanceof GuiObject) {
                this.gcomponent.removeChild(child.gobject, dispose);
            } else if (child instanceof fairygui.GObject) {
                this.gcomponent.removeChild(child, dispose);
            } else if (child instanceof egret.DisplayObject) {
                this.displayObjectContainer.removeChild(child);
            } else {
                //reserve
            }
        }
    }

    public removeChildAt(index: number, origin?: boolean) {
        if (origin) {
            this.displayObjectContainer.removeChildAt(index);
        } else {
            this.gcomponent.removeChildAt(index);
        }
    }

    public get numChildren(): number {
        return this.gcomponent.numChildren;
    }

    public get originNumChildren(): number {
        return this.displayObjectContainer.numChildren;
    }

    /**
     * 移除子对象
     * 
     * @memberof GuiComponent
     */
    public removeChildren(origin?: boolean): void {
        if (origin) {
            if (this.gcomponent) {
                this.gcomponent.removeChildren();
            }
            if (this.displayObjectContainer) {
                this.displayObjectContainer.removeChildren();
            }
            return;
        }

        if (this.gcomponent) {
            this.gcomponent.removeChildren();
        }
    }

    /**获取某个类型的挂件 没有返回null */
    public getWidget<T extends GuiWidget>(cls: new () => T): T {
        return this.guiOwner.getComponent(cls);
    }

    /**删除母体上所有的某个类型挂件 */
    public removeTypeWidget(cls: typeof GuiWidget) {
        this.guiOwner.removeTypeComponent(cls);
    }

    /**删除母体上的某个挂件 */
    public removeOneWidget(cls: typeof GuiWidget | GuiWidget) {
        this.guiOwner.removeOneComponent(cls);
    }

    /**一定能获取到某个类型挂件 没有就自动添加 */
    public getAddWidget<T extends GuiWidget>(c: new () => T): T {
        return this.guiOwner.getAddComponent(c);
    }

    protected onDispose(): void {
        if (this._guiOwner) {
            this._guiOwner.destroy();
            this._guiOwner = null;
        }

        if (this._coms) {
            this._coms.forEach(com => {
                com.dispose();
            });
        }
        super.onDispose();
    }

    public createCom<T extends GuiComponent>(cls: new (com?: fairygui.GComponent) => T, name: string): T {
        if (!this._coms) {
            this._coms = [];
        }
        let com = new cls(this.gcomponent.getChild(name).asCom);
        this._coms.push(com);
        return com as T;
    }
}