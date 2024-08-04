// colyseus.js@0.15.18
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');
var ServerError = require('./errors/ServerError.js');
var Room = require('./Room.js');
var HTTP = require('./HTTP.js');
var Auth = require('./Auth.js');

var _a;
var MatchMakeError = /** @class */ (function (_super) {
    tslib.__extends(MatchMakeError, _super);
    function MatchMakeError(message, code) {
        var _this = _super.call(this, message) || this;
        _this.code = code;
        Object.setPrototypeOf(_this, MatchMakeError.prototype);
        return _this;
    }
    return MatchMakeError;
}(Error));
// - React Native does not provide `window.location`
// - Cocos Creator (Native) does not provide `window.location.hostname`
var DEFAULT_ENDPOINT = typeof window !== "undefined" &&
    typeof ((_a = window === null || window === void 0 ? void 0 : window.location) === null || _a === void 0 ? void 0 : _a.hostname) !== "undefined"
    ? "".concat(window.location.protocol.replace("http", "ws"), "//").concat(window.location.hostname).concat(window.location.port && ":".concat(window.location.port))
    : "ws://127.0.0.1:2567";
var Client = /** @class */ (function () {
    function Client(settings) {
        if (settings === void 0) { settings = DEFAULT_ENDPOINT; }
        if (typeof settings === "string") {
            //
            // endpoint by url
            //
            var url = new URL(settings);
            var secure = url.protocol === "https:" || url.protocol === "wss:";
            var port = Number(url.port || (secure ? 443 : 80));
            console.log("port : ", port);
            this.settings = {
                hostname: url.hostname,
                pathname: url.pathname,
                port: port,
                secure: secure,
            };
        }
        else {
            //
            // endpoint by settings
            //
            if (settings.port === undefined) {
                settings.port = settings.secure ? 443 : 80;
            }
            if (settings.pathname === undefined) {
                settings.pathname = "";
            }
            this.settings = settings;
        }
        // make sure pathname does not end with "/"
        if (this.settings.pathname.endsWith("/")) {
            this.settings.pathname = this.settings.pathname.slice(0, -1);
        }
        this.http = new HTTP.HTTP(this);
        this.auth = new Auth.Auth(this.http);
        // console.log("auth : ", this.auth);
        // console.log("http : ", this.http);
    }
    Client.prototype.joinOrCreate = function (roomName, options, rootSchema) {
        if (options === void 0) { options = {}; }
        return tslib.__awaiter(this, void 0, void 0, function () {
            return tslib.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.createMatchMakeRequest("joinOrCreate", roomName, options, rootSchema)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Client.prototype.create = function (roomName, options, rootSchema) {
        if (options === void 0) { options = {}; }
        return tslib.__awaiter(this, void 0, void 0, function () {
            return tslib.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.createMatchMakeRequest("create", roomName, options, rootSchema)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Client.prototype.join = function (roomName, options, rootSchema) {
        if (options === void 0) { options = {}; }
        return tslib.__awaiter(this, void 0, void 0, function () {
            return tslib.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.createMatchMakeRequest("join", roomName, options, rootSchema)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Client.prototype.joinById = function (roomId, processId, options, rootSchema) {
        if (options === void 0) { options = {}; }
        return tslib.__awaiter(this, void 0, void 0, function () {
            return tslib.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.createMatchMakeRequest("joinById", roomId, processId, options, rootSchema)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Re-establish connection with a room this client was previously connected to.
     *
     * @param reconnectionToken The `room.reconnectionToken` from previously connected room.
     * @param rootSchema (optional) Concrete root schema definition
     * @returns Promise<Room>
     */
    Client.prototype.reconnect = function (reconnectionToken, rootSchema) {
        return tslib.__awaiter(this, void 0, void 0, function () {
            var _a, roomId, token;
            return tslib.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (typeof reconnectionToken === "string" &&
                            typeof rootSchema === "string") {
                            throw new Error("DEPRECATED: .reconnect() now only accepts 'reconnectionToken' as argument.\nYou can get this token from previously connected `room.reconnectionToken`");
                        }
                        _a = reconnectionToken.split(":"), roomId = _a[0], token = _a[1];
                        if (!roomId || !token) {
                            throw new Error("Invalid reconnection token format.\nThe format should be roomId:reconnectionToken");
                        }
                        return [4 /*yield*/, this.createMatchMakeRequest("reconnect", roomId, undefined, { reconnectionToken: token }, rootSchema)];
                    case 1: return [2 /*return*/, _b.sent()];
                }
            });
        });
    };
    Client.prototype.getAvailableRooms = function (roomName) {
        if (roomName === void 0) { roomName = ""; }
        return tslib.__awaiter(this, void 0, void 0, function () {
            return tslib.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.http.get("matchmake/".concat(roomName), {
                            headers: {
                                Accept: "application/json",
                            },
                        })];
                    case 1: return [2 /*return*/, (_a.sent()).data];
                }
            });
        });
    };
    Client.prototype.consumeSeatReservation = function (response, rootSchema, reuseRoomInstance // used in devMode
    ) {
        return tslib.__awaiter(this, void 0, void 0, function () {
            var room, options, targetRoom;
            var _this = this;
            return tslib.__generator(this, function (_a) {
                room = this.createRoom(response.room.name, rootSchema);
                room.roomId = response.room.roomId;
                room.sessionId = response.sessionId;
                options = { sessionId: room.sessionId };
                // forward "reconnection token" in case of reconnection.
                if (response.reconnectionToken) {
                    options.reconnectionToken = response.reconnectionToken;
                }
                targetRoom = reuseRoomInstance || room;
                room.connect(this.buildEndpoint(response.room, options), response.devMode &&
                    (function () { return tslib.__awaiter(_this, void 0, void 0, function () {
                        var retryCount, retryMaxRetries, retryReconnection;
                        var _this = this;
                        return tslib.__generator(this, function (_a) {
                            console.info("[Colyseus devMode]: ".concat(String.fromCodePoint(0x1f504), " Re-establishing connection with room id '").concat(room.roomId, "'...")); // 🔄
                            retryCount = 0;
                            retryMaxRetries = 8;
                            retryReconnection = function () { return tslib.__awaiter(_this, void 0, void 0, function () {
                                return tslib.__generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            retryCount++;
                                            _a.label = 1;
                                        case 1:
                                            _a.trys.push([1, 3, , 4]);
                                            return [4 /*yield*/, this.consumeSeatReservation(response, rootSchema, targetRoom)];
                                        case 2:
                                            _a.sent();
                                            console.info("[Colyseus devMode]: ".concat(String.fromCodePoint(0x2705), " Successfully re-established connection with room '").concat(room.roomId, "'")); // ✅
                                            return [3 /*break*/, 4];
                                        case 3:
                                            _a.sent();
                                            if (retryCount < retryMaxRetries) {
                                                console.info("[Colyseus devMode]: ".concat(String.fromCodePoint(0x1f504), " retrying... (").concat(retryCount, " out of ").concat(retryMaxRetries, ")")); // 🔄
                                                setTimeout(retryReconnection, 2000);
                                            }
                                            else {
                                                console.info("[Colyseus devMode]: ".concat(String.fromCodePoint(0x274c), " Failed to reconnect. Is your server running? Please check server logs.")); // ❌
                                            }
                                            return [3 /*break*/, 4];
                                        case 4: return [2 /*return*/];
                                    }
                                });
                            }); };
                            setTimeout(retryReconnection, 2000);
                            return [2 /*return*/];
                        });
                    }); }), targetRoom);
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var onError = function (code, message) {
                            return reject(new ServerError.ServerError(code, message));
                        };
                        targetRoom.onError.once(onError);
                        targetRoom["onJoin"].once(function () {
                            targetRoom.onError.remove(onError);
                            resolve(targetRoom);
                        });
                    })];
            });
        });
    };
    Client.prototype.createMatchMakeRequest = function (method, roomName, processId, options, rootSchema, reuseRoomInstance) {
        if (processId === void 0) { processId = ""; }
        if (options === void 0) { options = {}; }
        return tslib.__awaiter(this, void 0, void 0, function () {
            var response;
            return tslib.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.http.post("matchmake/".concat(method, "/").concat(roomName, "/").concat(processId), {
                            headers: {
                                Accept: "application/json",
                                "Content-Type": "application/json",
                                "user-agent": "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Mobile Safari/537.36",
                                origin: "https://play.pixels.xyz",
                                referer: "https://play.pixels.xyz/",
                            },
                            body: JSON.stringify(options),
                        })];
                    case 1:
                        response = (_a.sent()).data;
                        // FIXME: HTTP class is already handling this as ServerError.
                        if (response.error) {
                            throw new MatchMakeError(response.error, response.code);
                        }
                        // forward reconnection token during "reconnect" methods.
                        //ko lq
                        if (method === "reconnect") {
                            response.reconnectionToken = options.reconnectionToken;
                        }
                        return [4 /*yield*/, this.consumeSeatReservation(response, rootSchema, reuseRoomInstance)];
                    case 2: 
                    // return response;
                    return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Client.prototype.createRoom = function (roomName, rootSchema) {
        return new Room.Room(roomName, rootSchema);
    };
    Client.prototype.buildEndpoint = function (room, options) {
        if (options === void 0) { options = {}; }
        var params = [];
        // append provided options
        for (var name_1 in options) {
            if (!options.hasOwnProperty(name_1)) {
                continue;
            }
            params.push("".concat(name_1, "=").concat(options[name_1]));
        }
        var endpoint = this.settings.secure ? "wss://" : "ws://";
        if (room.publicAddress) {
            endpoint += "".concat(room.publicAddress);
        }
        else {
            endpoint += "".concat(this.settings.hostname).concat(this.getEndpointPort()).concat(this.settings.pathname);
        }
        return "".concat(endpoint, "/").concat(room.processId, "/").concat(room.roomId, "?").concat(params.join("&"));
    };
    Client.prototype.getHttpEndpoint = function (segments) {
        if (segments === void 0) { segments = ""; }
        var path = segments.startsWith("/") ? segments : "/".concat(segments);
        return "".concat(this.settings.secure ? "https" : "http", "://").concat(this.settings.hostname).concat(this.getEndpointPort()).concat(this.settings.pathname).concat(path);
    };
    Client.prototype.getEndpointPort = function () {
        return this.settings.port !== 80 && this.settings.port !== 443
            ? ":".concat(this.settings.port)
            : "";
    };
    return Client;
}());

exports.Client = Client;
exports.MatchMakeError = MatchMakeError;
//# sourceMappingURL=Client.js.map
