"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("./util");
const assert_1 = __importDefault(require("assert"));
const src_1 = require("../src");
describe("Auth", function () {
    let client;
    before(() => {
        client = new src_1.Client("ws://localhost:2546");
    });
    describe("store token", () => {
        it("should store token on localStorage", () => {
            client.auth['emitChange']({ user: {}, token: "123" });
            assert_1.default.strictEqual("123", client.auth.token);
            assert_1.default.strictEqual("123", window.localStorage.getItem(client.auth.settings.key));
        });
        it("should reject if no token is stored", () => __awaiter(this, void 0, void 0, function* () {
            // @ts-ignore
            client.auth.token = undefined;
            yield assert_1.default.rejects(() => __awaiter(this, void 0, void 0, function* () {
                yield client.auth.getUserData();
            }), /missing auth.token/);
        }));
    });
    describe("onChange", () => {
        it("should trigger onChange when token is set", () => {
            let onChangePayload = undefined;
            client.auth.onChange((data) => onChangePayload = data);
            client.auth['emitChange']({ user: { dummy: true }, token: "123" });
            assert_1.default.strictEqual("123", client.auth.token);
            assert_1.default.strictEqual("123", client.http.authToken);
            client.auth.onChange((data) => onChangePayload = data);
            client.auth['emitChange']({ user: { dummy: true }, token: null });
            assert_1.default.strictEqual(null, client.auth.token);
            assert_1.default.strictEqual(null, client.http.authToken);
        });
    });
});
