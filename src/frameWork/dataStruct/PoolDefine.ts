/**
 * @author 雪糕 
 * @desc 对象池
 * @date 2020-02-08 17:41:56 
 * @Last Modified by: 雪糕
 * @Last Modified time: 2020-02-08 21:32:09
 */

interface IPool {
	onInit(...params): void;
	onUnInit(): void;
}

namespace pool {
	let _poolMap: Object = {};

	/**从池中取出 可带多个参数 参数给实例 onInit使用 */
	export function pop<T extends IPool>(cl: new () => T, ...params): T {
		let classObject: T = null;
		let className: string = egret.getQualifiedClassName(cl);
		let classObjects: T[] = _poolMap[className];
		if (classObjects == null || classObjects.length == 0) {
			classObject = new cl();
		} else {
			classObject = classObjects.pop();
		}

		if (params) {
			classObject.onInit(...params);
		}

		return classObject;
	}

	/** 推入池中 */
	export function push(classObject: IPool): void {
		if (!classObject) return;
		let className: string = egret.getQualifiedClassName(classObject);
		let classObjects: IPool[] = _poolMap[className];
		if (!classObjects) {
			classObjects = [];
			_poolMap[className] = classObjects;
		}

		if (classObjects.length > 0) {
			//为了性能 只找上一个和本个 一般都是连续推入多次
			if (classObject == classObjects[classObjects.length - 1]) {
				lanbo.logger.error(LOG_TAG.FrameWork, `对象池 同个对象 推入重复`);
				return;
			}
		}

		classObject.onUnInit();
		classObjects.push(classObject);
	}
}