"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_localstorage_1 = require("node-localstorage");
// mock WebSocket
global.WebSocket = class WebSocket {
    send() { }
};
// mock localStorage
global.window = { localStorage: new node_localstorage_1.LocalStorage('./test') };
