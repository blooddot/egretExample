/**
 * @author 雪糕 
 * @desc 舞台模块组建
 * @date 2020-02-16 21:51:52 
 * @Last Modified by: 雪糕
 * @Last Modified time: 2020-02-16 22:00:34
 */
class StageModCpt extends BehaviorComponent {
    private _stage: egret.Stage;
    public get stage(): egret.Stage {
        return this._stage;
    }
    public setStage(value: egret.Stage) {
        this._stage = value;
    }

    protected onAdd(value: egret.Stage) {
        super.onAdd();
        this.setStage(value);
    }
}