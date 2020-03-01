/**
 * @author 雪糕 
 * @desc gui遮挡类
 * @date 2018-06-04 14:45:08 
 * @Last Modified by: 雪糕
 * @Last Modified time: 2018-10-06 15:53:48
 */
abstract class GuiModal extends GuiGroup {
    protected _className: string;
    protected _imgModal: fairygui.GImage;

    public constructor(obj?: fairygui.GComponent) {
        super(obj);
    }

    public childrenCreated(): void {
        super.childrenCreated();
        if (this.displayObject) {
            this.displayObject.touchEnabled = true;
        }
    }

    public abstract get pkgName(): string;

    public abstract get resName(): string;

    public set className(value: string) {
        this.gcomponent._rootContainer.name = this._className = value;
    }

    public get className() {
        return this._className;
    }
}