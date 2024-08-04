import { setLogCapture } from "puppeteer";
import { Types } from "../constant.js";

const item = {
  fertilizer: {
    id: "itm_fertilizer",
  },
  rustingCan: {
    id: "itm_rustyWateringCan",
  },
  shear: {
    id: "itm_shears",
  },
  popberrySeeds: {
    id: "itm_popberrySeeds",
  },
  perfect_popberrySeeds: {
    id: "itm_perfectPopberrySeeds",
  },
};

let selectedItem = {};

function fertilizerAll(room, player) {
  console.log("Fertilizing.....");
  selectItem(player.inventory.slots, item.fertilizer.id);

  player.entities.forEach((entity) => {
    if (entity.mapId === room.state.id && entity.crop) {
      console.log(JSON.stringify(entity));
      room.send(Types.USE_ITEM, {
        id: selectedItem.id,
        mid: entity.mid,
        slot: selectedItem.inventorySlot,
        type: "entity",
      });
    }
  });
}

function plantSeedAll(room, player, new_account = false) {
  console.log("Planting.....");

  const playerEntityIds = [];
  const entitiesToPlant = [];

  selectItem(player.inventory.slots, new_account ? item.perfect_popberrySeeds.id : item.popberrySeeds.id);

  if (player.entities) {
    player.entities.forEach((entity) => {
      playerEntityIds.push(entity.mapEntity_id);
    });
  }

  if (room.state.entities) {
    room.state.entities.forEach((entity) => {
      if (entity.entity === "ent_soil" && !playerEntityIds.includes(entity.mid)) {
        entitiesToPlant.push(entity);
      }
    });
  }

  for (let i = 0; i < selectedItem.quantity; i++) {
    let target = entitiesToPlant[i];

    room.send(Types.USE_ITEM, {
      id: selectedItem.id,
      mid: target.mid,
      slot: selectedItem.inventorySlot,
      type: "entity",
    });
  }
}

function wateringAll(room, player) {
  console.log("Watering.....");

  selectItem(player.inventory.slots, item.rustingCan.id);

  player.entities.forEach((entity) => {
    if (entity.mapId === room.state.id && entity.crop) {
      if (entity.crop.state === "seed") {
        room.send(Types.USE_ITEM, {
          id: selectedItem.id,
          mid: entity.mid,
          slot: selectedItem.inventorySlot,
          type: "entity",
        });
      }
    }
  });
}

function harvestAll(room, player) {
  console.log("Harvesting.....");

  selectItem(player.inventory.slots, item.shear.id);

  player.entities.forEach((entity) => {
    if (entity.mapId === room.state.id && entity.crop) {
      if (entity.crop.canHarvest) {
        room.send(Types.USE_ITEM, {
          id: selectedItem.id,
          mid: entity.mid,
          slot: selectedItem.inventorySlot,
          type: "entity",
        });
      }
    }
  });
}

function selectItem(inventory, selectedItemId) {
  inventory.forEach((element) => {
    if (element.item == selectedItemId) {
      selectedItem.id = element.item;
      selectedItem.inventorySlot = element.slot;
      selectedItem.quantity = element.quantity;
      console.log("Found item");
    }
  });
}

function swapItem(room) {
  room.send(Types.SWAP_ITEM, {
    targetIndex: 8,
    sourceIndex: 6,
  });
}
export { item, wateringAll, harvestAll, plantSeedAll, swapItem, fertilizerAll };
