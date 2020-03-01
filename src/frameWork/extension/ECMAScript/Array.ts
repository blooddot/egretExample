/**
 * @author 雪糕 
 * @desc 原生Array扩展
 * @date 2020-02-27 23:34:28 
 * @Last Modified by: 雪糕
 * @Last Modified time: 2020-02-27 23:43:30
 */
interface Array<T> {
    /** 删除指定元素 */
    remove(this: Array<T>, element: T): boolean;

    /** 删除指定条件元素 */
    remove(this: Array<T>, predicate: (value: T, index: number, obj: T[]) => boolean, thisArg?: any): boolean;

    /** 包含指定元素 */
    contains(this: Array<T>, element: T): boolean;
}

Array.prototype.remove = function <T>(this: Array<T>, element: T): boolean {
    let index = this.indexOf(element);
    if (index === -1) {
        return false;
    }
    this.splice(index, 1);
    return true;
}

Array.prototype.remove = function <T>(this: Array<T>, predicate: (value: T, index: number, obj: T[]) => boolean, thisArg?: any): boolean {
    let index = this.findIndex(predicate, thisArg);
    if (index === -1) {
        return false;
    }
    this.splice(index, 1);
    return true;
}

Array.prototype.contains = function <T>(this: Array<T>, element: T): boolean {
    let index = this.indexOf(element);
    if (index === -1) {
        return false;
    }

    return true;
}