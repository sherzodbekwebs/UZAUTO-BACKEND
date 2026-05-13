import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets'; // @ belgisi borligiga e'tibor bering
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: { origin: '*' }, // Barcha domenlarga ruxsat
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  handleConnection(client: Socket) {
    console.log('Mijoz ulandi:', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('Mijoz uzildi:', client.id);
  }
}