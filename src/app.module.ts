import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { envs } from './config';
// import { User } from './user/user.entity';
// import { Message } from './message/message.entity';
// import { AuthModule } from './auth/auth.module';
// import { ChatModule } from './chat/chat.module';
import { UserModule } from './user/user.module';
import { MessageModule } from './message/message.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: envs.database.host,
      port: envs.database.port,
      username: envs.database.user,
      password: envs.database.password,
      database: envs.database.name,
      autoLoadEntities: true,
      synchronize: true, // Set to true for development
    }),
    UserModule,
    MessageModule,
    AuthModule,
    // AuthModule,
    // ChatModule,
  ],
})
export class AppModule {}
