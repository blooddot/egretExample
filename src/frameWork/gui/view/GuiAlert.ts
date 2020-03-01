/**
 * @author 雪糕 
 * @desc GUI 提示框
 * @date 2018-04-13 19:22:00 
 * @Last Modified by: 雪糕
 * @Last Modified time: 2020-02-27 21:06:25
 */
abstract class GuiAlert extends GuiViewStack {
    protected _btnCancel: fairygui.GObject;
    protected _btnConfirm: fairygui.GObject;
    protected _tfContent: fairygui.GTextField;
    protected _tfTitle: fairygui.GTextField;

    protected _content: any;
    protected _title: string;
    public cancelFunc: Function;
    public confirmFunc: Function;
    public closeFunc: Function;

    /**
     * Getter data
     * @return {string}
     */
    public get content(): any {
        return this._content;
    }

    /**
     * Setter data
     * @param {any} value
     */
    public set content(value: any) {
        this._content = value;

        if ((typeof (this._content) == "string") && this._tfContent) {
            this._tfContent.text = this._content;
        }
    }

    public get title(): string {
        return this._title;
    }

    public set title(value: string) {
        this._title = value;

        if (!this._tfTitle) {
            return;
        }

        if (this._title) {
            this._tfTitle.text = this._title;
        } else {
            // this._tfTitle.text = LanguageTable.instance.getValueByKey("#10000001");//确认
        }
    }

    protected onHide(): void {
        super.onHide();
        if (this.closeFunc) {
            this.closeFunc();
            this.closeFunc = null;
        }
    }

    public get btnCancel(): fairygui.GObject {
        return this._btnCancel;
    }

    public set btnCancel(value: fairygui.GObject) {
        if (this._btnCancel) {
            this._btnCancel.removeClickListener(this.onCancelClick, this);
        }
        this._btnCancel = value;
        if (this._btnCancel) {
            this._btnCancel.addClickListener(this.onCancelClick, this);
        }
    }

    public get tfContent(): fairygui.GTextField {
        return this._tfContent;
    }

    public set tfContent(value: fairygui.GTextField) {
        this._tfContent = value;
        if (this.content) {
            this._tfContent.text = this.content;
        }
    }

    public get tfTitle(): fairygui.GTextField {
        return this._tfTitle;
    }

    public set tfTitle(value: fairygui.GTextField) {
        this._tfTitle = value;
        if (this.title) {
            this._tfTitle.text = this.title;
        }
    }

    protected onCancelClick(evt: egret.Event): void {
        if (this.cancelFunc) {
            this.cancelFunc();
            this.cancelFunc = null;
        }
        this.close();
    }

    public get btnConfirm(): fairygui.GObject {
        return this._btnConfirm;
    }

    public set btnConfirm(value: fairygui.GObject) {
        if (this._btnConfirm) {
            this._btnConfirm.removeClickListener(this.onConfirmClick, this);
        }
        this._btnConfirm = value;
        if (this._btnConfirm) {
            this._btnConfirm.addClickListener(this.onConfirmClick, this);
        }
    }

    protected onConfirmClick(evt: egret.Event): void {
        if (this.confirmFunc) {
            this.confirmFunc();
            this.confirmFunc = null;
        }
        this.close();
    }

    public close(): void {
        GuiAlertMgr.instance.closeAlert(util.getClassDefinition(this.className));
    }

    protected onDispose(): void {
        let self = this;
        if (self.isDisposed) {
            return;
        }

        if (this._btnConfirm) {
            this._btnConfirm.removeClickListener(this.onConfirmClick, this);
        }
        if (this._btnCancel) {
            this._btnCancel.removeClickListener(this.onCancelClick, this);
        }
        super.onDispose();
    }
}