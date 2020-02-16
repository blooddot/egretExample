var WebSocketWorker = (function () {
    function WebSocketWorker(enableWorkerMode) {
        this._isLoadedProto = false;
        this._loggerIsReady = false;
        this._enableWorkerMode = enableWorkerMode;
        this.clear();
    }
    WebSocketWorker.getLibFileRelativePath = function (manifestJson, keyword) {
        if (!manifestJson || !keyword || keyword == "") {
            console.error("WebSocketWorker->getLibFileRelativePath() error manifestJson=" + manifestJson + " keyword=" + keyword);
            return "";
        }
        var list = manifestJson["initial"].concat(manifestJson["game"]);
        for (var _i = 0, list_1 = list; _i < list_1.length; _i++) {
            var path = list_1[_i];
            var index = path.lastIndexOf("/");
            if (index >= 0) {
                var file = path.substring(index);
                if (file.includes(keyword)) {
                    return path;
                }
            }
        }
        return "";
    };
    WebSocketWorker.prototype.clear = function () {
        this._curMsgLength = 0;
        this._cacheDataBuff = [];
        this._cacheDataBuffLength = 0;
    };
    WebSocketWorker.prototype.onMessageFromMain = function (data) {
        var key = data[0];
        switch (key) {
            case "loadedProto":
                {
                    if (this._isLoadedProto) {
                        console.error("protobuf is loaded");
                        return;
                    }
                    this._isLoadedProto = true;
                    this.logToMain("start load protobuf lib");
                    var manifestJson = data[1][0];
                    var thisPath = WebSocketWorker.getLibFileRelativePath(manifestJson, WebSocketWorker.THIS_FILE_NAME);
                    var pathSplit = thisPath.split("/");
                    var dirNum = pathSplit.length - 1;
                    var rootPath = "";
                    for (var i = 0; i < dirNum; i++) {
                        rootPath += "../";
                    }
                    var protobufFilePath = WebSocketWorker.getLibFileRelativePath(manifestJson, "protobuf");
                    protobufFilePath = rootPath + protobufFilePath;
                    importScripts(protobufFilePath);
                    var protoText = data[1][1];
                    var protoRoot = new protobuf.Root();
                    var parsed = protobuf.parse(protoText, protoRoot);
                    var pkg = "Bian";
                    self[pkg] = protoRoot[pkg];
                    this.logToMain("protobuf " + pkg + " inited");
                }
                break;
            case "gotScoketData":
                {
                    var buffer = data[1];
                    this.onRawSocketData(buffer);
                }
                break;
            case "clear":
                this.clear();
                break;
            default:
                if (!this.checkOtherMsg(key, data[1])) {
                    this.logToMain("msg key not define =" + key, true);
                }
                break;
        }
    };
    WebSocketWorker.prototype.postMessageToMain = function (key, data, needTransfer) {
        if (data === void 0) { data = null; }
        if (needTransfer === void 0) { needTransfer = false; }
        if (needTransfer && data) {
            postMessage([key, data], [data]);
        }
        else {
            postMessage([key, data]);
        }
    };
    WebSocketWorker.prototype.onRawSocketData = function (rawData) {
        if (WebSocketWorker.useMsgHeadModel) {
            this.cacheDataBuffPush(rawData);
            this.tryDecodeDataBuff();
        }
        else {
            this.processCompleteBuff(rawData);
        }
    };
    WebSocketWorker.prototype.tryDecodeDataBuff = function () {
        if (this._cacheDataBuffLength <= 0) {
            return;
        }
        if (this._curMsgLength <= 0) {
            if (this._cacheDataBuffLength < WebSocketWorker.DATA_HEAD_BYTE_LENGTH) {
                return;
            }
            var overLengthBuff = this.cacheDataBuffShift(WebSocketWorker.DATA_HEAD_BYTE_LENGTH);
            var overLengthDataView = new DataView(overLengthBuff);
            this._curMsgLength = overLengthDataView.getInt32(0);
        }
        if (this._curMsgLength <= 0) {
            this.logToMain("包头解析异常", true);
            return;
        }
        if (this._cacheDataBuffLength < this._curMsgLength) {
            return;
        }
        var completeBuff = this.cacheDataBuffShift(this._curMsgLength);
        this._curMsgLength = 0;
        this.processCompleteBuff(completeBuff);
        if (this._cacheDataBuffLength > 0) {
            this.tryDecodeDataBuff();
        }
    };
    WebSocketWorker.prototype.processCompleteBuff = function (completeBuff) {
        if (completeBuff.byteLength > WebSocketWorker.WORKER_DECODE_BYTE_LENGTH) {
            var uint8 = new Uint8Array(completeBuff);
            var env = Bian.Envelope.decode(uint8);
            this.gotOneProcessedNetBundle(env);
        }
        else {
            if (this._enableWorkerMode) {
                this.postMessageToMain("gotUnProcessedArrayBuff", completeBuff, true);
            }
            else {
                this.onGotUnProcessedArrayBuff(completeBuff);
            }
        }
    };
    WebSocketWorker.prototype.cacheDataBuffPush = function (buffer) {
        if (!buffer) {
            return;
        }
        this._cacheDataBuff.push(buffer);
        this._cacheDataBuffLength += buffer.byteLength;
    };
    WebSocketWorker.prototype.cacheDataBuffShift = function (byteLenght) {
        if (this._cacheDataBuffLength < byteLenght) {
            this.logToMain("cacheDataBuffShift error byteLenght=" + byteLenght + " curLength=" + this._cacheDataBuffLength);
            return new ArrayBuffer(0);
        }
        var result = new ArrayBuffer(byteLenght);
        var resultArray = new Uint8Array(result);
        var buff = null;
        var buffArray = null;
        var count = 0;
        for (var buffIndex = 0; buffIndex < this._cacheDataBuff.length; buffIndex++) {
            buff = this._cacheDataBuff[buffIndex];
            buffArray = new Uint8Array(buff);
            var byteIndex = 0;
            for (; byteIndex < buff.byteLength; byteIndex++) {
                if (count >= byteLenght) {
                    break;
                }
                resultArray[count] = buffArray[byteIndex];
                count++;
            }
            if (byteIndex >= buff.byteLength) {
                this._cacheDataBuff.shift();
                this._cacheDataBuffLength -= buff.byteLength;
                buffIndex--;
            }
            else {
                var newBuff = buff.slice(byteIndex);
                this._cacheDataBuff[buffIndex] = newBuff;
                this._cacheDataBuffLength -= byteIndex;
            }
            if (count >= byteLenght) {
                break;
            }
        }
        return result;
    };
    WebSocketWorker.prototype.gotOneProcessedNetBundle = function (envelope) {
        if (this._enableWorkerMode) {
            this.postMessageToMain("gotProcessedNetBundle", envelope, false);
        }
        else {
            this.onGotOneProcessedNetBundle(envelope);
        }
    };
    WebSocketWorker.prototype.logToMain = function (log, error) {
        if (error === void 0) { error = false; }
        if (this.onGotOneProcessedNetBundle) {
            if (error) {
                Logger.error(LOG_TAG.NetWork, log);
            }
            else {
                Logger.log(LOG_TAG.NetWork, log);
            }
        }
        else {
            log = "[wsWorker]" + log;
            var logLevel = error ? "error" : "log";
            this.postMessageToMain("log", [logLevel, log], false);
        }
    };
    WebSocketWorker.prototype.checkOtherMsg = function (key, value) {
        switch (key) {
            case "Logger":
                this.writeLog(value);
                return true;
            case "LoggerInit":
                this.initLoggerDB(value);
                return true;
            default:
                return false;
        }
    };
    WebSocketWorker.prototype.initLoggerDB = function (table) {
        var thisSelf = this;
        if (thisSelf._loggerIndexedDB) {
            console.error("initLoggerDB repeated table=" + table);
            return;
        }
        thisSelf._loggerIndexedDB = indexedDB || self['mozIndexedDB'] || self['webkitIndexedDB'] || self['msIndexedDB'];
        if (!thisSelf._loggerIndexedDB) {
            console.error("indexedDB not supported");
            return;
        }
        thisSelf._loggerTable = table;
        var openReq = thisSelf._loggerIndexedDB.open("logDataBase");
        openReq.onsuccess = function () {
            thisSelf._loggerDB = openReq.result;
            if (thisSelf._loggerDB.objectStoreNames.contains(table)) {
                thisSelf.initLoggerDBFinish();
            }
            else {
                console.error("worker init logger table error=" + table);
            }
        };
        openReq.onupgradeneeded = function () {
            var db = openReq.result;
            if (!db.objectStoreNames.contains(table)) {
                db.createObjectStore(table, { autoIncrement: true });
            }
        };
    };
    WebSocketWorker.prototype.writeLog = function (data) {
        if (!this._loggerIsReady) {
            if (!this._loggerCacheDataBeforeReady) {
                this._loggerCacheDataBeforeReady = [];
            }
            this._loggerCacheDataBeforeReady.push(data);
            return;
        }
        var store = this._loggerDB.transaction(this._loggerTable, "readwrite").objectStore(this._loggerTable);
        store.put(data);
    };
    WebSocketWorker.prototype.initLoggerDBFinish = function () {
        this._loggerIsReady = true;
        if (this._loggerCacheDataBeforeReady && this._loggerCacheDataBeforeReady.length != 0) {
            for (var _i = 0, _a = this._loggerCacheDataBeforeReady; _i < _a.length; _i++) {
                var data = _a[_i];
                this.writeLog(data);
            }
        }
        this._loggerCacheDataBeforeReady = null;
    };
    WebSocketWorker.THIS_FILE_NAME = "WebSocketWorker";
    WebSocketWorker.useMsgHeadModel = false;
    WebSocketWorker.DATA_HEAD_BYTE_LENGTH = 4;
    WebSocketWorker.WORKER_DECODE_BYTE_LENGTH = 200;
    return WebSocketWorker;
}());
var wsWorker = new WebSocketWorker(true);
onmessage = function (message) {
    if (!message.data) {
        return;
    }
    if (message.data instanceof Array && message.data.length == 2 && (typeof (message.data[0]) == "string")) {
        wsWorker.onMessageFromMain(message.data);
    }
};
//# sourceMappingURL=WebSocketWorker.js.map