import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import HotelbedsLanguage from '../enum/hotelbeds-language.enum';
import { HotelsBookingMode } from '../enum/hotels-booking-mode.enum';
import { PutHotelsBookingBookDto } from './update-booking/hotels-booking-book-dto';

export class PutHotelsBookingDto {
  @IsNotEmpty()
  @IsEnum(HotelsBookingMode)
  mode: HotelsBookingMode;

  @ApiProperty({ enum: HotelbedsLanguage })
  @IsOptional()
  @IsEnum(HotelbedsLanguage)
  language: HotelbedsLanguage;

  @IsOptional()
  @ValidateNested({ each: true })
  @IsObject()
  @Type(() => PutHotelsBookingBookDto)
  bookings?: PutHotelsBookingBookDto[];
}