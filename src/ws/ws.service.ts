import { Socket } from 'socket.io';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { connClients } from './interfaces/connClients.interface';
import { User } from '../auth/entities/user.entity';

@Injectable()
export class WsService {
  private clients: connClients = {};

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async addClient(client: Socket, userId: string) {
    const user = await this.userRepository.findOneBy({ id: userId });

    if (!user || !user.active) {
      throw new Error('User error');
    }

    this.clients[client.id] = {
      socket: client,
      user: user,
    };
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
