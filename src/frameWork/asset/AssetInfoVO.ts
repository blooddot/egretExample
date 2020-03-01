/**
 * @author 雪糕 
 * @desc 资源信息,加载的时候使用
 * @date 2020-02-27 23:07:45 
 * @Last Modified by: 雪糕
 * @Last Modified time: 2020-02-27 23:10:20
 */
namespace asset {
    export class AssetInfoVO {
        /** 资源加载优先级 */
        public priority: ePriority;
        /** 资源类型 */
        public type: eAssetType;
        /** 资源名称 */
        public name: string;
        /** 加载成功后回调 */
        public resolve: (value?: any) => void;
        /** 加载失败后回调 */
        public reject: () => void;
        /** 重试次数 */
        public retryTimes: number = 0;
        /** 资源组加载优先级 只有加载资源组的时候可能会用到 */
        public groupPriority?: number;
        /** 资源组的加载进度提示 只有加载资源组的时候可能会用到 */
        public reporter?: RES.PromiseTaskReporter;

        public constructor(priority: ePriority, type: eAssetType, name: string, resolve: (value?: any) => void, reject: () => void, groupPriority?: number, reporter?: RES.PromiseTaskReporter) {
            this.priority = priority;
            this.type = type;
            this.name = name;
            this.resolve = resolve;
            this.reject = reject;
            this.groupPriority = groupPriority;
            this.reporter = reporter;
        }
    }
}