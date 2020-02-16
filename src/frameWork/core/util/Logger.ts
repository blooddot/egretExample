/**
 * @author 雪糕 
 * @desc 日志管理
 * @date 2020-02-08 16:39:55 
 * @Last Modified by: 雪糕
 * @Last Modified time: 2020-02-16 22:27:03
 */
const LOG_TAG = {
	example: "example",
	net: "net",
	frameWork: "frameWork",
	Test: "Test",
}

namespace logger {
	let _model: Model;

	export function init() {
		_model = new Model();
		logger.log(LOG_TAG.frameWork, `logger 初始化完毕`);
	}

	export enum eLogType {
		error,
		warn,
		log,
		info,
		unknown,
	}

	export const TYPE_TO_NAME = {
		0: 'error',
		1: 'warn',
		2: 'log',
		3: 'info',
		4: 'unknown'
	}

	/** 单挑数据 */
	class LogVO {
		public type: eLogType;
		public tag: string;
		public title: string;
		public message: string;

		public constructor(tag: string, msg: string, type: eLogType) {
			this.type = type;
			this.tag = tag;
			if (msg.indexOf('\n') != -1) {
				this.title = msg.slice(0, msg.indexOf('\n') + 1);
			}
			else {
				this.title = msg;
			}
			this.message = msg;
		}

		public getRemovedPathStack(): string {//去除堆栈中的路径，只显示文件名字
			if (this.type != eLogType.error && this.type != eLogType.warn) {
				return this.message;
			}
			let stack = this.message.split('\n');
			let result = '';
			for (let i = 0; i < stack.length; i++) {
				// if (!i) continue;
				let msg = stack[i];
				let pathFirstCharIndex = msg.indexOf('(') + 1;
				let lastSpritIndex = msg.lastIndexOf('/');
				if (pathFirstCharIndex != -1 && lastSpritIndex != -1) {
					msg = msg.replace(msg.slice(pathFirstCharIndex, lastSpritIndex + 1), '');
				}
				result = result + msg + '\n';
			}
			return result;
		}

		public parseToObj() {
			return { type: this.type, tag: this.tag, message: this.message };
		}
	}

	/** 数据 */
	class Model extends BaseModel {

		/**保存日志数组上限 kb */
		private maxKByte: number = 10000;
		private maxLogNum: number = 1000;
		private _maxCovertLogNum: number = 100000;

		private _allLogData: LogVO[] = [];
		private logName: string = 'logDataBase';
		public typeMap = new Dictionary<string, boolean>();
		public tagMap = new Dictionary<string, boolean>();

		private _covertLogMap: Dictionary<string, string[]> = new Dictionary<string, string[]>();

		private indexedDB: IDBFactory = window.indexedDB || window['mozIndexedDB'] || window['webkitIndexedDB'] || window['msIndexedDB'];
		private _isInit: boolean = false;
		protected async onInit() {
			if (this._isInit) {
				return;
			}

			let tableName = this.uploadLogTime;

			//native暂时不支持 会启动报错
			if (!capabilities.isRuntime && this.isSupportIndexedDB) {
				await this.createObjectStore('logDataBase', tableName);
				this.getTableName('logDataBase');
			}

			//启用了worker
			if (net.worker) {
				net.postMessageToWorker("LoggerInit", tableName);
			} else {
				if (net.webSocketWorker) {
					net.webSocketWorker.writeLog(tableName);
				}
			}

			this._isInit = true;
		}

		protected onUnInit() {

		}


		/**日志上传格式的时间 */
		private get uploadLogTime() {
			return time.getStartupTime().toString();
		}

		public addErrorLog(tag: string, message: string) {
			let logData = new LogVO(tag, message, eLogType.error);
			this.addLogData(logData);
		}

		public addWarnLog(tag: string, message: string) {
			let logData = new LogVO(tag, message, eLogType.warn);
			this.addLogData(logData);
		}

		public addInfoLog(tag: string, msg: string) {
			let logData = new LogVO(tag, msg, eLogType.info);
			this.addLogData(logData);
		}

		public addLog(tag: string, msg: string) {
			let logData = new LogVO(tag, msg, eLogType.log);
			this.addLogData(logData);
		}

		public addCovertLog(tag: string, msg: string) {
			let logData = this._covertLogMap.getValue(tag);
			if (!logData) {
				logData = [];
				this._covertLogMap.setValue(tag, logData);
			}

			if (logData.length > this._maxCovertLogNum) {
				logData.shift();
			}
			logData.push(msg);
		}

		public addLogData(logData: LogVO) {
			let typeName = TYPE_TO_NAME[logData.type];
			let tagName = logData.tag;
			this.typeMap.setValue('all', true);
			this.typeMap.setValue(typeName, true);
			this.tagMap.setValue(tagName, true);
			this.saveData(logData);
			this._allLogData.push(logData);
			if (this._allLogData.length > this.maxLogNum) {
				this._allLogData.shift();//FIXME:以后要用链表解决频繁增删问题
			}
		}

		public get allLogData() {
			return this._allLogData.map(logData => logData);
		}

		public get kByteSize() {
			let allStr = '';
			this._allLogData.forEach(logData => {
				allStr += logData.message;
			});
			return this.byteCount(allStr) / 1024;
		}

		private saveLogToLocalStorage() {
			let logDatas = [];
			this._allLogData.forEach(logData => {
				logDatas.push(logData.parseToObj());
			});
			// let time = GameTimeManager.formatPrintedStartTime;
			let time = this.uploadLogTime;
			let data = { time: time, logDatas: logDatas };
			LocalStorage.setItem('lastLog', data);
		}

		public downLoadLog() {
			let downContent = '';
			this._allLogData.forEach((logData, index) => {
				let message = logData.message.split('\n').join('\r\n');
				downContent += ((index + 1 + '. ') + message + '\r\n\r\n');
			});
			if (typeof downContent === "object") {
				downContent = JSON.stringify(downContent, undefined, 4)
			}
			var blob = new Blob([downContent], { type: 'text/json' });
			let e = document.createEvent('MouseEvents');
			let a = document.createElement('a');
			// a.download = GameTimeManager.formatPrintDate(new Date(GameTimeManager.startTime)) + '.log';
			a.download = this.uploadLogTime;
			a.href = window.URL.createObjectURL(blob);
			a.dataset.downloadurl = ['text/json', a.download, a.href].join(':')
			e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
			a.dispatchEvent(e)
		}

		public getLog(): string[] {
			this.getTableName('logDataBase');
			let logTables = LocalStorage.getItem("LogDataName");
			return logTables;
		}

		/**获取特定的表log*/
		public getLogFromTableName(tableName: string, compFunc?: (data) => void, thisObject?: any) {
			let data: string = " ";
			this.readAll('logDataBase', tableName, () => {
				let dataList = LocalStorage.getItem("LogData");
				dataList.forEach((Object, index) => {
					let message = Object.message.split('\n').join('\r\n');
					data += ((index + 1 + '. ') + message + '\r\n\r\n');
				});
				if (compFunc) {
					compFunc.call(thisObject, data);
				}
			});
		}

		private dataListTostring() {
		}

		/**获取当前的log */
		public getAllLogText() {
			let downContent = '';
			this._allLogData.forEach((logData, index) => {
				let message = logData.message.split('\n').join('\r\n');
				downContent += ((index + 1 + '. ') + message + '\r\n\r\n');
			});
			return downContent;
		}

		public consoleCovertLog(tag: string): void {
			let logData = this._covertLogMap.getValue(tag);
			if (!logData) {
				return;
			}

			for (const iterator of logData) {
				console.log(iterator);
			}
		}

		public clear() {
			this._allLogData = [];
			this.tagMap.clear();
			this.typeMap.clear();
		}

		/**打开一个数据库，如果不存在该数据库则创建一个 */
		public createObjectStore(dbName, storeName, data?: any): Promise<any> {
			return new Promise((res, rej) => {
				let request = indexedDB.open(dbName);
				request.onsuccess = function (e) {
					// let database = e.target['result'] as IDBDatabase;
					let database = request.result as IDBDatabase;
					let version = database.version;
					database.close();
					let secondRequest = indexedDB.open(dbName, version + 1);
					secondRequest.onupgradeneeded = function (e) {
						// let database = e.target['result'] ;
						let database = secondRequest.result as IDBDatabase;
						if (!database.objectStoreNames.contains(storeName)) {
							database.createObjectStore(storeName, { autoIncrement: true });
						}

					};
					secondRequest.onsuccess = function (e) {
						let db = secondRequest.result as IDBDatabase;
						if (data) {
							let store = db.transaction(storeName, 'readwrite').objectStore(storeName);
							store.add(data);
						}
						db.close();
						res();
					}
					secondRequest.onerror = function (e) {
						rej();
					}
				}
				request.onerror = function () {
					rej();
				}
			});
		}

		// public saveData(dbName: string, tableName: string, data: any): Promise<any> {
		public saveData(data: any) {
			if (!this._isInit) {
				return;
			}

			//启用了worker
			if (net.worker) {
				net.postMessageToWorker("Logger", data);
			} else {
				if (net.webSocketWorker) {
					net.webSocketWorker.writeLog(data);
				}
			}
		}

		public get isSupportIndexedDB() {
			return (window.indexedDB || window['mozIndexedDB'] || window['webkitIndexedDB'] || window['msIndexedDB']) ? true : false;
		}

		public deleteTable(dbName: string, tableName: string) {
			let request = this.indexedDB.open(dbName);
			request.onupgradeneeded = function () {
				let db = request.result as IDBDatabase;
				if (!db.objectStoreNames.contains(tableName)) {
					db.deleteObjectStore(tableName);
				}
			}
		}
		/**将db上两天内的LogName写入LocalStorage */
		public getTableName(dbName: string) {
			let tableNameList: string[] = [];
			let request = this.indexedDB.open(dbName);
			request.onsuccess = () => {
				let db = request.result as IDBDatabase;
				let curTimeStamp = this.uploadLogTime;
				let deltaTime = 172800000;  //两天单位为毫秒
				let TwoDaysBefore = Number(curTimeStamp) - deltaTime;
				for (let index = 0; index < db.objectStoreNames.length; index++) {
					const name = db.objectStoreNames[index];
					if (Number(name) > TwoDaysBefore) {
						tableNameList.push(name);
						LocalStorage.setItem("LogDataName", tableNameList);
					}
				}
				db.close();
			}
		}

		public readAll(dbName: string, tableName: string, compFunc?: () => void, thisObject?: any) {
			let request = this.indexedDB.open(dbName);
			request.onsuccess = (e) => {
				let db = request.result as IDBDatabase;
				let store = db.transaction(tableName).objectStore(tableName);
				let req = store.openCursor();//打开游标
				let dataList = new Array();
				let i = 0;
				req.onsuccess = (e) => {
					let cursor = e.target['result'];
					if (cursor) {
						dataList[i] = cursor.value;
						i++;
						cursor.continue();
					}
					LocalStorage.setItem("LogData", dataList);
				}
				if (compFunc) {
					compFunc.call(thisObject);
				}
			}
		}

		/**不精确计算字符串字节数 */
		private byteCount(str: string) {
			return str.length * 2;
			// return encodeURI(str).split(/%..|./).length - 1;
		}
	}

	/** 日志加头部信息 needTime:是否需要加入时间信息  上报不需要时间信息 */
	function addLogHead(tag: string, info: string, needTime: boolean = true): string {
		if (needTime) {
			return `[${tag}]${new Date().format(true)}\t${info}`;
		} else {
			return `[${tag}]\t${info}`;
		}
	}

	/** 检查是否能够打印到控制台 */
	function checkCanToConsole(): boolean {
		if (egret.Capabilities.isMobile) {
			return false;
		}

		return true;
	}

	/** 打印Log  可选参数会转为json格式输出 */
	export function log(tag: string, msg: string, ...args: any[]) {
		let argStr = args.length > 0 ? `:${JSON.stringify(args)}` : "";
		let logMsg = "[L]" + addLogHead(tag, msg + argStr);
		if (checkCanToConsole()) {
			console.log(logMsg);
		}
		_model.addLog(tag, logMsg);
	}

	/** 收集一个隐藏log 可以在调试时打印出来 */
	export function covertLog(tag: string, mess: string) {
		let logMsg = "[L]" + addLogHead(tag, mess);
		_model.addCovertLog(tag, logMsg);
	}

	/** 打印输出某个tag的log */
	export function consoleCovertLog(tag: string) {
		_model.consoleCovertLog(tag);
	}

	/** 打印info 后面参数用console格式打印 不会转为json格式 */
	export function info(tag: string, msg: string, ...args: any[]) {
		let infoMsg = "[I]" + addLogHead(tag, msg);
		if (checkCanToConsole()) {
			console.info(infoMsg, args);
		}
		_model.addInfoLog(tag, infoMsg);
	}

	/**
	 * 打印错误
	 * @param tag 
	 * @param msg 
	 * @param reportMsg 默认null  非空时上报的错误会用这里的  就不会直接上报 mess  因为mess中可能带了entityID这些信息 会多算一个错误
	 * @param args 
	 */
	export function error(tag: string, msg: string, reportMsg: string = null, ...args: any[]) {
		let errorInfo: string = "[E]" + addLogHead(tag, msg);
		if (checkCanToConsole()) {
			console.error(errorInfo, args);
		}
		_model.addErrorLog(tag, getErrorStackTrace(errorInfo));

		// if (reportMsg) {
		// 	ErrorReport.instance.error("[E]" + Logger.addLogHead(tag, reportMsg, false));
		// }
		// else {
		// 	ErrorReport.instance.error("[E]" + Logger.addLogHead(tag, mess, false));
		// }
	}

	/** 打印警告 */
	export function warn(tag: string, msg: string, ...args: any[]) {
		let warnMsg = "[W]" + addLogHead(tag, msg);
		if (checkCanToConsole()) {
			console.warn(warnMsg, args);
		}
		_model.addWarnLog(tag, getErrorStackTrace(warnMsg));
	}

	export function trace(tag: string, msg: string, ...args: any[]) {
		if (DEBUG) {
			if (checkCanToConsole()) {
				console.trace("[T]" + addLogHead(tag, msg + ":" + JSON.stringify(args)));
			}
		}
	}

	function getErrorStackTrace(errorMsg = '') {
		let stackMsg = '';
		try { throw new Error(errorMsg); } catch (ex) { stackMsg = ex.stack }
		return stackMsg
	};
}