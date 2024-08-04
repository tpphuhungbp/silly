"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vue_1 = require("vue");
const colyseus_js_1 = require("colyseus.js");
const App_vue_1 = __importDefault(require("./App.vue"));
const client = new colyseus_js_1.Client("ws://localhost:2567");
client.joinOrCreate("my_room").then((room) => {
    room.onStateChange((state) => {
        console.log("onStateChange", state);
    });
    room.onLeave((code) => console.log("onLeave:", { code }));
});
(0, vue_1.createApp)(App_vue_1.default).mount('#app');
