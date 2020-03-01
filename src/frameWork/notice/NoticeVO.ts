/**
 * @author 雪糕 
 * @desc 消息数据对象
 * @date 2020-02-27 23:45:35 
 * @Last Modified by: 雪糕
 * @Last Modified time: 2020-02-27 23:52:31
 */
class NoticeVO {
	private _name: string;
	/** 消息名 */
	public get name(): string {
		return this._name;
	}

	private _callback: (name: string, ...args: any[]) => void;
	/** 消息回调 */
	public get callback(): (name: string, ...args: any[]) => void {
		return this._callback;
	}

	private _thisObject: any;
	/**  作用对象 */
	public get thisObject(): any {
		return this._thisObject;
	}

	public constructor(name: string, callback: (name: string, ...args: any[]) => void, thisObject: any) {
		this._thisObject = thisObject;
		this._name = name;
		this._callback = callback;
	}
}
