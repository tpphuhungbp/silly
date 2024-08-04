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
const Client_1 = require("../Client");
const Serializer_1 = require("../serializer/Serializer");
const SchemaSerializer_1 = require("../serializer/SchemaSerializer");
const NoneSerializer_1 = require("../serializer/NoneSerializer");
const AUTH_TOKEN = "ArFPtRsXSIciO1TxrRhIApcn-UJoLLxXyKKoi81KLhpo";
const headersConfig = {
    headers: {
        "user-agent": "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Mobile Safari/537.36",
        origin: "https://play.pixels.xyz",
        referer: "https://play.pixels.xyz/",
        "content-type": "application/json",
    },
};
(0, Serializer_1.registerSerializer)("schema", SchemaSerializer_1.SchemaSerializer);
(0, Serializer_1.registerSerializer)("none", NoneSerializer_1.NoneSerializer);
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
            if (world > 0 && world < worldsTraffic.data[minIndex]) {
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
            // const world = await getMinTrafficWorld();
            const world = 1;
            const player = yield initPlayer(ver);
            const roomInfo = yield getRoomData(player.location.mapId, world);
            const client = new Client_1.Client("https://pixels-server.pixels.xyz");
            const room = yield client.joinById(roomInfo.roomId, roomInfo.server, {
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
            });
            console.log("World with minimum traffic is world: ", world);
            console.log("Init player id: ", player._id);
            console.log("Version: ", ver);
            console.log("Room id: ", roomInfo.roomId);
            console.log("Server: ", roomInfo.server);
            console.log("sessionID: ", room.sessionId);
        }
        catch (err) {
            console.log("An error occurred:", err);
        }
    });
}
exports.default = fetchData();
//# sourceMappingURL=index.js.map