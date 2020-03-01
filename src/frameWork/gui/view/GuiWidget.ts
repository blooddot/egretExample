/**
 * @author 雪糕 
 * @desc gui小挂件-类似组件,挂载在GuiComponent上面
 * @date 2019-07-02 14:53:31 
 * @Last Modified by: 雪糕
 * @Last Modified time: 2019-08-01 20:30:06
 */
class GuiWidget extends BehaviorPoolComponent {
    public get refOwner(): GuiOwner {
        return egret.superGetter(GuiWidget, this, "refOwner");
    }

    public get view(): GuiComponent {
        if (!this.refOwner) return null;

        return this.refOwner.view;
    }
}