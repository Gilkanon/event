import { Module } from '@nestjs/common';
import { UserController } from './user-service/user.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './auth-service/auth.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ClientsModule.register([
      {
        name: 'USER_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [String(process.env.RABBITMQ_URL)],
          queue: 'user_queue',
        },
      },
      {
        name: 'AUTH_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [String(process.env.RABBITMQ_URL)],
          queue: 'auth_queue',
        },
      },
    ]),
  ],
  controllers: [UserController, AuthController],
  providers: [],
})
export class AppModule {}
