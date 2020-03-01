/**
 * @author 雪糕 
 * @desc 原生Date扩展
 * @date 2020-02-27 23:34:17 
 * @Last Modified by 雪糕 
 * @Last Modified time 2020-02-27 23:34:17 
 */
interface Date {
    format(this: Date, needms?: boolean): string;
}

Date.prototype.format = function (this: Date, needms: boolean = false): string {
    let month = this.getMonth() + 1;
    let formatStr = `${this.getFullYear()}-${month}-${this.getDate()} ${this.getHours()}:${this.getMinutes()}:${this.getSeconds()}`;
    if (needms) {
        formatStr += `:${this.getMilliseconds()}`;
    }
    return formatStr;
}