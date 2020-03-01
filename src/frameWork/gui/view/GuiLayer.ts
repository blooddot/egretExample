/**
 * @author 雪糕 
 * @desc GUI层级基类
 * @date 2018-04-11 14:15:19 
 * @Last Modified by: 雪糕
 * @Last Modified time: 2018-10-08 13:47:15
 */
class GuiLayer extends GuiGroup {
    public constructor() {
        super(new fairygui.GComponent());
        this.displayObject.touchEnabled = false;
    }

    public onStageResize(): void { }
}
