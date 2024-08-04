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
Object.defineProperty(exports, "__esModule", { value: true });
require("./util");
const chai_1 = require("chai");
const src_1 = require("../src");
const schema_1 = require("@colyseus/schema");
// import { FossilDeltaSerializer } from '../src/serializer/FossilDeltaSerializer';
describe("Room", function () {
    let room = null;
    describe("onMessage / dispatchMessage", () => {
        it("* should handle if message is not registered", (done) => {
            room = new src_1.Room("chat");
            room.onMessage("*", (type, message) => {
                chai_1.assert.equal("something", type);
                chai_1.assert.equal(1, message);
                done();
            });
            room.onMessage("type", (message) => chai_1.assert.equal(5, message));
            room['dispatchMessage']("type", 5);
            room['dispatchMessage']("something", 1);
        });
        it("should handle string message types", (done) => {
            room = new src_1.Room("chat");
            room.onMessage("type", (message) => {
                chai_1.assert.equal(5, message);
                done();
            });
            room['dispatchMessage']("type", 5);
        });
        it("should handle number message types", (done) => {
            room = new src_1.Room("chat");
            room.onMessage(0, (message) => {
                chai_1.assert.equal(5, message);
                done();
            });
            room['dispatchMessage'](0, 5);
        });
        it("should handle number message types", (done) => {
            room = new src_1.Room("chat");
            room.onMessage(0, (message) => {
                chai_1.assert.equal(5, message);
                done();
            });
            room['dispatchMessage'](0, 5);
        });
        it("should handle schema message types", (done) => {
            let MyMessage = (() => {
                var _a;
                let _classSuper = schema_1.Schema;
                let _instanceExtraInitializers = [];
                let _str_decorators;
                let _str_initializers = [];
                return _a = class MyMessage extends _classSuper {
                        constructor() {
                            super(...arguments);
                            this.str = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _str_initializers, "hello"));
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
            room = new src_1.Room("chat");
            room.onMessage(MyMessage, (message) => {
                chai_1.assert.equal("hello", message.str);
                done();
            });
            room['dispatchMessage'](MyMessage, new MyMessage());
        });
    });
    /*
    // FossilDeltaSerializer has been deprecated as of 0.14.2
    describe("fossil-delta", () => {
  
      beforeEach(function() {
          room = new Room("chat");
          (room as any).serializer = new FossilDeltaSerializer();
      });
  
      it("should initialize room with empty state", function() {
          assert.equal(room.name, "chat")
          assert.deepEqual(room.state, {})
      });
  
      it("should emit state change", function(done) {
          room.onStateChange((data) => {
              assert.deepEqual(data.messages, []);
              done();
          });
  
          (<any>room).setState(msgpack.encode({ messages: [] }), 0, 0);
      })
  
      it("should patch room state", function(done) {
          let state = {
              players: {
                  'one': { hp: 100, lvl: 1, position: {x: 0, y: 0} },
                  'two': { hp: 95, lvl: 2, position: {x: 0, y: 0} },
              }
          };
          (<any>room).setState(new Uint8Array(msgpack.encode(state)), 0, 0);
  
          // get previous state encoded
          let previousState = new Uint8Array(msgpack.encode(state));
  
          // change state and encode it
          let nextState = new Uint8Array(msgpack.encode({
              players: {
                  'one': { hp: 40, lvl: 1, position: {x: 0, y: 100} },
                  'two': { hp: 95, lvl: 2, position: {x: 0, y: 0} },
              }
          }));
          let delta = fossilDelta.create(previousState, nextState);
  
          let patchCount = 0;
          room.listen("players/:id/:attribute", (change) => {
              patchCount++
              assert.equal(change.path.id, "one");
              assert.equal(change.path.attribute, "hp");
              assert.equal(change.value, 40);
          });
  
          room.listen("players/:id/position/:axis", (change) => {
              patchCount++
              assert.equal(change.path.id, "one");
              assert.equal(change.path.axis, "y");
              assert.equal(change.value, 100);
          });
  
          (<any>room).patch(delta);
  
          setTimeout(() => {
              if (patchCount === 2) done();
          }, 1);
      });
    });
    */
});
