/**
 * @author 雪糕 
 * @desc 
 * @date 2020-02-08 21:12:22 
 * @Last Modified by: 雪糕
 * @Last Modified time: 2020-02-08 21:25:57
 */
namespace lanbo {
	export namespace LocalStorage {
		export function setItem(key: string, data: any) {
			if (!key || data == undefined || data == null) return;
			let str: string = JSON.stringify(data);
			egret.localStorage.setItem(key, str);
		}

		/**储存标记位 */
		export function setMark(key: string) {
			if (!key) return;
			egret.localStorage.setItem(key, "1");
		}

		export function getItem(key: string) {
			if (!key) return;
			let data: any = JSON.parse(egret.localStorage.getItem(key));
			return data;
		}

		export function removeItem(key: string) {
			if (!key) return;
			egret.localStorage.removeItem(key);
		}
	}
}