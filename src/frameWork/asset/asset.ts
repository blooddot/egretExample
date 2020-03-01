/**
 * @author 雪糕
 * @desc 资源定义
 * @date 2019-01-18 15:55:13
 * @Last Modified by: 雪糕
 * @Last Modified time: 2020-02-27 23:56:11
 */
namespace asset {
    /**
     * 资源加载优先级
     * 低
     * 中
     * 高
     */
    export enum ePriority {
        low = 1,
        middle = 2,
        high = 3,
    }

    /**
     * 资源类型
     * 0: 组资源
     * 1: 单个资源
     */
    export enum eAssetType {
        group = 0,
        single = 1
    }

    let _instance: AssetController = null;

    /** 外部调试用的方法 */
    export function $getInstance(): AssetController {
        return getInstance();
    }

    //用的时候初始化  否则找不到一些依赖顺序的其他类
    function getInstance(): AssetController {
        if (!_instance) {
            _instance = new AssetController();;
        }
        return _instance;
    }

    /**
     * 加载资源组
     * @param name 资源组名称
     * @param priority 资源加载优先级
     * @param groupPriority 资源组加载优先级-白鹭系统调用
     * @param reporter 资源组的加载进度提示
     */
    export function loadGroup(name: string, priority: ePriority = ePriority.middle, groupPriority?: number, reporter?: RES.PromiseTaskReporter): Promise<any> {
        if (!RES.isGroupLoaded(name)) {
            return getInstance().loadGroup(name, priority, groupPriority, reporter);
        }
    }

    /**
     * 加载资源
     * @param key 资源key
     * @param priority 资源加载优先级
     * @param retain 是否保留
     * @param type 文件类型(可选,只有在url加载方式下生效)。请使用 ResourceItem 类中定义的静态常量。若不设置将根据文件扩展名生成。
     */
    export function loadAsset(key: string, priority: ePriority = ePriority.middle, retain: boolean = false, type?: string): Promise<any> {
        return getInstance().loadAsset(key, priority, retain, type);
    }

    /**
     * 卸载资源
     * @param key 资源key
     * @param disposeAsset 卸载后如果引用计数为0; true: 直接销毁资源; false: 等待自动销毁资源
     */
    export function unloadAsset(key: string, disposeAsset: boolean = false): void {
        if (RES.hasRes(key) && isAssetLoaded(key)) {
            getInstance().unloadAsset(key, disposeAsset);
        }
    }

    /**
     * 删除已加载的资源组资源
     * @param group 组名称
     */
    export function destroyGroupAsset(group: string): void {
        getInstance().destroyGroupAsset(group);
    }

    /**
     * 获取已加载的资源
     * @param key 资源key
     */
    export function getAsset(key: string): any {
        return getInstance().getAsset(key);
    }

    /**
     * 判断资源是否已加载
     * @param key 资源key
     */
    export function isAssetLoaded(key: string): boolean {
        return getInstance().isAssetLoaded(key);
    }

    /**
     * 异步获取资源 如果有未加载的,先加载再返回
     * @param key 资源key
     * @param priority 资源加载优先级 
     * @param retain 资源是否保留 不保留会自动释放
     * @param compFunc 回调方法
     * @param thisObject 回调方法所在的对象
     * @param type 文件类型(可选,只有在url加载方式下生效)。请使用 ResourceItem 类中定义的静态常量。若不设置将根据文件扩展名生成。
     */
    export async function getAssetAsync(key: string, priority: ePriority = ePriority.middle, retain: boolean = false, compFunc?: (value) => void, thisObject?: any, type?: string) {
        return await getInstance().getAssetAsync(key, priority, retain, compFunc, thisObject, type);
    }

    /**
    * 资源计数增加
    * @param key 资源key
    * @param retain 资源是否保留
    */
    export function addAssetCount(key: string, retain: boolean = false): void {
        getInstance().addAssetCount(key, retain);
    }

    /**
     * 添加监听事件
     * @param type 事件类型
     * @param listener 执行方法
     * @param thisObject this对象
     * @param useCapture 是否冒泡
     * @param priority 优先级
     */
    export function addEventListener(type: string, listener: Function, thisObject: any, useCapture?: boolean, priority?: number): void {
        getInstance().addEventListener(type, listener, thisObject, useCapture, priority);
    }

    /**
     * 移除监听时间
     * @param type 事件类型
     * @param listener 执行方法
     * @param thisObject this对象
     * @param useCapture 
     */
    export function removeEventListener(type: string, listener: Function, thisObject: any, useCapture?: boolean): void {
        getInstance().removeEventListener(type, listener, thisObject, useCapture);
    }

    export const COUNT_TIMER: string = "COUNT_TIMER";

    /**
     * 资源组枚举
     */
    export enum eGroup {
        loading = "loading",
        fairyGui = "fairyGui",
        preload = "preload",
        boyAni = "boyAni",
        girlAni = "girlAni",
        fairySound = "fairySound",
        regSheet = "regSheet",
        login = "login"
    }

    /**
     * 登录用资源组
     */
    export const LOGIN_GROUPS = [
        eGroup.login
    ]

    /**
     * 注册用资源组
     */
    export const REGISTER_GROUPS = [
        { group: eGroup.regSheet, clear: true },
        { group: eGroup.girlAni, clear: false },
        { group: eGroup.boyAni, clear: false }
    ]
}