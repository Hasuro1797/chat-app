import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { User } from 'src/user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(
    private jwtService: JwtService,
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.headers.authorization?.split(' ')[1];
      const payload = this.jwtService.verify(token);
      const user = await this.userRepository.findOne({
        where: { username: payload.sub },
      });
      if (!user) {
        client.disconnect();
        return;
      }
      client['user'] = user;
      console.log(`Client connected: ${client.id}`);
    } catch (e) {
      console.error(e);
      client.disconnect();
    }
  }

  async handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { content: string },
  ) {
    const user = client['user'];
    const message = this.messageRepository.create({
      content: payload.content,
      user,
      createdAt: new Date(),
    });
    await this.messageRepository.save(message);

    this.server.emit('newMessage', {
      content: payload.content,
      username: user.username,
      createdAt: new Date(),
    });
  }
}
