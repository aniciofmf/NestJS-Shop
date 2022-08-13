import { Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';
import { connClients } from './interfaces/connClients.interface';

@Injectable()
export class WsService {
  private clients: connClients = {};

  addClient(client: Socket) {
    this.clients[client.id] = client;
  }

  removeClient(clientId: string) {
    delete this.clients[clientId];
  }

  get totalClients(): number {
    return Object.keys(this.clients).length;
  }

  get clientsIds(): string[] {
    return Object.keys(this.clients);
  }
}
