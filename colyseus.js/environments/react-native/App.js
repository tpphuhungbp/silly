"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const expo_status_bar_1 = require("expo-status-bar");
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const colyseus_js_1 = require("colyseus.js");
const client = new colyseus_js_1.Client();
client.joinOrCreate("my_room").then((room) => {
    room.onStateChange((state) => {
        console.log("onStateChange:", state);
    });
    room.onLeave((code) => console.log("code", code));
});
function App() {
    return (<react_native_1.View style={styles.container}>
      <react_native_1.Text>Open up App.tsx to start working on your app!</react_native_1.Text>
      <expo_status_bar_1.StatusBar style="auto"/>
    </react_native_1.View>);
}
exports.default = App;
const styles = react_native_1.StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
