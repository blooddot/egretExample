namespace lanbo {
    export namespace time {
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
}