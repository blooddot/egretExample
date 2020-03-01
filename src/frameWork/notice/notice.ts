/**
 * @author 雪糕 
 * @desc 
 * @date 2020-02-27 23:55:22 
 * @Last Modified by: 雪糕
 * @Last Modified time: 2020-02-28 00:00:38
 */
namespace notice {
    let _instance: NoticeContoller = null;

    /** 外部调试用的方法 */
    export function $getInstance(): NoticeContoller {
        return getInstance();
    }

    function getInstance(): NoticeContoller {
        if (!_instance) {
            _instance = new NoticeContoller();;
        }
        return _instance;
    }

    /** 添加消息 */
    export function addNotice(noticeName: string, callback: (noticeName: string, ...args: any[]) => void, thisObject: any): void {
        getInstance().addNotice(noticeName, callback, thisObject);
    }

    /** 移除消息 */
    export function removeNotice(noticeName: string, callback: (noticeName: string, ...args: any[]) => void, thisObject: any): void {
        getInstance().removeNotice(noticeName, callback, thisObject);
    }

    /** 派发消息 */
    export function dispatcherNotice<T, C, A>(noticeName: string, ...args: any[]): void {
        getInstance().dispatcherNotice(noticeName, ...args);
    }
}