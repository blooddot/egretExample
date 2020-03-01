/**
 * @author 雪糕 
 * @desc 屏幕适配器
 * @date 2020-02-27 22:53:10 
 * @Last Modified by: 雪糕
 * @Last Modified time: 2020-02-28 00:01:00
 */
class ScreenAdapter {
    private static _screenCutout: number = 0;
    /** 刘海高度 */
    public static getScreenCutout(): number {
        return this._screenCutout;
    }
    public static setScreenCutout(value: number) {
        this._screenCutout = value;
    }

    private static _iphoneXButtonHeight: number = 0;
    public static setIPhoneXBottomHeight(value: number) {
        this._iphoneXButtonHeight = value;
    }
    public static get iphoneXBottomHeight(): number {
        return this._iphoneXButtonHeight;
    }

    private static _mouseX: number;
    /**获取当前鼠标所在x的位置对于的stage的x */
    public static get mouseX(): number {
        return this._mouseX;
    }

    private static _mouseY: number;
    /**获取当前鼠标所在y的位置对于的stage的y */
    public static get mouseY(): number {
        return this._mouseY;
    }

    //游戏设计分辨率
    private static _resolutionWidth: number = 1920;
    public static get resolutionWidth(): number {
        return this._resolutionWidth;
    }
    public static setResolutionWidth(value: number) {
        this._resolutionWidth = value;
    }

    private static _resolutionHeight: number = 1080;
    public static get resolutionHeight(): number {
        return this._resolutionHeight;
    }
    public static setResolutionHeight(value: number) {
        this._resolutionHeight = value;
    }

    /** 舞台根节点 */
    private static _stage: egret.Stage;
    public static get stage(): egret.Stage {
        return this._stage;
    }

    /** 当前舞台高度 */
    private static _stageHeight: number = 0;
    /** 当前舞台高度 */
    public static get stageHeight(): number {
        return this._stageHeight;
    }

    /** 当前舞台宽度 */
    private static _stageWidth: number = 0;
    /** 当前舞台宽度 */
    public static get stageWidth(): number {
        return this._stageWidth;
    }

    /** 初始化 */
    public static init(stage: egret.Stage): void {
        this._stage = stage;

        this._stage.addEventListener(egret.Event.RESIZE, this.onStageResize, this);
        notice.addNotice(NoticeID.mouseMove, this.onMouseMove, this);
        this.updateStageInfo();

    }

    /** 舞台自适应 */
    private static onStageResize(e: egret.Event): void {
        this.updateStageInfo();
        // if (SceneManager.instance.inited) {
        //     SceneManager.instance.onStageResize();
        // }
        // if (GuiManager.instance.inited) {
        //     GuiManager.instance.onStageResize();
        // }
        notice.dispatcherNotice(NoticeID.stageResize);
    }

    /** 更新舞台信息 */
    private static updateStageInfo(): void {
        fairygui.GRoot.inst.width = this._stageWidth = this._stage.stageWidth;
        fairygui.GRoot.inst.height = this._stageHeight = this._stage.stageHeight;
    }

    private static checkIsFullScreen(): boolean {
        let screenW = Math.max(screen.availWidth, screen.availHeight);
        let screenH = Math.min(screen.availWidth, screen.availHeight);
        let fullScreenSW = Math.round(screenW / screenH * this.resolutionWidth);
        if (fullScreenSW > this.stageWidth) {//通过设备计算出来，全屏状态下的舞台宽度比实际上的舞台宽度要大，证明现在不是全屏显示，不用进行刘海适配
            return false;
        }
        else if (this.stageWidth - fullScreenSW < 3) {//通过设备计算出来，全屏状态下的舞台宽度和实际上的舞台宽度相差无几（误差范围3，说明现在是全屏显示，如果有刘海需要进行刘海适配）
            return true;
        }
        return false;
    }

    private static onMouseMove(noticeName: string, mouseX: number, mouseY: number) {
        this._mouseX = mouseX;
        this._mouseY = mouseY;
    }
}