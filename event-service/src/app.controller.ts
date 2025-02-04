import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { EventCategory } from '@prisma/client';
import { CreateEventDto } from './dto/create-event.dto';
import { plainToInstance } from 'class-transformer';
import { EventEntity } from './entities/event.entity';
import { UpdateEventDto } from './dto/update-event.dto';
import { S3Service } from './s3/s3.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly s3Service: S3Service,
  ) {}

  @MessagePattern('find-all-events')
  async findAllEvents(): Promise<EventEntity[]> {
    const events = await this.appService.findAllEvents();
    return events.map((event) => plainToInstance(EventEntity, event));
  }

  @MessagePattern('find-active-events')
  async findAllActiveEvents(): Promise<EventEntity[]> {
    const events = await this.appService.findAllActiveEvents();
    return events.map((event) => plainToInstance(EventEntity, event));
  }

  @MessagePattern('find-event-by-id')
  async findEventById(id: number): Promise<EventEntity> {
    const event = await this.appService.findEventById(id);
    return plainToInstance(EventEntity, event);
  }

  @MessagePattern('find-events-by-category')
  async findEventsByCategory(category: string): Promise<EventEntity[]> {
    const normalizedCategory = category.toUpperCase() as EventCategory;
    if (!Object.values(EventCategory).includes(normalizedCategory)) {
      throw new Error('invalid category');
    }
    const events =
      await this.appService.findEventsByCategory(normalizedCategory);
    return events.map((event) => plainToInstance(EventEntity, event));
  }

  @MessagePattern('find-events-by-location')
  async findEventsByLocation(location: string): Promise<EventEntity[]> {
    const events = await this.appService.findEventsByLocation(location);
    return events.map((event) => plainToInstance(EventEntity, event));
  }

  @MessagePattern('find-events-by-title')
  async findEventsByTitle(title: string): Promise<EventEntity[]> {
    const events = await this.appService.findEventsByTitle(title);
    return events.map((event) => plainToInstance(EventEntity, event));
  }

  @MessagePattern('upload-event-image')
  async uploadImage(
    @Payload() file: { buffer: Buffer; originalName: string; mimeType: string },
  ): Promise<string> {
    return this.s3Service.uploadFile(
      file.buffer,
      file.originalName,
      file.mimeType,
    );
  }

  @MessagePattern('create-event')
  async createEvent(createEventDto: CreateEventDto): Promise<EventEntity> {
    const event = await this.appService.createEvent(createEventDto);
    return plainToInstance(EventEntity, event);
  }

  @MessagePattern('update-event')
  async updateEvent(
    id: number,
    updateEventDto: UpdateEventDto,
  ): Promise<EventEntity> {
    const event = await this.appService.updateEvent(id, updateEventDto);
    return plainToInstance(EventEntity, event);
  }

  @EventPattern('remove-event')
  async removeEvent(id: number): Promise<void> {
    await this.appService.removeEvent(id);
  }
}
