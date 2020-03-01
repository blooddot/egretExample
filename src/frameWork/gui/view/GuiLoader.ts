/**
 * @author 雪糕 
 * @desc GUI加载器
 * @date 2018-04-11 20:21:42 
 * @Last Modified by: 雪糕
 * @Last Modified time: 2018-04-12 18:21:03
 */

class GuiLoader extends GuiObject {
    private _gloader: fairygui.GLoader;

    /**
     * Getter gloader
     * @return {fairygui.GLoader}
     */
    public get gloader(): fairygui.GLoader {
        return this._gloader;
    }

    public constructor(obj?: fairygui.GLoader) {
        super(obj);
        if (obj) {
            this._gloader = obj;
        }
    }
}