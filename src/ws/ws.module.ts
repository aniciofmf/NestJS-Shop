import { Module } from '@nestjs/common';
import { WsService } from './ws.service';
import { WsGateway } from './ws.gateway';
import { AuthModule } from '../auth/auth.module';

@Module({
  providers: [WsGateway, WsService],
  imports: [AuthModule],
})
export class WsModule {}
