import http from 'http';
import { MsgConsumner } from './services/kafka';
import SocketService from './services/socket';
async function init() {
    MsgConsumner();
    const socketService = new SocketService();

    const httpServer=http.createServer();
    const port = process.env.PORT? process.env.PORT : 8000;

    socketService.io.attach(httpServer);

    httpServer.listen(port, () => {
        console.log(`Server running on port ${port}`);
    })

    socketService.initListener();
}

init();