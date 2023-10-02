import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: process.env.URL_FRONT,
    methods: ['GET', 'POST'],
  },
  path: '/socket/',
})
export class SocketEvents {
  @WebSocketServer()
  server: Server;
}
