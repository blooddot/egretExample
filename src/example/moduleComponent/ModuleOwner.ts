/**
 * @author 雪糕 
 * @desc 
 * @date 2020-02-08 19:55:29 
 * @Last Modified by: 雪糕
 * @Last Modified time: 2020-02-16 23:04:01
 */
class ModuleOwner extends BehaviorOwner {
    private _timeCpt: TimeModCpt;
    /** 时间模块组建 */
    public get timeCpt(): TimeModCpt {
        return this._timeCpt;
    }

    private _stageCpt: StageModCpt;
    /** 舞台模块组建 */
    public get stageCpt(): StageModCpt {
        return this._stageCpt;
    }

    private _exCpt: ExModCpt;
    /** 例子模块 */
    public get exCpt(): ExModCpt {
        return this._exCpt;
    }

    protected onInit(value: egret.Stage) {
        super.onInit();
        this._timeCpt = this.getAddComponent(TimeModCpt);
        this._stageCpt = this.getAddComponent(StageModCpt, value);
        this._exCpt = this.getAddComponent(ExModCpt);
    }
}