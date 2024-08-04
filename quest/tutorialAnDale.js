import { setCurrentDialog, talkToNPC } from "../action/talkToNPC.js";
import { fertilizerAll, harvestAll, plantSeedAll, wateringAll } from "../action/useItem.js";
import { delay, sendTimerCheck, setTosAccepted } from "../action/util.js";
import { playerState } from "../connection/connection.js";
import { NPC, Types } from "../constant.js";

async function startQuest(room) {
  sendTimerCheck(room);
  setTosAccepted(room);
  await delay(5000);

  talkToNPC(room, NPC.BARNEY);
  await delay(2000);

  plantSeedAll(room, playerState, true);
  await delay(1000);

  talkToNPC(room, NPC.BARNEY);
  await delay(1000);

  wateringAll(room, playerState);
  await delay(1000);

  talkToNPC(room, NPC.BARNEY);
  await delay(1000);

  fertilizerAll(room, playerState);
  await delay(1000);

  talkToNPC(room, NPC.BARNEY);
  await delay(1000);

  harvestAll(room, playerState);
  await delay(1000);

  talkToNPC(room, NPC.BARNEY);
  await delay(1000);

  talkToNPC(room, NPC.BARNEY);
  await delay(1000);
}

export { startQuest };
