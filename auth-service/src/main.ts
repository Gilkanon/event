import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: [String(process.env.RABBITMQ_URL)],
      queue: 'auth_queue',
      retryAttempts: 5,
      retryDelay: 3000,
    },
  });
  await app.listen();
}
bootstrap();
