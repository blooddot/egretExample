/**
 * @author 雪糕 
 * @desc GUI常量
 * @date 2018-04-11 14:18:03 
 * @Last Modified time: 2018-07-02 22:35:34 */
namespace gui {
    /** 层级枚举 */
    export enum eLayerType {
        scene = 1,
        back,
        middle,
        front,
    }

    /** 方向枚举 */
    export enum eDirect {
        none = 0,
        up = 1,
        left = 2,
        down = 4,
        right = 8,
        leftUp = 3,
        leftDown = 6,
        rightUp = 9,
        rightDown = 12,
        center = 15,
        dynamic = 99
    }

    /** 提示文字类型美剧 */
    export enum eToastType {
        default,
        left,
        right,
        bottom,
        top,
        center,
        taskCompleted
    }

    /** 窗口深度枚举 */
    export enum eWindowDepth {
        blur = 1,
        bottom,
        middle,
        top
    }

    /** gui包名 */
    export const PKG_NAME = {
        common: "common",
    }

    /** gui扩展 */
    export const GUI_EXTENSION: { pkg: string, res: string, cls }[] = [
        // { pkg: gui.PKG_NAME.common, res: "CustomMark", cls: CustomMark },
    ]

    /** 显示动画类型 */
    export enum eShowAnimType {
        none,
        default,
        alpha,
        flash,
        fullScreen
    }

    /** ui传输数据id */
    export enum eTransId {
        default = 1001,
    }

    /**
     * 设置gui文本
     * @param tf 文本组件
     * @param valueList 文本中对应的所有变量对应值数组
     */
    export function fillGUITextVar(tf: fairygui.GTextField, valueList: string[]) {
        if (!tf || !valueList || valueList.length == 0) {
            logger.error(LOG_TAG.gui, `fillGUITextVar() error tf=${tf} valueList=${valueList}`);
            return;
        }

        for (let i = 0; i < valueList.length; i++) {
            tf.setVar(`var${i}`, valueList[i]).flushVars();
        }
    }

    /** 获取gui内纹理 */
    export function getFairyGuiTexture(pkgName: string, resName: string): egret.Texture {
        let itemUrl = fairygui.UIPackage.getItemURL(pkgName, resName)
        if (!itemUrl) {
            logger.error(LOG_TAG.gui, `包${pkgName}不存在资源${resName}`);
            return;
        }
        let item = fairygui.UIPackage.getItemByURL(itemUrl);
        if (item && item.type == fairygui.PackageItemType.Image) {
            return item.texture || item.load();
        }

        return null;
    }
    /**记录obj异步加载icon时最后一次设置icon，用来icon异步加载好后判断是否是obj最后设置的icon */
    let asyncIconDictionary: Dictionary<number, string[]> = new Dictionary<number, string[]>();

    /**
     * 异步设置fairyguiObject的 icon对象
     * @param obj object对象
     * @param icon icon
     * @param priority 加载优先级
     */
    export function setIconAsync(obj: fairygui.GObject | fairygui.GLoader, icon: string, priority: asset.ePriority = asset.ePriority.middle, retain: boolean = false, compFunc?: (value) => void, thisObject?: any) {
        let icons = asyncIconDictionary.getValue(obj.hashCode);
        if (!icons) {
            icons = [];
            asyncIconDictionary.setValue(obj.hashCode, icons);
        }
        icons.push(icon);

        return new Promise((resolve, reject) => {
            let finishFunc = (icon) => {
                let recordIcons = asyncIconDictionary.getValue(obj.hashCode);
                let recordIndex = recordIcons.indexOf(icon);
                if (recordIndex != -1) {
                    setIcon(obj, icon);
                    recordIcons.splice(recordIndex, 1);
                    if (recordIcons.length === 0) {
                        asyncIconDictionary.remove(obj.hashCode);
                    }
                    resolve();
                    if (compFunc) {
                        compFunc.call(thisObject);
                    }
                } else {
                    reject();
                    logger.error(LOG_TAG.asset, `设置的icon不一致 icon:${icon}`);
                }
            }

            if (!icon || icon === "" || fairygui.ToolSet.startsWith(icon, "ui://")) {
                finishFunc(icon)
            } else {
                asset.getAssetAsync(icon, priority, retain, (value) => {
                    finishFunc(icon)
                }, this, RES.ResourceItem.TYPE_IMAGE);
            }
        });
    }

    /**
     * 设置fairyguiObject的 icon对象
     * @param obj object对象
     * @param icon icon
     * @param priority 加载优先级
     */
    export function setIcon(obj: fairygui.GObject | fairygui.GLoader, icon: string) {
        let oldIcon: string;
        if (obj.icon && RES.hasRes(obj.icon)) {
            oldIcon = obj.icon;
        }

        if (!icon
            || icon === ""
            || fairygui.ToolSet.startsWith(icon, "ui://")) {
            obj.icon = icon;
        } else {
            if (obj instanceof fairygui.GLoader) {
                obj.texture = asset.getAsset(icon);
            } else {
                obj.icon = icon;
                asset.addAssetCount(icon);
            }
        }

        if (oldIcon) {
            asset.unloadAsset(oldIcon);
        }
    }
}
