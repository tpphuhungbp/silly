import NodeWebSocket from "ws";
import { ITransport, ITransportEventMap } from "./ITransport";

const WebSocket = globalThis.WebSocket || NodeWebSocket;

const headersConfig = {
    headers: {
        "user-agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
        origin: "https://play.pixels.xyz",
        referer: "https://play.pixels.xyz/",
        "content-type": "application/json",
    },
};

export class WebSocketTransport implements ITransport {
    ws: WebSocket | NodeWebSocket;
    protocols?: string | string[];

    constructor(public events: ITransportEventMap) {}

    public send(data: ArrayBuffer | Array<number>): void {
        if (data instanceof ArrayBuffer) {
            this.ws.send(data);
        } else if (Array.isArray(data)) {
            this.ws.send(new Uint8Array(data).buffer);
        }
    }

    public connect(url: string) {
        this.ws = new NodeWebSocket(url, this.protocols, headersConfig);

        this.ws.binaryType = "arraybuffer";
        this.ws.onopen = this.events.onopen;
        this.ws.onmessage = this.events.onmessage;
        this.ws.onclose = this.events.onclose;
        this.ws.onerror = this.events.onerror;
    }

    public close(code?: number, reason?: string) {
        this.ws.close(code, reason);
    }

    get isOpen() {
        return this.ws.readyState === WebSocket.OPEN;
    }
}
