declare var globalManifestJson: any;

namespace lanbo {
    export namespace net {
        export let useWorker: boolean = true;
        export let worker: Worker = null;//支持worker的时候会使用worker
        export let webSocketWorker: WebSocketWorker;//在没有worker模式时的处理实例

        export function init() {
            lanbo.logger.log(LOG_TAG.lanbo, `初始化net模块`);

            if (typeof (Worker) !== "undefined" && useWorker) {
                initWSWorker();
            } else {
                webSocketWorker = new WebSocketWorker(false);
                lanbo.logger.info(LOG_TAG.NetWork, `WebSocketMgr->不使用worker模式`);
                // _wsWorkerInstance.onGotOneProcessedNetBundle = onGotProcessedNetBundle.bind(this);
                // _wsWorkerInstance.onGotUnProcessedArrayBuff = onGotUnProcessedArrayBuff.bind(this);
            }
        }

        async function initWSWorker() {
            if (worker) {
                lanbo.logger.error(LOG_TAG.NetWork, `WebSocketMgr-> 重复worker`);
                return;
            }

            lanbo.logger.info(LOG_TAG.NetWork, `WebSocketMgr->start init ws worker`);

            let workerPath = WebSocketWorker.getLibFileRelativePath(globalManifestJson, WebSocketWorker.THIS_FILE_NAME);
            worker = new Worker(workerPath);
            worker.onmessage = onWSWorkerMsg.bind(this);

            //加载proto文件
            // let proFile = await RES.getResAsync("pbmessage_proto")
            // lanbo.Logger.info(LOG_TAG.NetWork, `WebSocketMgr->postmsg loadedProto`);
            // this.postMessageToWorker("loadedProto", [globalManifestJson, proFile]);
        }

        /** 发消息给worker 只有启用worker时才会调用 */
        export function postMessageToWorker(key: string, data: any = null, needTransfer: boolean = false) {
            if (!worker) {
                lanbo.logger.error(LOG_TAG.NetWork, `postMessageToWorker() wsWorker is null`);
                return;
            }

            if (needTransfer && data) {
                worker.postMessage([key, data], [data]);
            }
            else {
                worker.postMessage([key, data]);
            }
        }

        function onWSWorkerMsg(msgEvt: MessageEvent) {
            let msgData: any = msgEvt.data;
            let key: string = msgData[0];
            switch (key) {
                case "gotProcessedNetBundle":
                    // let envelope: Bian.Envelope = <Bian.Envelope>msgData[1];
                    // let newEnvelope = Bian.Envelope.fromObject(envelope);//worker数据传递时 基类信息已经丢失 需要重新找回
                    // this.onGotProcessedNetBundle(newEnvelope);
                    break;
                case "gotUnProcessedArrayBuff":
                    // let buff: ArrayBuffer = <ArrayBuffer>msgData[1];//数据量太小 worker没有直接decode 这边来
                    // this.onGotUnProcessedArrayBuff(buff);
                    break;
                case "log":
                    let logInfo: any = msgData[1];
                    let logType = logInfo[0];
                    if (logType == "log") {
                        lanbo.logger.log(LOG_TAG.NetWork, logInfo[1]);
                    }
                    else if (logType == "error") {
                        lanbo.logger.error(LOG_TAG.NetWork, logInfo[1]);
                    }
                    else {
                        lanbo.logger.error(LOG_TAG.NetWork, "找不到worker logtype");
                    }
                    break;
                default:
                    lanbo.logger.error(LOG_TAG.NetWork, `onWSWorkerMsg() undefine key=${key}`);
                    break;
            }
        }
    }
}