/**
 * @author 雪糕 
 * @desc 工具
 * @date 2020-02-27 21:00:10 
 * @Last Modified by: 雪糕
 * @Last Modified time: 2020-02-27 23:50:11
 */
namespace util {
    /** 获取类定义 */
    export function getClassDefinition(cls: any) {
        if (!cls) {
            return null;
        }

        if ((typeof cls) == "string") {
            return egret.getDefinitionByName(cls);
        }

        return cls;
    }

    /** 获取类名 */
    export function getQualifiedClassName(cls: any) {
        let clsName: string = "";
        if (!cls) {
            return clsName;
        }

        if ((typeof cls) == "string") {
            return cls;
        }

        return egret.getQualifiedClassName(cls);
    }

    /** 执行一个方法 */
    export function call(func?: (...param) => void, thisObject?: any, ...param): void {
        if (func) {
            if (thisObject) {
                func.call(thisObject, ...param);
            } else {
                func(...param);
            }
        }
    }

    /** 本地坐标转本地坐标,将fromTarget的本地坐标转为 toTarget的本地坐标 */
    export function localToLocal(x: number, y: number, fromTarget: GuiObject | fairygui.GObject | egret.DisplayObject, toTarget: GuiObject | fairygui.GObject | egret.DisplayObject) {
        if (!fromTarget || !toTarget) return null;
        let pos: egret.Point;
        if (fromTarget instanceof GuiObject) {
            pos = fromTarget.displayObject.localToGlobal(x, y);
        } else if (fromTarget instanceof fairygui.GObject) {
            pos = fromTarget.displayObject.localToGlobal(x, y);
        } else {
            pos = fromTarget.localToGlobal(x, y);
        }

        if (toTarget instanceof GuiObject) {
            pos = toTarget.displayObject.globalToLocal(pos.x, pos.y);
        } else if (toTarget instanceof fairygui.GObject) {
            pos = toTarget.displayObject.globalToLocal(pos.x, pos.y);
        } else {
            pos = toTarget.globalToLocal(pos.x, pos.y);
        }
        return pos;
    }
}