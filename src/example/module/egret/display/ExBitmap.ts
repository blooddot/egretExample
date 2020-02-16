/**
 * @author 雪糕 
 * @desc 
 * @date 2020-02-16 23:18:45 
 * @Last Modified by: 雪糕
 * @Last Modified time: 2020-02-16 23:20:51
 */
class ExBitmap extends ExBase {
    protected core: egret.Bitmap;

    public constructor() {
        super();
        this.core = new egret.Bitmap();
    }

    public onInit(value?: egret.Texture) {
        this.core.$setTexture(value);
        if (value) {
            (<egret.sys.NormalBitmapNode>this.core.$renderNode).rotated = value.$rotated;
        }
    }

    public onUnInit() {

    }

    protected onShow() {
        this.core.$setTexture(RES.getRes("egret_icon_png"));
        ex.moduleOwner.stageCpt.stage.addChild(this.core);
        this.core.$updateRenderNode();
    }

    protected onHide() {

    }


}