import { Types } from "../constant.js";

let selectedNPC = {};

let currentDialog = {};

function talkToNPC(room, npc) {
  console.log("Talking to NPC ...", npc);

  findNPC(room, npc);

  //   room.send(Types.TALK_TO_NPC, {
  //     dialogId: selectedNPC.npcId,
  //     event: undefined,
  //     npcId: selectedNPC.npcId,
  //   });
  room.send(Types.TALK_TO_NPC, selectedNPC);
}

function closeDialog(room) {
  room.send(Types.CLOSE_DIALOG, {
    dialogId: currentDialog.dialogId,
    event: currentDialog.event,
    npcId: selectedNPC.npcId,
  });
}

function findNPC(room, npc) {
  room.state.entities.forEach((entity) => {
    if (entity.entity === npc) {
      selectedNPC = { npcId: entity.entity, mid: entity.mid };
      console.log("Found npc", selectedNPC);
    }
  });
}

function setCurrentDialog(room, dialog) {
  currentDialog = { dialogId: dialog[0].messages[dialog[0].messages.length - 1], event: dialog[0].event };

  closeDialog(room);
}

export { talkToNPC, setCurrentDialog };
