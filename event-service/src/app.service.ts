import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventCategory, EventStatus } from '@prisma/client';

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllEvents() {
    return this.prisma.event.findMany();
  }

  async findAllActiveEvents() {
    return this.prisma.event.findMany({
      where: { status: EventStatus.ACTIVE },
      orderBy: { date: 'asc' },
    });
  }

  async findEventById(id: number) {
    const event = await this.prisma.event.findUnique({ where: { id: id } });

    if (!event) {
      throw new NotFoundException('event with such id is not found');
    }

    return event;
  }

  async findEventsByCategory(category: EventCategory) {
    return this.prisma.event.findMany({ where: { category } });
  }

  async findEventsByLocation(location: string) {
    return this.prisma.event.findMany({
      where: { location: { contains: location } },
    });
  }

  async findEventsByTitle(title: string) {
    return this.prisma.event.findMany({
      where: { title: { contains: title } },
    });
  }

  async createEvent(createEventDto: CreateEventDto) {
    return this.prisma.event.create({ data: createEventDto });
  }

  async updateEvent(id: number, updateEventDto: UpdateEventDto) {
    return this.prisma.event.update({
      where: { id: id },
      data: updateEventDto,
    });
  }

  async removeEvent(id: number) {
    return this.prisma.event.delete({ where: { id: id } });
  }
}
