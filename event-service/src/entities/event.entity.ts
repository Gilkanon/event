import { $Enums, Event } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class EventEntity implements Event {
  constructor(partial: Partial<EventEntity>) {
    Object.assign(this, partial);
  }

  id: number;

  title: string;

  description: string;

  category: $Enums.EventCategory;

  status: $Enums.EventStatus;

  date: Date;

  location: string;

  createdBy: number;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;

  imageUrl: string | null;

  videoUrl: string | null;
}
