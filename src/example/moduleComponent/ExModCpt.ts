/**
 * @author 雪糕 
 * @desc 例子模块组建
 * @date 2020-02-16 17:22:35 
 * @Last Modified by: 雪糕
 * @Last Modified time: 2020-02-16 21:50:02
 */
class ExModCpt extends BehaviorComponent {
    private _example: ExBase;
    private _exampleMap: Dictionary<string, ExBase>;
    protected onAdd() {
        this._exampleMap = new Dictionary<string, ExBase>();
    }

    public getAddExample<T extends ExBase>(c: new () => T, ...args: any[]): T {
        let example = this.getExample(c);
        if (!example) {
            example = pool.pop(c, ...args);
            let className = egret.getQualifiedClassName(c);
            this._exampleMap.setValue(className, example);
        }
        return example as T;
    }

    public getExample<T extends ExBase>(c: new () => T): T {
        let className = egret.getQualifiedClassName(c);
        let example: ExBase = this._exampleMap.getValue(className);
        if (example) {
            return example as T;
        }

        return null;
    }

    public removeExample<T extends ExBase>(c: new () => T) {
        let className = egret.getQualifiedClassName(c);
        if (this._example && this._example.className === className) {
            this._example = null;
        }

        let example: ExBase = this._exampleMap.getValue(className);
        if (example) {
            example.$hide();
            this._exampleMap.remove(className);
        }
    }

    public showExample<T extends ExBase>(c: new () => T, ...args: any[]) {
        let example = this.getAddExample(c);
        if (this._example) {
            this._example.$hide();
        }
        example.$show(...args);
        this._example = example;
    }

    public hideExample<T extends ExBase>(c: new () => T) {
        let className = egret.getQualifiedClassName(c);
        if (this._example && this._example.className === className) {
            this._example.$hide();
            this._example = null;
            return;
        }

        let example = this.getExample(c);
        if (example) {
            example.$hide();
        }
    }
}