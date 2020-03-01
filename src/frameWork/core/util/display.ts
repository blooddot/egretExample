/**
 * @author 雪糕 
 * @desc 显示相关
 * @date 2020-02-27 21:10:02 
 * @Last Modified by: 雪糕
 * @Last Modified time: 2020-02-27 21:12:31
 */
namespace display {
    /** 从父级移除子对象 */
    export function removeFromParent(child: { parent }): void {
        if (child) {
            if (child.parent) {
                if (child instanceof egret.DisplayObject) {
                    child.parent.removeChild(child);
                } else if (child instanceof fairygui.GObject) {
                    child.parent.removeChild(child);
                } else if (child instanceof GuiObject) {
                    child.parent.removeChild(child.gobject);
                } else {
                    //reserve
                }
            } else if (child instanceof GuiObject && child.originParent) {
                child.originParent.removeChild(child.displayObject);
            } else {
                //reserve    
            }
        }
    }

    /** 添加子对象 */
    export function addChild(parent: GuiComponent | fairygui.GComponent | egret.DisplayObjectContainer, child: GuiObject | fairygui.GObject | egret.DisplayObject): boolean {
        if (!parent || !child) {
            return false;
        }

        let parentContainer: egret.DisplayObjectContainer;
        let childObject: egret.DisplayObject;
        if (parent instanceof GuiComponent) {
            parentContainer = parent.displayObjectContainer;
        } else if (parent instanceof fairygui.GComponent) {
            parentContainer = parent.displayListContainer;
        } else {
            parentContainer = parent;
        }

        if (child instanceof GuiObject) {
            childObject = child.displayObject;
        } else if (child instanceof fairygui.GObject) {
            childObject = child.displayObject;
        } else {
            childObject = child;
        }

        parentContainer.addChild(childObject);
        return true;
    }
}