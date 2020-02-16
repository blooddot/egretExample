/**
 * @author 雪糕 
 * @desc 
 * @date 2020-02-16 22:57:42 
 * @Last Modified by: 雪糕
 * @Last Modified time: 2020-02-16 23:17:29
 */
namespace ex {
    export let moduleOwner: ModuleOwner;
    function getInstance(): ModuleOwner {
        if (!moduleOwner) {
            moduleOwner = new ModuleOwner();
        }
        return moduleOwner;
    }

    export function init(stage: egret.Stage) {
        getInstance().init(stage);
        exCpt = moduleOwner.exCpt;
        showExample = exCpt.showExample.bind(exCpt);
        hideExample = exCpt.hideExample.bind(exCpt);
    }

    /** 公开exampleCpt一些常用的方法 */
    let exCpt: ExModCpt;
    export let showExample: <T extends ExBase>(c: new () => T, ...args: any[]) => void;
    export let hideExample: <T extends ExBase>(c: new () => T) => void;
}