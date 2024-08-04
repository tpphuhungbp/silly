import axios from "axios";
import WebSocket from "ws";
import { Context, decode, encode, Schema } from "@colyseus/schema";
import { Client } from "../Client";
import { registerSerializer } from "../serializer/Serializer";
import { SchemaSerializer } from "../serializer/SchemaSerializer";
import { NoneSerializer } from "../serializer/NoneSerializer";

interface IPlayer {
    _id: string;
    location: {
        mapId: string;
    };
    username: string;
    currentAvatar: string;
    cryptoWallet: [];
    lastSavedAt: number;
}

const AUTH_TOKEN = "ArFPtRsXSIciO1TxrRhIApcn-UJoLLxXyKKoi81KLhpo";

const headersConfig = {
    headers: {
        "user-agent":
            "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Mobile Safari/537.36",
        origin: "https://play.pixels.xyz",
        referer: "https://play.pixels.xyz/",
        "content-type": "application/json",
    },
};

registerSerializer("schema", SchemaSerializer);
registerSerializer("none", NoneSerializer);

async function initPlayer(ver: number) {
    const res = await axios.post(
        "https://pixels-server.pixels.xyz/v1/auth/initialize",
        JSON.stringify({
            authToken: AUTH_TOKEN,
            mapId: "",
            tenant: "pixels",
            walletProvider: "otpc",
            ver: ver,
        }),
        headersConfig
    );
    return res.data.player as IPlayer;
}

async function getVer() {
    const ver = await axios.get(
        "https://play.pixels.xyz/api/ver",
        headersConfig
    );
    return ver.data.version;
}

async function getMinTrafficWorld() {
    const newDate = Date.now();

    const worldsTraffic = await axios.get(
        `https://pixels-server.pixels.xyz/v1/game/worlds?v=${newDate}`,
        headersConfig
    );

    const minTrafficIndex = worldsTraffic.data
        .slice(1, 499)
        .reduce(
            (minIndex: string | number, world: number, currentIndex: any) => {
                if (world > 0 && world < worldsTraffic.data[minIndex]) {
                    return currentIndex;
                }
                return minIndex;
            },
            1
        );
    return minTrafficIndex;
}

async function getRoomData(mapId: string, world: number) {
    const newDate = Date.now();

    const room = await axios.get(
        `https://pixels-server.pixels.xyz/game/findroom/${mapId}/${world}?v=${newDate}`,
        headersConfig
    );
    return room.data;
}

async function fetchData() {
    try {
        console.log("Fetching data...");

        const ver = await getVer();

        // const world = await getMinTrafficWorld();
        const world = 1;

        const player = await initPlayer(ver);

        const roomInfo = await getRoomData(player.location.mapId, world);

        const client = new Client("https://pixels-server.pixels.xyz");

        const room = await client.joinById(roomInfo.roomId, roomInfo.server, {
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
    } catch (err) {
        console.log("An error occurred:", err);
    }
}

export default fetchData();
