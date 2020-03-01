/**
 * @author 雪糕 
 * @desc 
 * @date 2020-02-28 00:09:05 
 * @Last Modified by: 雪糕
 * @Last Modified time: 2020-02-28 00:10:09
 */
class ViewStackArgsVO {
    public className: string;
    public callBack?: (className: string) => void;
    public args?: any[];

    public constructor(className: string, callBack?: (className: string) => void, ...args: any[]) {
        this.className = className;
        this.callBack = callBack;
        this.args = args;
    }
}