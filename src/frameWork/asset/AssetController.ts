/**
 * @author 雪糕 
 * @desc 资源控制器 控制资源加载和计数
 * @date 2020-02-27 23:05:43 
 * @Last Modified by: 雪糕
 * @Last Modified time: 2020-02-27 23:10:36
 */
namespace asset {
    export class AssetController extends egret.EventDispatcher {
        /** 资源加载对象队列集合 */
        private _assetQueueMap: Dictionary<ePriority, LinkedList<AssetInfoVO>>;
        /** 资源加载对象key集合 用来判断队列中是否有对象 */
        private _assetKeysMap: Dictionary<string, AssetInfoVO[]>;

        /** 资源计数对象集合 */
        private _assetCountMap: Dictionary<string, AssetCountVO>;

        /** 最大加载线程数 */
        private _maxLoadingThread: number = 4;
        /** 最大重试次数 */
        private _maxRetryTimes: number = 2;
        /** 引用计数起自动销毁资源时间 秒 */
        private _countDestroyTime: number = 60 * 3;

        /** 当前加载进程数 */
        private _loadingThread: number = 0;

        /** 计数计时器 */
        private _countTimer: egret.Timer;
        public constructor() {
            super();
            this._assetQueueMap = new Dictionary<ePriority, LinkedList<AssetInfoVO>>();
            this._assetQueueMap.setValue(ePriority.low, new LinkedList<AssetInfoVO>());
            this._assetQueueMap.setValue(ePriority.middle, new LinkedList<AssetInfoVO>());
            this._assetQueueMap.setValue(ePriority.high, new LinkedList<AssetInfoVO>());

            this._assetKeysMap = new Dictionary<string, AssetInfoVO[]>();
            this._assetCountMap = new Dictionary<string, AssetCountVO>();

            this._countTimer = new egret.Timer(this._countDestroyTime * 1000);
            this._countTimer.addEventListener(egret.TimerEvent.TIMER, this.onCountTimerComplete, this);
            this._countTimer.start();
        }

        private onCountTimerComplete(evt: egret.TimerEvent): void {
            this.dispatchEventWith(COUNT_TIMER);
            this.countDestroyAsset();
        }

        /**
         * 设置最大并发加载线程数量，默认值是 4。
         * @param thread 
         */
        public setMaxLoadingThread(thread: number): void {
            this._maxLoadingThread = thread;
        }

        /**
         * 加载资源组
         * @param name 资源组名称
         * @param priority 资源加载优先级
         * @param groupPriority 资源组加载优先级-白鹭系统调用
         * @param reporter 资源组的加载进度提示
         */
        public loadGroup(name: string, priority: ePriority = ePriority.middle, groupPriority?: number, reporter?: RES.PromiseTaskReporter): Promise<void> {
            return new Promise(async (resolve, reject) => {
                await this.checkAddToQueue(new AssetInfoVO(priority, eAssetType.group, name, resolve, reject, groupPriority, reporter));
            });
        }

        /**
         * 加载资源
         * @param key 资源key
         * @param priority 资源加载优先级
         * @param retain 是否保留
         * @param type 文件类型(可选,只有在url加载方式下生效)。请使用 ResourceItem 类中定义的静态常量。若不设置将根据文件扩展名生成。
         */
        public async loadAsset(key: string, priority: ePriority = ePriority.middle, retain: boolean = false, type?: string): Promise<any> {
            return new Promise(async (resolve, reject) => {
                //判断是否有计数器 没有则创建
                if (!this._assetCountMap.containsKey(key)) {
                    let countInfo = new AssetCountVO(key, retain);
                    this._assetCountMap.setValue(key, countInfo);
                }

                if (RES.hasRes(key)) {
                    let resource: any = RES.getRes(key);
                    if (resource) {
                        resolve(resource);
                    } else {
                        await this.checkAddToQueue(new AssetInfoVO(priority, eAssetType.single, key, resolve, reject));
                    }
                } else {
                    (RES.getResByUrl(key, null, null, type) as Promise<any>)
                        .then(async (value) => {
                            resolve(value);
                        })
                        .catch(async (e) => {
                            logger.error(LOG_TAG.asset, `加载资源出错:${e.error}`, `加载资源出错`);
                            resolve(null);
                        });

                }
            });
        }

        /**
         * 检查是否有对象并加到队列中
         * @param assetInfo 
         */
        private async checkAddToQueue(assetInfo: AssetInfoVO) {
            let assetInfos = this._assetKeysMap.getValue(assetInfo.name);
            //没有对象才加到队列里去加载
            if (!assetInfos) {
                assetInfos = [];
                this._assetKeysMap.setValue(assetInfo.name, assetInfos);

                let assetQueue = this._assetQueueMap.getValue(assetInfo.priority);
                assetQueue.add(assetInfo);
            }
            assetInfos.push(assetInfo);

            await this.checkLoadAsset();
        }

        /**
         * 获取已加载的资源
         * @param key 资源key
         * @param retain 资源是否保留
         */
        public getAsset(key: string, retain: boolean = false): any {
            let resource = RES.getRes(key);

            if (!resource) {
                logger.error(LOG_TAG.asset, `资源未加载${key}`)
                return null;
            }

            this.addAssetCount(key, retain);
            return resource;
        }

        /**
         * 判断资源是否已加载
         * @param key 资源key
         */
        public isAssetLoaded(key: string): boolean {
            return RES.getRes(key) && true;
        }

        /**
         * 异步获取资源 如果有未加载的,先加载在返回
         * @param key 资源key | 资源的url
         * @param priority 资源加载优先级 
         * @param retain 资源是否保留
         * @param type 文件类型(可选,只有在url加载方式下生效)。请使用 ResourceItem 类中定义的静态常量。若不设置将根据文件扩展名生成。
         */
        public async getAssetAsync(key: string, priority: ePriority = ePriority.middle, retain: boolean = false, compFunc?: (value) => void, thisObject?: any, type?: string): Promise<any> {
            let resource: any = RES.getRes(key);
            if (!resource) {
                resource = await this.loadAsset(key, priority, retain, type);
            }
            this.addAssetCount(key, retain);

            if (compFunc) {
                compFunc.call(thisObject, resource, key);
            }

            if (!resource) {
                logger.error(LOG_TAG.asset, `资源${key}不存在`);
            }
            return resource;
        }

        /**
         * 资源计数增加
         * @param key 资源key
         * @param retain 资源是否保留
         */
        public addAssetCount(key: string, retain: boolean = false): void {
            let countInfo = this._assetCountMap.getValue(key);
            if (!countInfo) {
                countInfo = new AssetCountVO(key, retain);
                this._assetCountMap.setValue(key, countInfo);
            }
            //如果要保留,赋值
            if (retain) {
                countInfo.retain = retain;
            }
            countInfo.count++;
        }

        /**
         * 卸载资源
         * @param key 资源key
         * @param needDispose 卸载后如果引用计数为0; true: 直接销毁资源; false: 等待自动销毁资源
         */
        public unloadAsset(key: string, needDispose: boolean = false): void {
            let countInfo = this._assetCountMap.getValue(key);
            if (!countInfo) {
                logger.error(LOG_TAG.asset, `卸载了不存在列表中的资源 ${key}`);
                return;
            }
            countInfo.count--;

            if (countInfo.count == 0 && !countInfo.retain && needDispose) {
                this.destroyAsset(key);
                this._assetCountMap.remove(key);
            }
        }

        /**
         * 销毁资源
         * @param key 资源key
         */
        private destroyAsset(key: string): void {
            if (RES["config"].getResource(key)) {
                RES.destroyRes(key);
                //!暂时注释
                // Logger.log(LOG_TAG.Res, `销毁资源:${key}`);
            }
        }

        /**
         * 删除已加载的资源组资源
         * @param group 组名称
         */
        public destroyGroupAsset(group: string): void {
            if (RES.isGroupLoaded(group)) {
                RES.destroyRes(group);
            }
        }

        /**
         * 根据计数销毁资源
         */
        private countDestroyAsset(): void {
            this._assetCountMap.forEach(value => {
                if (value.count == 0) {
                    this.destroyAsset(value.key);
                    this._assetCountMap.remove(value.key);
                }
            });
        }

        /**
         * 检查并加载资源
         */
        private async checkLoadAsset() {
            if (this._loadingThread >= this._maxLoadingThread) {
                return;
            }
            let priorities = [ePriority.high, ePriority.middle, ePriority.low];
            for (const iterator of priorities) {
                let assetQueue = this._assetQueueMap.getValue(iterator);
                if (assetQueue.length > 0) {
                    this._loadingThread++;

                    let assetInfo = assetQueue.head.value;
                    assetQueue.remove(assetQueue.head);
                    switch (assetInfo.type) {
                        case eAssetType.group:
                            (RES.loadGroup(assetInfo.name, assetInfo.groupPriority, assetInfo.reporter) as Promise<void>)
                                .then(async () => {
                                    await this.loadAssetSuccess(assetInfo);
                                })
                                .catch(async () => {
                                    await this.loadAssetFailed(assetInfo);
                                });
                            break;
                        case eAssetType.single:
                            // RES.getResAsync(assetInfo.name, async (value?: any, key?: string) => {
                            //     if (value) {
                            //         await this.loadAssetSuccess(assetInfo, value);
                            //     } else {
                            //         await this.loadAssetFailed(assetInfo);
                            //     }
                            // }, this)

                            (RES.getResAsync(assetInfo.name) as Promise<any>)
                                .then(async (value) => {
                                    if (value) {
                                        await this.loadAssetSuccess(assetInfo, value);
                                    } else {
                                        await this.loadAssetFailed(assetInfo);
                                    }
                                })
                                .catch(async (e) => {
                                    logger.error(LOG_TAG.asset, `加载资源出错:${e.error}`, `加载资源出错`);
                                    this._loadingThread--;
                                    await this.loadAssetFailed(assetInfo);
                                });
                            break;
                        default:
                            break;
                    }

                    if (this._loadingThread >= this._maxLoadingThread) {
                        return;
                    }
                }
            }
        }

        /**
         * 加载资源成功
         * @param assetInfo
         * @param value 加载成功后的资源 只有单个资源时候才会有值
         */
        private async loadAssetSuccess(assetInfo: AssetInfoVO, value?: any) {
            switch (assetInfo.type) {
                case eAssetType.group:
                    //!暂时注释
                    // Logger.log(LOG_TAG.Res, `加载资源组成功:${assetInfo.name}`);
                    break;
                default:
                    //!暂时注释
                    // Logger.log(LOG_TAG.Res, `加载资源成功:${assetInfo.name}`);
                    break;
            }

            let assetKeys = this._assetKeysMap.getValue(assetInfo.name);
            if (assetKeys) {
                for (const iterator of assetKeys) {
                    iterator.resolve(value);
                }
                this._assetKeysMap.remove(assetInfo.name);
            } else {
                logger.error(LOG_TAG.asset, `移除资源配置${assetInfo.name}出错`, `移除资源配置出错`);
            }

            this._loadingThread--;
            await this.checkLoadAsset();
        }

        /**
         * 加载资源失败
         * @param assetInfo
         */
        private async loadAssetFailed(assetInfo: AssetInfoVO) {
            let retryTip: string = "";
            if (assetInfo.retryTimes < this._maxRetryTimes) {
                assetInfo.retryTimes++;
                //失败的话,重新放回队列头部
                let assetQueue = this._assetQueueMap.getValue(assetInfo.priority);
                if (assetQueue.head) {
                    assetQueue.insert(assetQueue.head, assetInfo);
                } else {
                    assetQueue.add(assetInfo);
                }
                retryTip = `,开始重试,重试次数:${assetInfo.retryTimes}`;
            } else {
                let assetKeys = this._assetKeysMap.getValue(assetInfo.name);
                if (assetKeys) {
                    for (const iterator of assetKeys) {
                        iterator.reject();
                    }
                    this._assetKeysMap.remove(assetInfo.name);
                } else {
                    logger.error(LOG_TAG.asset, `移除资源配置${assetInfo.name}出错`, `移除资源配置出错`);
                }
            }

            switch (assetInfo.type) {
                case eAssetType.group:
                    logger.warn(LOG_TAG.asset, `加载资源组失败:${assetInfo.name}${retryTip}`, `加载资源组失败`);
                    break;
                default:
                    logger.warn(LOG_TAG.asset, `加载资源失败:${assetInfo.name}${retryTip}`, `加载资源失败`);
                    break;
            }

            this._loadingThread--;

            await this.checkLoadAsset();
        }
    }
}