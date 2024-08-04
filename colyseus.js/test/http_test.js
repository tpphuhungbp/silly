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
Object.defineProperty(exports, "__esModule", { value: true });
require("./util");
const src_1 = require("../src");
describe("HTTP", function () {
    let client;
    before(() => {
        client = new src_1.Client("ws://localhost:4545");
    });
    describe("errors", () => {
        it("should return 'offline' error when requesting offline service", () => __awaiter(this, void 0, void 0, function* () {
            try {
                yield client.http.post("/anything");
            }
            catch (e) {
                console.log({ code: e.code, message: e.message });
                console.log(e);
            }
        }));
    });
});
