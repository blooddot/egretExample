/**
 * @author 雪糕 
 * @desc GUI 提示文字
 * @date 2018-04-13 18:06:37 
 * @Last Modified by: 雪糕
 * @Last Modified time: 2020-02-27 21:06:43
 */
abstract class GuiToast extends GuiComponent {

    public toastName: string;
    private _toastType: gui.eToastType;

    public abstract get pkgName(): string;

    public abstract get resName(): string;

    public show(data: any, toastType: gui.eToastType, factor: number) {
        this.doShowAnimation(toastType, factor);
    }

    protected doShowAnimation(toastType: gui.eToastType, factor: number) {
        this._toastType = toastType;
        let root = GuiToastMgr.instance.root;
        let x: number, y: number
        let tw = egret.Tween.get(this.gobject);
        let list = GuiToastMgr.instance.seqToastMap.getValue(toastType);
        switch (toastType) {
            case gui.eToastType.bottom:
                break;
            case gui.eToastType.top:
                break;
            case gui.eToastType.center:
                break;
            case gui.eToastType.left:
                break;
            case gui.eToastType.taskCompleted:
                this.gobject.width = root.width;
                this.gobject.setXY(0, root.height);
                this.gobject.alpha = 0;
                tw.to({ y: Math.round(root.height * 0.28), alpha: 1 }, 500, egret.Ease.sineOut)
                    .wait(1000 * factor)
                    .to({ alpha: 0 }, 500)
                    .call(this.onShowAnimCompleted, this);
                break;
            default:
                x = (root.width - this.gobject.width) / 2;
                y = Math.round((root.height - this.gobject.height) * 0.35)
                this.gobject.setXY(x, y);
                tw.to({ y: Math.round((root.height - this.gobject.height) * 0.2) }, 400)
                    .wait(1000 * factor)
                    .to({ alpha: 0 }, 400)
                    .call(this.onShowAnimCompleted, this);
        }
    }

    protected onShowAnimCompleted() {
        egret.Tween.removeTweens(this);
        this.removeFromParent();
        this.dispose();
    }

    public hideEarly() {//前一个toast还没消失，后一个toast又出现时，可以调用这个方法让前一个toast提前消失
        if (this.gobject.alpha > 0) {
            egret.Tween.get(this.gobject).to({ alpha: 0 }, 400).call(this.onShowAnimCompleted, this);
        }
    }

    private onStartHide() {
        GuiToastMgr.instance.seqToastMap.getValue(this._toastType).shift();
    }
}