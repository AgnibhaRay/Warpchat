import {Server} from "socket.io";
import Redis from 'ioredis';


const pub=new Redis({
    host:"redis-14b7c39b-agnibharay-125c.l.aivencloud.com",
    port:28257,
    username:"default",
    password:"AVNS_jiruF67gRp_uvOM5f7R"
});
const sub=new Redis({
    host:"redis-14b7c39b-agnibharay-125c.l.aivencloud.com",
    port:28257,
    username:"default",
    password:"AVNS_jiruF67gRp_uvOM5f7R"
});
class SocketService{
    private _io: Server;
    constructor(){
        console.log("Socket service created");  
        this._io = new Server({
            cors: {
                allowedHeaders:['*'],
                origin: '*',
                
            }
        });
        sub.subscribe("MESSAGES");
    }

    public initListener(){
        const io=this.io;
        console.log("Socket service initialized");
        io.on("connection", (socket) => {
            console.log("new client connected",socket.id);

            socket.on("event:message", async ({ message }: { message: string }) => {
                console.log("New Message Rec.", message);
                await pub.publish("MESSAGES", JSON.stringify({ message }));
              });
        });

        sub.on("message", (channel, message) => {
            if(channel==="MESSAGES"){
                console.log("Message Recieved(Scalling Test)", message);
                io.emit("message", message);
            }
        })
    }

    get io(){
        return this._io;
    }
}

export default SocketService;