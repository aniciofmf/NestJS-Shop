import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WsService } from './ws.service';

@WebSocketGateway({ cors: true })
export class WsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() wss: Server;

  constructor(private readonly wsService: WsService) {}

  handleConnection(client: Socket, ...args: any[]) {
    this.wsService.addClient(client);
    this.wss.emit('clients:updated', this.wsService.clientsIds);
  }

  handleDisconnect(client: any) {
    this.wsService.removeClient(client.id);
  }
}
