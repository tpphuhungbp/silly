"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const ws_1 = __importDefault(require("ws"));
const AUTH_TOKEN = "ArFPtRsXSIciO1TxrRhIApcn-UJoLLxXyKKoi81KLhpo";
const headersConfig = {
    headers: {
        "user-agent": "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Mobile Safari/537.36",
        origin: "https://play.pixels.xyz",
        referer: "https://play.pixels.xyz/",
        "content-type": "application/json",
    },
};
// function decodeMessage(message) {
//   const bytes = Array.from(new Uint8Array(message));
//   const it = { offset: 1 };
//   return { string: decode.string(message, it), number: decode.number(message, it) };
// }
function initPlayer(ver) {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield axios_1.default.post("https://pixels-server.pixels.xyz/v1/auth/initialize", JSON.stringify({
            authToken: AUTH_TOKEN,
            mapId: "",
            tenant: "pixels",
            walletProvider: "otpc",
            ver: ver,
        }), headersConfig);
        return res.data.player;
    });
}
function getVer() {
    return __awaiter(this, void 0, void 0, function* () {
        const ver = yield axios_1.default.get("https://play.pixels.xyz/api/ver", headersConfig);
        return ver.data.version;
    });
}
function getMinTrafficWorld() {
    return __awaiter(this, void 0, void 0, function* () {
        const newDate = Date.now();
        const worldsTraffic = yield axios_1.default.get(`https://pixels-server.pixels.xyz/v1/game/worlds?v=${newDate}`, headersConfig);
        const minTrafficIndex = worldsTraffic.data
            .slice(1, 499)
            .reduce((minIndex, world, currentIndex) => {
            if (world < worldsTraffic.data[minIndex]) {
                return currentIndex;
            }
            return minIndex;
        }, 1);
        return minTrafficIndex;
    });
}
function getRoomData(mapId, world) {
    return __awaiter(this, void 0, void 0, function* () {
        const newDate = Date.now();
        const room = yield axios_1.default.get(`https://pixels-server.pixels.xyz/game/findroom/${mapId}/${world}?v=${newDate}`, headersConfig);
        return room.data;
    });
}
function fetchData() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log("Fetching data...");
            const ver = yield getVer();
            const world = yield getMinTrafficWorld();
            const player = yield initPlayer(ver);
            const room = yield getRoomData(player.location.mapId, world);
            const join = yield axios_1.default.post(`https://pixels-server.pixels.xyz/matchmake/joinById/${room.roomId}/${room.server}`, JSON.stringify({
                mapId: player.location.mapId,
                token: AUTH_TOKEN,
                isGuest: false,
                cryptoWallet: player.cryptoWallet,
                username: player.username,
                playerId: player._id,
                world: world,
                ver: ver,
                avatar: player.currentAvatar,
                lastSavedAt: player.lastSavedAt,
            }), headersConfig);
            // const client = new Client(`wss://pixels-server.pixels.xyz/`);
            // client.joinById(room.roomId);
            const ws = new ws_1.default(`wss://pixels-server.pixels.xyz/${room.server}/${room.roomId}?sessionId=${join.data.sessionId}`, headersConfig);
            console.log("World with minimum traffic is world: ", world);
            console.log("Init player id: ", player._id);
            console.log("Version: ", ver);
            console.log("Room id: ", room.roomId);
            console.log("Server: ", room.server);
            console.log("Join session Id: ", join.data.sessionId);
            console.log(`WS:   wss://pixels-server.pixels.xyz/${room.server}/${room.roomId}?sessionId=${join.data.sessionId}`);
            ws.on("open", function open() {
                console.log("Connected to WS");
            });
            ws.on("message", function incoming(data) {
                console.log("Receive: ", data);
                //   console.log("Receive decode", decodeMessage(data));
            });
            ws.on("close", function close() {
                console.log("Disconnected from WS");
            });
        }
        catch (err) {
            console.log("An error occurred:", err);
        }
    });
}
fetchData();
//# sourceMappingURL=test.js.map