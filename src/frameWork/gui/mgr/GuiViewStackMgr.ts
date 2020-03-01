/**
 * @author 雪糕 
 * @desc GUI视图层
 * @date 2018-04-11 15:35:18 
 * @Last Modified by: 雪糕
 * @Last Modified time: 2020-02-28 00:14:00
 */
abstract class GuiViewStackMgr {
    protected _root: GuiSubLayer;

    /** 当前打开视图集合 */
    protected _viewStackMap: Dictionary<string, GuiViewStack>;
    /** 窗口开启参数集合 */
    protected _viewStackArgsMap: Dictionary<string, ViewStackArgsVO>;
    /** 缓存窗口 */
    protected _cacheViewStackMap: Dictionary<string, GuiViewStack>;

    protected _modal: GuiModal;

    protected constructor() {
        this._viewStackMap = new Dictionary<string, GuiViewStack>();
        this._viewStackArgsMap = new Dictionary<string, ViewStackArgsVO>();
        this._cacheViewStackMap = new Dictionary<string, GuiViewStack>();
    }

    /** 视图是否打开 */
    protected isViewStackShowing(cls: typeof GuiViewStack): boolean {
        return this._viewStackMap.containsKey(util.getQualifiedClassName(cls));
    }

    /**
     * 获取打开的视图
     * @param cls 
     */
    protected getShowingViewStack<T extends GuiViewStack>(cls: new () => T): T {
        return this._viewStackMap.getValue(util.getQualifiedClassName(cls)) as T;
    }

    /**
     * 打开视图
     * 
     * @param {string} pkgName 
     * @param {string} cls 
     * @param {*} [data=undefined] 
     * @param {(className: string) => void} [callBack=null] 
     * @memberof GuiViewStackManager
     */
    protected openViewStack(cls: typeof GuiViewStack, callBack?: (className: string) => void, ...args: any[]): GuiViewStack {
        let classDefine: any = cls;
        let className: string = util.getQualifiedClassName(cls);
        if (this.isViewStackShowing(cls)) {
            //判断如果打开了视图，那么就不再打开了
            logger.warn(LOG_TAG.gui, `${className} repeat open`);
            return null;
        }
        let viewStack: GuiViewStack = this._cacheViewStackMap.getValue(className);
        if (!viewStack) {
            viewStack = new classDefine();
            viewStack.gcomponent = fairygui.UIPackage.createObject(viewStack.pkgName, viewStack.resName).asCom;
            if (viewStack.needCache) {
                this._cacheViewStackMap.setValue(className, viewStack);
            }
        }
        this._viewStackArgsMap.setValue(className, new ViewStackArgsVO(className, callBack, ...args));

        return viewStack;
    }

    /**
     * 初始化视图
     * 
     * @protected
     * @param {GuiViewStack} viewStack 
     * @param {string} className 
     * @memberof GuiViewStackManager
     */
    protected initViewStack(viewStack: GuiViewStack, className: string): void {
        viewStack.className = className;
        viewStack.init();
        this.showViewStack(viewStack);
    }

    /** 显示视图 */
    protected showViewStack(viewStack: GuiViewStack): void {
        viewStack.addEventListener(GuiEvent.GUI_VIEW_STACK_SHOWED, this.onViewStackShowed, this);
        let argsVO = this._viewStackArgsMap.getValue(viewStack.className);
        if (argsVO && argsVO.args) {
            viewStack.show(...argsVO.args);
        } else {
            viewStack.show();
        }
    }

    /** 视图显示返回 */
    protected onViewStackShowed(evt: GuiEvent): void {
        let viewStack: GuiViewStack = evt.target;
        viewStack.removeEventListener(GuiEvent.GUI_VIEW_STACK_SHOWED, this.onViewStackShowed, this);

        let argsVO = this._viewStackArgsMap.getValue(viewStack.className);
        if (argsVO) {
            this._viewStackMap.setValue(viewStack.className, viewStack);
            if (argsVO.callBack) {
                argsVO.callBack(viewStack.className);
            }
        }

        notice.dispatcherNotice(NoticeID.viewShowed, viewStack);
    }

    /** 关闭视图 */
    protected closeViewStack(cls: typeof GuiViewStack, data?: any, dispose?: boolean): GuiViewStack {
        let className = util.getQualifiedClassName(cls);
        if (!this.isViewStackShowing(cls)) {
            //如果没打开，那么就不关闭
            logger.warn(LOG_TAG.gui, `${className} isn't open`);
            return null;
        }

        let viewStack: GuiViewStack = this._viewStackMap.getValue(className);
        this._viewStackMap.remove(className);
        this._viewStackArgsMap.remove(className);

        viewStack.addEventListener(GuiEvent.GUI_VIEW_STACK_HIDED, this.onViewStackHided, this);
        viewStack.hide(data);

        this.refreshModal();

        if (dispose) {
            if (this._cacheViewStackMap.containsKey(viewStack.className)) {
                this._cacheViewStackMap.remove(viewStack.className);
            }
            viewStack.dispose();
        }

        return viewStack;
    }

    protected onViewStackHided(evt: GuiEvent): void {
        let viewStack: GuiViewStack = evt.target;
        viewStack.removeEventListener(GuiEvent.GUI_VIEW_STACK_HIDED, this.onViewStackHided, this);

        if (!viewStack.needCache) {
            if (this._cacheViewStackMap.containsKey(viewStack.className)) {
                this._cacheViewStackMap.remove(viewStack.className);
            }
            viewStack.dispose();
        }
    }

    /** 关闭所有打开的视图 */
    protected closeAllViewStack(viewNoCloseArr?: typeof GuiViewStack[]): void {
        let viewStackNames: string[] = this._viewStackMap.keys.concat();
        let len: number = viewStackNames.length;
        for (let i: number = len; i > 0; i--) {
            let className: string = viewStackNames[i - 1];
            let cls = util.getClassDefinition(className);
            if (viewNoCloseArr == null || viewNoCloseArr.indexOf(cls) == -1) {
                this.closeViewStack(cls);
            }
        }
    }

    /** 关闭所有打开的视图 */
    protected cleanCacheViewStack(): void {
        let cacheViewStackNames: string[] = this._cacheViewStackMap.keys.concat();
        let len: number = cacheViewStackNames.length;
        for (let i: number = len; i > 0; i--) {
            let className: string = cacheViewStackNames[i - 1];
            if (this._cacheViewStackMap.containsKey(className)) {
                this._cacheViewStackMap.remove(className)
            }
        }
    }

    public refreshModal(): GuiViewStack {
        let viewStack: GuiViewStack = null;
        if (this._viewStackMap.size > 0) {
            for (let i = this._viewStackMap.size - 1; i >= 0; i--) {
                const element = this._viewStackMap.values[i];
                if (element && element.modalName) {
                    viewStack = element;
                    break;
                }
            }
        }
        display.removeFromParent(this._modal);

        if (!viewStack || !viewStack.modalName) {
            //不要modal 直接return
            return null;
        }

        let modalClass: any = viewStack.modalName;
        let className = util.getQualifiedClassName(modalClass);
        let needCreateClass = false;
        if (!this._modal) {
            //不存在，创建
            needCreateClass = true;
        } else {
            //两个不同的时候，才销毁重新创建
            if (this._modal.className && className && this._modal.className != className) {
                this._modal.dispose();
                this._modal = null;
                needCreateClass = true;
            }
        }

        if (needCreateClass) {
            this._modal = new modalClass();
            this._modal.gcomponent = fairygui.UIPackage.createObject(this._modal.pkgName, this._modal.resName).asCom;
            this._modal.className = className;
        }

        return viewStack;
    }

    /** 舞台自适应 */
    public onStageResize(): void {
        this._root.onStageResize();

        this._viewStackMap.forEach((value: GuiViewStack) => {
            value.onStageResize();
        });

        if (this._modal) {
            this._modal.onStageResize();
        }
    }
}