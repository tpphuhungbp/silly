import { connectRoom, getPlayerState, handleRoomEvents, playerSerializer, setPlayerState } from "./connection/connection.js";
import * as Colyseus from "./colyseus.js/build/cjs/index.js";
import { currentLocation, Direction, move } from "./action/move.js";
import { harvestAll, item, plantSeedAll, swapItem, wateringAll } from "./action/useItem.js";
import { type } from "@colyseus/schema";
import { talkToNPC } from "./action/talkToNPC.js";
import { buyStoreItem, sellOrderFetch, sellOrderFill, storeId, storeItem } from "./action/storeAction.js";
import { NPC } from "./constant.js";
import { startQuest } from "./quest/tutorialAnDale.js";

async function start() {
  try {
    console.log("Start...");

    const room = await connectRoom(1);
    const selfPlayer = await getPlayerState(room);
    setPlayerState(selfPlayer);

    handleRoomEvents(room, selfPlayer);
    // sellOrderFetch(room, storeId.bucksGalore);
    // talkToNPC(room, NPC.KAREN);
    // buyStoreItem(room, storeItem.popberrySeed, 1);
    // move(room, Direction.LEFT);
    // wateringAll(room, selfPlayer);
    // harvestAll(room, selfPlayer);
    // plantSeedAll(room, selfPlayer);

    startQuest(room, selfPlayer);
    setTimeout(() => {
      console.log("Leaving room...");
      room.leave();
    }, 20000);
  } catch (err) {
    console.log("An error occurred:", err);
  }
}

start();
