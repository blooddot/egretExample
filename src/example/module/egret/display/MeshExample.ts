/**
 * @author 雪糕 
 * @desc 
 * @date 2020-02-08 16:22:33 
 * @Last Modified by: 雪糕
 * @Last Modified time: 2020-02-08 16:23:30
 */
class MeshExample extends BaseExample {
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
}