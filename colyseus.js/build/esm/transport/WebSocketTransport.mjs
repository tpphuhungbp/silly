// colyseus.js@0.15.18
import NodeWebSocket from 'ws';

const WebSocket = globalThis.WebSocket || NodeWebSocket;
const headersConfig = {
    headers: {
        "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
        origin: "https://play.pixels.xyz",
        referer: "https://play.pixels.xyz/",
        "content-type": "application/json",
    },
};
class WebSocketTransport {
    events;
    ws;
    protocols;
    constructor(events) {
        this.events = events;
    }
    send(data) {
        if (data instanceof ArrayBuffer) {
            this.ws.send(data);
        }
        else if (Array.isArray(data)) {
            this.ws.send(new Uint8Array(data).buffer);
        }
    }
    connect(url) {
        this.ws = new NodeWebSocket(url, this.protocols, headersConfig);
        this.ws.binaryType = "arraybuffer";
        this.ws.onopen = this.events.onopen;
        this.ws.onmessage = this.events.onmessage;
        this.ws.onclose = this.events.onclose;
        this.ws.onerror = this.events.onerror;
    }
    close(code, reason) {
        this.ws.close(code, reason);
    }
    get isOpen() {
        return this.ws.readyState === WebSocket.OPEN;
    }
}

export { WebSocketTransport };
//# sourceMappingURL=WebSocketTransport.mjs.map
