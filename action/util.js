import { Types } from "../constant.js";

function setTosAccepted(room) {
  room.send(Types.SET_TOS_ACCEPTED);
}

function sendTimerCheck(room) {
  room.send(Types.TIMER_CHECK);
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export { setTosAccepted, sendTimerCheck, delay };
