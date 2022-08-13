import { Socket } from 'socket.io';

export interface connClients {
  [id: string]: Socket;
}
