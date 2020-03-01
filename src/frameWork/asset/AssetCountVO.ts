/**
 * @author 雪糕 
 * @desc 计数信息
 * @date 2020-02-27 23:06:35 
 * @Last Modified by: 雪糕
 * @Last Modified time: 2020-02-27 23:10:36
 */
namespace asset {
    export class AssetCountVO {
        /** 资源名称 */
        public key: string;
        /** 计数 */
        public count: number;
        /** 是否要销毁 */
        public retain: boolean;

        public constructor(key: string, retain: boolean) {
            this.key = key;
            this.retain = retain;
            this.count = 0;
        }
    }
}