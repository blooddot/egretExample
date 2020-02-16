/**websocket的单独打解包线程 不支持线程时为处理实例*/
declare class WebSocketWorker {
    static readonly THIS_FILE_NAME;//本文件名
    /**得到处理过decode完的网络包 只有在非多线程时使用 */
    // onGotOneProcessedNetBundle: (envelope: Bian.Envelope) => {};
    onGotOneProcessedNetBundle: (envelope: any) => {};
    /**得到未处理的完整包数据流  只有在非多线程时使用 */
    onGotUnProcessedArrayBuff: (buff: ArrayBuffer) => {};
    /**
     * 
     * @param enableWorkerMode 启用woker线程模式 否则就是兼容的直接使用模式 直接使用一般false
     */
    constructor(enableWorkerMode: boolean);
    /**
     * 在manifest.json中找到关键字对应的相对路径
     * @param manifestJson manifest.json解析成json格式后实例 不要再去加载
     * @param keyword 文件目录中的关键字
     */
    static getLibFileRelativePath(manifestJson: any, keyword: string): string;
    /**
     * 清理
     */
    clear();
    /**
     * 兼容没有worker情况 外部直接使用
     * @param rawData 原始数据 没有拆包合包
     */
    onRawSocketData(rawData: ArrayBuffer);

    //#region 日志相关 暂时放在这里

    /**
     * 初始化logger 
     * @param table 文件名 表名
     */
    initLoggerDB(table: string);
    /**
     * 写入log 
     * @param data :LogData
     */
    writeLog(data: any);

    //#endregion
}