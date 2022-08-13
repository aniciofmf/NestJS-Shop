import { JwtService } from '@nestjs/jwt';
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
import { JwtPayload } from '../auth/interfaces/jwt.interface';

@WebSocketGateway({ cors: true })
export class WsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() wss: Server;

  constructor(
    private readonly wsService: WsService,
    private readonly jwtService: JwtService,
  ) {}

  async handleConnection(client: Socket) {
    const token = client.handshake.headers.authentication as string;
    let payload: JwtPayload;

    try {
      payload = this.jwtService.verify(token);
      await this.wsService.addClient(client, payload.id);
    } catch (error) {
      client.emit('server:autherror', { msg: 'There was an error' });
      client.disconnect();
      return;
    }

    this.wss.emit('clients:updated', this.wsService.clientsIds);
  }

  handleDisconnect(client: any) {
    this.wsService.removeClient(client.id);
    this.wss.emit('clients:updated', this.wsService.clientsIds);
  }

  @SubscribeMessage('clients:messages')
  handleMsg(client: Socket, payload: any) {
    //client.broadcast.emit('server:messages', payload);
    this.wss.emit('server:messages', {
      name: this.wsService.userByfullname(client.id),
      msg: payload.msg,
    });
  }
}
