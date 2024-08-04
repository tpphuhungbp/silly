import { loginAccount } from "./pixels.js";
import * as Colyseus from "../colyseus.js/build/cjs/index.js";
import { setcurrentLocation } from "../action/move.js";
import axios from "axios";
import dotenv from "dotenv";
import { Types } from "../constant.js";
import { setCurrentDialog } from "../action/talkToNPC.js";
dotenv.config();

const AUTH_TOKEN = process.env.AUTH_TOKEN;
const playerSerializer = new Colyseus.SchemaSerializer();
let isNewAccount = true;

let playerState = undefined;

const headersConfig = {
  headers: {
    "user-agent":
      "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Mobile Safari/537.36",
    origin: "https://play.pixels.xyz",
    referer: "https://play.pixels.xyz/",
    "content-type": "application/json",
  },
};

async function initPlayer(ver) {
  // const res = await axios.post({
  //   url: "https://pixels-server.pixels.xyz/v1/auth/initialize",
  //   body: JSON.stringify({
  //     authToken: AUTH_TOKEN,
  //     mapId: "",
  //     tenant: "pixels",
  //     walletProvider: "otpc",
  //     ver: ver,
  //   }),
  //   headers: headersConfig.headers,
  //   proxy: headersConfig.proxy,
  // });
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
  return res.data.player;
}

async function getVer() {
  // const ver = await axios.get({
  //   url: "https://play.pixels.xyz/api/ver",
  //   headers: headersConfig.headers,
  //   proxy: headersConfig.proxy,
  // });

  const ver = await axios.get("https://play.pixels.xyz/api/ver", headersConfig);
  return ver.data.version;
}

async function getMinTrafficWorld() {
  const newDate = Date.now();

  const worldsTraffic = await axios.get(`https://pixels-server.pixels.xyz/v1/game/worlds?v=${newDate}`, headersConfig);

  const minTrafficIndex = worldsTraffic.data.slice(1, 499).reduce((minIndex, world, currentIndex) => {
    if (world > 0 && world < worldsTraffic.data[minIndex]) {
      return currentIndex;
    }
    return minIndex;
  }, 1);
  return minTrafficIndex;
}

async function getRoomData(mapId, world) {
  const newDate = Date.now();

  const room = await axios.get(`https://pixels-server.pixels.xyz/game/findroom/${mapId}/${world}?v=${newDate}`, headersConfig);
  return room.data;
}

function handleRoomEvents(room, selfPlayer) {
  if (room) console.log("Room connected");
  else {
    console.log("Room is null");
    return;
  }
  room.onMessage("*", (messageType, message) => {
    if (room)
      try {
        var serializer;
        switch (messageType) {
          case Types.UPDATE_PLAYER:
            null === (serializer = playerSerializer) || void 0 === serializer || serializer.patch(message);
            console.log("Player updated", JSON.stringify(selfPlayer.inventory));
            setPlayerState(selfPlayer);
            break;
          case Types.TALK_TO_NPC:
            console.log("Talked to NPC", message);
            setCurrentDialog(room, message);
            break;
          case Types.USE_ITEM:
            console.log("Used item", message);
          case Types.SELL_ORDERS:
            console.log("Sell orders", JSON.stringify(message));
          default:
            console.log("Unhandled message", message);
        }
      } catch (t) {
        console.error("exception in message", t, "from message", message);
      }
  });
}

function getPlayerState(room) {
  let selfPlayer = new Promise((resolve) => {
    var R;
    null === (R = room) ||
      void 0 === R ||
      R.onMessage("joinRoom", (message) => {
        // console.log(message.config);
        playerSerializer.handshake(message.handshake), playerSerializer.setState(message.serialPlayer);
        let state = playerSerializer.getState();
        resolve(state);
      });
  });
  return selfPlayer;
}

async function connectRoom(selectedWorld = 0, needRecaptcha = false) {
  console.log(`Connecting to room with ${selectedWorld ? "selected world: " + selectedWorld : "MIN traffic world"} ...`);

  try {
    let world = {};

    if (selectedWorld) world = selectedWorld;
    else world = await getMinTrafficWorld();

    const ver = await getVer();

    const player = await initPlayer(ver);

    setcurrentLocation(player.location.x, player.location.y);

    const roomInfo = await getRoomData(player.location.mapId, world);

    const joinRoomOptions = {
      mapId: player.location.mapId,
      token: AUTH_TOKEN,
      isGuest: false,
      cryptoWallet: player.cryptoWallet,
      username: player.username,
      playerId: player._id,
      //   telemetryId: code,
      world: world,
      ver: ver,
      avatar: player.currentAvatar,
      lastSavedAt: player.lastSavedAt,
      ...(needRecaptcha && { telemetryId: await loginAccount() }),
    };

    const client = new Colyseus.Client("https://pixels-server.pixels.xyz");
    // loginAccount().then(async (code) => {

    const room = await client.joinById(roomInfo.roomId, roomInfo.server, joinRoomOptions);

    // await Promise.all([et, ee]);
    console.log("sessionID: ", room.sessionId);
    // });

    console.log("World with minimum traffic is world: ", world);
    console.log("Init player id: ", player._id);
    console.log("Version: ", ver);
    console.log("Room id: ", roomInfo.roomId);
    console.log("Server: ", roomInfo.server);

    return room;
  } catch (err) {
    if (err.message == "need-recaptcha") {
      console.log("Need-recaptcha, Reconnecting...");
      return connectRoom(selectedWorld, true);
    }
    console.error("Caught an error:", err.message);
  }
}

function setPlayerState(newstate) {
  playerState = { ...newstate };
}

export { connectRoom, playerSerializer, getPlayerState, handleRoomEvents, setPlayerState, playerState };
