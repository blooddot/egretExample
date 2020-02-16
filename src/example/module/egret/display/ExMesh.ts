/**
 * @author 雪糕 
 * @desc 
 * @date 2020-02-08 16:22:33 
 * @Last Modified by: ??
 * @Last Modified time: 2020-02-16 23:19:52
 */
class ExMesh extends ExBase {
    protected core: egret.Mesh;

    public constructor() {
        super();
        this.core = new egret.Mesh();
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