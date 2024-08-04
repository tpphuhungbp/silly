import { Types } from "../constant.js";

const storeId = {
  bucksGalore: "str_bucksGalore",
};

const storeItem = {
  popberrySeed: {
    itemId: "itm_popberrySeeds",
    storeId: storeId.bucksGalore,
  },
};

function buyStoreItem(room, storeItem, quantity = 1) {
  room.send(Types.BUY_STORRE_ITEM, {
    storeId: storeItem.storeId,
    itemId: storeItem.itemId,
    quantity: quantity,
  });
}

function sellOrderFill(room, orderId, quantity) {
  room.send(Types.SELL_ORDER_FILL, {
    sellOrderIndex: orderId,
    storeId: quantity,
  });
}

function sellOrderFetch(room, storeId) {
  room.send(Types.SELL_ORDER_FETCH, { storeId: storeId });
}
export { buyStoreItem, storeItem, sellOrderFetch, sellOrderFill, storeId };
