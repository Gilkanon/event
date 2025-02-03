import { EventCategory, EventStatus } from '@prisma/client';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';

export class CreateEventDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(30)
  title: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(2000)
  description: string;

  @IsOptional()
  @IsEnum(EventCategory)
  category: EventCategory;

  @IsOptional()
  @IsEnum(EventStatus)
  status: EventStatus;

  @IsNotEmpty()
  @IsDate()
  date: Date;

  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  location: string;

  @IsNotEmpty()
  @IsNumber()
  createdBy: number;

  @IsOptional()
  @IsUrl()
  imageUrl: string;

  @IsOptional()
  @IsUrl()
  videoUrl: string;
}
