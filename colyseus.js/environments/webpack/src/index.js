"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const colyseus_js_1 = require("colyseus.js");
const client = new colyseus_js_1.Client("ws://localhost:2567");
client.joinOrCreate("my_room").then((room) => {
    room.onStateChange((state) => {
        console.log("onStateChange", state);
    });
    room.onLeave((code) => console.log("onLeave:", { code }));
});
