/**
 * @author 雪糕 
 * @desc 
 * @date 2020-02-16 22:11:21 
 * @Last Modified by: 雪糕
 * @Last Modified time: 2020-02-16 22:17:22
 */
namespace time {
    /** 获取游戏的启动时间 ms */
    export function getStartupTime(): number {
        return getClientLocalTime().getTime() - getEgretTime();
    }

    /** 客户端本地时间 */
    export function getClientLocalTime(): Date {
        return new Date();
    }

    /** 获取白鹭引擎启动到现在的时间 ms */
    export function getEgretTime(): number {
        return egret.getTimer();
    }
}