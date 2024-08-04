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
const expect_1 = __importDefault(require("expect"));
const index_1 = require("./index");
// fetch must be available for `jest`
const node_fetch_1 = __importDefault(require("node-fetch"));
global.fetch = node_fetch_1.default;
function timeout(ms = 200) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, _) => setTimeout(resolve, ms));
    });
}
test('should connect to the server', () => __awaiter(void 0, void 0, void 0, function* () {
    const room = yield (0, index_1.connect)();
    yield timeout();
    (0, expect_1.default)(room).toBeTruthy();
    (0, expect_1.default)(room.state).toBeTruthy();
}));
