/**
 * @author 雪糕 
 * @desc 消息管理
 * @date 2020-02-27 23:01:57 
 * @Last Modified by: 雪糕
 * @Last Modified time: 2020-02-28 00:00:47
 */
namespace notice {
	export class NoticeContoller {
		private _noticeVOMap: Dictionary<string, NoticeVO[]>;

		public constructor() {
			this._noticeVOMap = new Dictionary<string, NoticeVO[]>();
		}

		/** 添加消息 */
		public addNotice(noticeName: string, callback: (noticeName: string, ...args: any[]) => void, thisObject: any): void {
			let noticeVO: NoticeVO;
			let noticeVOArr: NoticeVO[] = this._noticeVOMap.getValue(noticeName);
			if (!noticeVOArr) {
				noticeVOArr = [];
				this._noticeVOMap.setValue(noticeName, noticeVOArr);
			} else {
				noticeVO = noticeVOArr.find(value => { return value.name === noticeName && value.callback === callback && value.thisObject === thisObject });
			}

			if (!noticeVO) {
				noticeVO = new NoticeVO(noticeName, callback, thisObject);
				noticeVOArr.push(noticeVO);
			}
		}

		/** 移除消息 */
		public removeNotice(noticeName: string, callback: (noticeName: string, ...args: any[]) => void, thisObject: any): void {
			let noticeVOArr: NoticeVO[] = this._noticeVOMap.getValue(noticeName);
			if (!noticeVOArr) {
				this._noticeVOMap.remove(noticeName);
				return;
			}

			noticeVOArr.remove(value => { return value.name === noticeName && value.callback === callback && value.thisObject === thisObject });

			if (!noticeVOArr.length) {
				this._noticeVOMap.remove(noticeName);
			}
		}

		/** 派发消息 */
		public dispatcherNotice<T, C, A>(noticeName: string, ...args: any[]): void {
			let noticeVOArr: NoticeVO[] = this._noticeVOMap.getValue(noticeName);
			if (!noticeVOArr) return;

			//在执行事件派发过程中，如果在事件的监听函数中有做删除该事件监听的操作，会导致事件监听数组长度缩小，导致后续监听的方法接收不到该事件，所有用concat方法拷贝一份数组出来
			noticeVOArr = noticeVOArr.concat();
			for (const noticeVO of noticeVOArr) {
				if (noticeVO) {
					util.call(noticeVO.callback, noticeVO.thisObject, noticeVO.name, ...args);
				}
			}
		}
	}
}