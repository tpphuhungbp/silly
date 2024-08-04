"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
require("./util");
const chai_1 = require("chai");
const src_1 = require("../src");
const schema_1 = require("@colyseus/schema");
describe("Client", function () {
    let client;
    before(() => {
        client = new src_1.Client("ws://localhost:2546");
    });
    describe("constructor settings", () => {
        it("url string", () => {
            const room = { roomId: "roomId", processId: "processId", sessionId: "sessionId", };
            const roomWithPublicAddress = { publicAddress: "node-1.colyseus.cloud", roomId: "roomId", processId: "processId", sessionId: "sessionId", };
            const settingsByUrl = {
                'ws://localhost:2567': {
                    settings: { hostname: "localhost", port: 2567, secure: false, },
                    httpEndpoint: "http://localhost:2567/",
                    wsEndpoint: "ws://localhost:2567/processId/roomId?",
                    wsEndpointPublicAddress: "ws://node-1.colyseus.cloud/processId/roomId?"
                },
                'wss://localhost:2567': {
                    settings: { hostname: "localhost", port: 2567, secure: true, },
                    httpEndpoint: "https://localhost:2567/",
                    wsEndpoint: "wss://localhost:2567/processId/roomId?",
                    wsEndpointPublicAddress: "wss://node-1.colyseus.cloud/processId/roomId?"
                },
                'http://localhost': {
                    settings: { hostname: "localhost", port: 80, secure: false, },
                    httpEndpoint: "http://localhost/",
                    wsEndpoint: "ws://localhost/processId/roomId?",
                    wsEndpointPublicAddress: "ws://node-1.colyseus.cloud/processId/roomId?"
                },
                'https://localhost/custom/path': {
                    settings: { hostname: "localhost", port: 443, secure: true, pathname: "/custom/path" },
                    httpEndpoint: "https://localhost/custom/path/",
                    wsEndpoint: "wss://localhost/custom/path/processId/roomId?",
                    wsEndpointPublicAddress: "wss://node-1.colyseus.cloud/processId/roomId?"
                },
            };
            for (const url in settingsByUrl) {
                const expected = settingsByUrl[url];
                const client = new src_1.Client(url);
                const settings = client['settings'];
                chai_1.assert.strictEqual(expected.settings.hostname, settings.hostname);
                chai_1.assert.strictEqual(expected.settings.port, settings.port);
                chai_1.assert.strictEqual(expected.settings.secure, settings.secure);
                chai_1.assert.strictEqual(expected.httpEndpoint, client['getHttpEndpoint']());
                chai_1.assert.strictEqual(expected.wsEndpoint, client['buildEndpoint'](room));
                chai_1.assert.strictEqual(expected.wsEndpointPublicAddress, client['buildEndpoint'](roomWithPublicAddress));
                const clientWithSettings = new src_1.Client(expected.settings);
                chai_1.assert.strictEqual(expected.settings.hostname, clientWithSettings['settings'].hostname);
                chai_1.assert.strictEqual(expected.settings.port, clientWithSettings['settings'].port);
                chai_1.assert.strictEqual(expected.settings.secure, clientWithSettings['settings'].secure);
                chai_1.assert.strictEqual(expected.httpEndpoint, clientWithSettings['getHttpEndpoint']());
                chai_1.assert.strictEqual(expected.wsEndpoint, clientWithSettings['buildEndpoint'](room));
                chai_1.assert.strictEqual(expected.wsEndpointPublicAddress, clientWithSettings['buildEndpoint'](roomWithPublicAddress));
            }
        });
    });
    xit("join", function () {
        const room = client.join("chat");
        // assert.equal(room.name, "chat")
        // assert.deepEqual(room.state, {})
    });
    xit("should allow to pass a Schema constructor as third argument", () => __awaiter(this, void 0, void 0, function* () {
        let State = (() => {
            var _a;
            let _classSuper = schema_1.Schema;
            let _instanceExtraInitializers = [];
            let _str_decorators;
            let _str_initializers = [];
            return _a = class State extends _classSuper {
                    constructor() {
                        super(...arguments);
                        this.str = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _str_initializers, void 0));
                    }
                },
                (() => {
                    var _b;
                    const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_b = _classSuper[Symbol.metadata]) !== null && _b !== void 0 ? _b : null) : void 0;
                    _str_decorators = [(0, schema_1.type)("string")];
                    __esDecorate(null, null, _str_decorators, { kind: "field", name: "str", static: false, private: false, access: { has: obj => "str" in obj, get: obj => obj.str, set: (obj, value) => { obj.str = value; } }, metadata: _metadata }, _str_initializers, _instanceExtraInitializers);
                    if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                })(),
                _a;
        })();
        const room = yield client.joinOrCreate("chat", {}, State);
        room.state.str;
    }));
});
