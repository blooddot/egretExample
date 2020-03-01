/**
 * @author 雪糕 
 * @desc 
 * @date 2018-07-02 15:24:31 
 * @Last Modified by: 雪糕
 * @Last Modified time: 2018-07-16 17:27:01
 */
class AlertVO {
    public confirmFunc: Function;
    public cancelFunc: Function;
    public closeFunc: Function;
    public content: any;
    public title: string;

    /**
     * 
     * @param content 内容
     * @param confirmFunc 确认回调
     * @param cancelFunc 取消回调
     */
    public constructor(content: any, title?: string, confirmFunc?: Function, cancelFunc?: Function, closeFunc?: Function) {
        this.content = content;
        this.title = title && title;
        this.confirmFunc = confirmFunc && confirmFunc;
        this.cancelFunc = cancelFunc && cancelFunc;
        this.closeFunc = closeFunc && closeFunc
    }
}