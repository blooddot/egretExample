/**
 * @author 雪糕 
 * @desc 
 * @date 2020-02-08 20:51:38 
 * @Last Modified by: 雪糕
 * @Last Modified time: 2020-02-16 22:14:17
 */
namespace capabilities {
    /** 是否是ipad 只有webview模式下才能用 */
    export let isIpad: boolean = navigator && navigator.platform === "iPad";

    /** 是否是iphone 只有webview模式下才能用 */
    export let isIphone: boolean = navigator && navigator.platform === "iPhone";

    /** 是否手机端 */
    export let isMobile: boolean = egret.Capabilities.isMobile;

    /** 是否web端 */
    export let isWeb: boolean = egret.Capabilities.runtimeType == egret.RuntimeType.WEB;

    /** 是否runtime */
    export let isRuntime: boolean = egret.Capabilities.runtimeType == egret.RuntimeType.RUNTIME2;

    /** 是否微信游戏 */
    export let isWxgame: boolean = egret.Capabilities.runtimeType == egret.RuntimeType.WXGAME;

    /** 是否安卓系统 */
    export let isAndroid: boolean = egret.Capabilities.os == "Android";

    /** 是否ios系统 */
    export let isIOS: boolean = egret.Capabilities.os == "iOS";
}