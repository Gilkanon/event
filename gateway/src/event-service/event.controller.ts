import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseEnumPipe,
  ParseIntPipe,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { EventCategory } from './enums/event-category.enum';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { firstValueFrom } from 'rxjs';

@Controller()
export class EventController {
  constructor(@Inject('EVENT_SERVICE') private eventClient: ClientProxy) {}

  @Get('events/')
  async findAllEvents() {
    return this.eventClient.send('find-all-events', {});
  }

  @Get('events/active')
  async findAllActiveEvents() {
    return this.eventClient.send('find-active-events', {});
  }

  @Get('events/id/:id')
  async findEventById(@Param('id', ParseIntPipe) id: number) {
    return this.eventClient.send('find-event-by-id', id);
  }

  @Get('events/category/:category')
  async findEventsByCategory(
    @Param('category', new ParseEnumPipe(EventCategory))
    category: EventCategory,
  ) {
    return this.eventClient.send('find-events-by-category', category);
  }

  @Get('events/location/')
  async findEventsByLocation(@Body() data) {
    const { location } = data;
    return this.eventClient.send('find-events-by-location', location);
  }

  @Get('events/title/')
  async findEventsByTitle(@Body() data) {
    const { title } = data;
    return this.eventClient.send('find-events-by-title', title);
  }

  @UseGuards(JwtAuthGuard)
  @Post('events/create/`')
  @UseInterceptors(FileInterceptor('file'))
  async createEvent(
    @Body() createEventDto: CreateEventDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (file) {
      const imageUrl = await firstValueFrom(
        this.eventClient.send('upload-event-image', {
          buffer: file.buffer,
          originalName: file.originalname,
          mimeType: file.mimetype,
        }),
      );

      createEventDto.imageUrl = imageUrl;
    }

    return this.eventClient.send('create-event', createEventDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('events/update/:id')
  async updateEvent(
    @Param('id', ParseIntPipe) id: number,
    updateEventDto: UpdateEventDto,
  ) {
    return this.eventClient.send('update-event', { id, updateEventDto });
  }

  @UseGuards(JwtAuthGuard)
  @Roles('ADMIN')
  @Delete('events/delete/:id')
  async deleteEvent(@Param('id', ParseIntPipe) id: number) {
    return this.eventClient.emit('remove-event', id);
  }
}
