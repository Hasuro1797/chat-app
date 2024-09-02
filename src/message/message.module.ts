import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Message } from './entities/message.entity';
import { ChatGateway } from './message.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([User, Message])],
  providers: [ChatGateway],
})
export class MessageModule {}
