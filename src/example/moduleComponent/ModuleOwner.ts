/**
 * @author 雪糕 
 * @desc 
 * @date 2020-02-08 19:55:29 
 * @Last Modified by: 雪糕
 * @Last Modified time: 2020-02-08 20:10:43
 */
class ModuleOwner extends BehaviorOwner {
    private _timeCpt: TimeModCpt;
    /** 时间模块组建 */
    public get timeCpt(): TimeModCpt {
        return this._timeCpt;
    }

    protected onInit() {
        super.onInit();
        this._timeCpt = this.getAddComponent(TimeModCpt);
    }
}