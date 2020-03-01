/**
 * @author 雪糕 
 * @desc Gui的宿主
 * @date 2019-07-03 21:02:05 
 * @Last Modified by: 雪糕
 * @Last Modified time: 2019-07-03 21:52:35
 */
class GuiOwner extends BehaviorOwner {
    protected _view: GuiComponent;
    constructor(view: GuiComponent) {
        super();
        this._view = view;
    }

    public get view(): GuiComponent {
        return this._view;
    }
}