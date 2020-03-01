/**
 * @author 雪糕 
 * @desc GUI弹窗
 * @date 2018-04-11 19:44:34 
 * @Last Modified by: 雪糕
 * @Last Modified time: 2020-02-27 23:16:36
 */
abstract class GuiWindow extends GuiViewStack {
    /** 窗口深度 */
    public windowDepth: gui.eWindowDepth = gui.eWindowDepth.middle;

    /** 是否高斯模糊 */
    public needBlur: boolean = true;

    protected onCloseCB: () => void;

    public constructor() {
        super();
    }

    public close(data?: any, dispose?: boolean): void {
        GuiWindowMgr.instance.closeWindow(util.getClassDefinition(this.className), data, dispose);
    }

    /**
     * 接受其他视图消息
     * @param data 
     */
    public receiveData(transId: gui.eTransId, ...param): void { }

    protected onInit() {
        super.onInit();
        let screenCutout = ScreenAdapter.getScreenCutout();
        if (screenCutout) {
            this.handleScreenCutout(screenCutout);
        }
    }

    private handleScreenCutout(screenCutout: number) {
        let iphoneXBottomHeight = ScreenAdapter.iphoneXBottomHeight;
        for (let j = 0; j < this._gcomponent.numChildren; j++) {
            let child = this._gcomponent._children[j];
            if (child.data && typeof child.data == 'string') {
                let datas = child.data.split(',');
                for (let i = 0; i < datas.length; i++) {
                    let key = datas[i];
                    let value = (+datas[i + 1]);
                    if (key == 'xOffset' && value) {
                        child.x += value * screenCutout;
                    } else if (iphoneXBottomHeight && key == 'yOffset' && value) {
                        child.y += value * screenCutout;
                    }
                }
            }
        }
    }

    public setCloseCB(cb: () => void) {
        this.onCloseCB = cb;
    }

    protected onHide() {
        super.onHide();
        if (this.onCloseCB) {
            this.onCloseCB();
            this.onCloseCB = null;
        }
    }
}