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
const socket_io_1 = require("socket.io");
const ioredis_1 = __importDefault(require("ioredis"));
const kafka_1 = require("./kafka");
const pub = new ioredis_1.default({
    host: "redis-14b7c39b-agnibharay-125c.l.aivencloud.com",
    port: 28257,
    username: "default",
    password: "AVNS_jiruF67gRp_uvOM5f7R"
});
const sub = new ioredis_1.default({
    host: "redis-14b7c39b-agnibharay-125c.l.aivencloud.com",
    port: 28257,
    username: "default",
    password: "AVNS_jiruF67gRp_uvOM5f7R"
});
class SocketService {
    constructor() {
        console.log("Socket service created");
        this._io = new socket_io_1.Server({
            cors: {
                allowedHeaders: ['*'],
                origin: '*',
            }
        });
        sub.subscribe("MESSAGES");
    }
    initListener() {
        const io = this.io;
        console.log("Socket service initialized");
        io.on("connection", (socket) => {
            console.log("new client connected", socket.id);
            socket.on("event:message", (_a) => __awaiter(this, [_a], void 0, function* ({ message }) {
                console.log("New Message Rec.", message);
                yield pub.publish("MESSAGES", JSON.stringify({ message }));
            }));
        });
        sub.on("message", (channel, message) => __awaiter(this, void 0, void 0, function* () {
            if (channel === "MESSAGES") {
                console.log("Message Recieved(Scalling Test)", message);
                io.emit("message", message);
                yield (0, kafka_1.produceMessage)(message);
                console.log("Kafka Test");
            }
        }));
    }
    get io() {
        return this._io;
    }
}
exports.default = SocketService;
