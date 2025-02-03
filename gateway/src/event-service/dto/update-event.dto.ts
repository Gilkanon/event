import {
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';
import { EventCategory } from '../enums/event-category.enum';
import { EventStatus } from '../enums/event-status.enum';

export class UpdateEventDto {
  @IsOptional()
  @IsString()
  @MaxLength(30)
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description: string;

  @IsOptional()
  @IsEnum(EventCategory)
  category: EventCategory;

  @IsOptional()
  @IsEnum(EventStatus)
  status: EventStatus;

  @IsOptional()
  @IsDate()
  date: Date;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  location: string;

  @IsOptional()
  @IsNumber()
  createdBy: number;

  @IsOptional()
  @IsUrl()
  imageUrl: string;

  @IsOptional()
  @IsUrl()
  videoUrl: string;
}
