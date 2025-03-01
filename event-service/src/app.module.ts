import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from './prisma/prisma.service';
import { S3Service } from './s3/s3.service';

@Module({
  imports: [PrismaModule],
  controllers: [AppController],
  providers: [AppService, PrismaService, S3Service],
})
export class AppModule {}
