import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { IsArrayOfObjects } from 'decorators/validators.decorator';
import HotelbedsLanguage from '../enum/hotelbeds-language.enum';
import { GetByHotelCodeDto } from './availability-hotel/get-by-hotel-code.dto';
import { GetBookingAvailabilityOccupanciesDto } from './booking-dto/get-booking-availability-occupancies.dto';
import { GetBookingAvailabilityStayDto } from './booking-dto/get-booking-availability-stay.dto';

export class GetAvailabilityByHotelDto{
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @IsObject()
  @Type(() => GetBookingAvailabilityStayDto)
  stay: GetBookingAvailabilityStayDto[];

  @IsNotEmpty()
  @ValidateNested({ each: true })
  @IsArrayOfObjects()
  @Type(() => GetBookingAvailabilityOccupanciesDto)
  occupancies: GetBookingAvailabilityOccupanciesDto[];

  @IsOptional()
  @IsNumber()
  offset: number = 0;

  @IsNotEmpty()
  @IsObject()
  @Type(() => GetByHotelCodeDto)
  hotels: GetByHotelCodeDto[];

  @ApiProperty({ enum: HotelbedsLanguage })
  @IsOptional()
  @IsEnum(HotelbedsLanguage)
  language: HotelbedsLanguage;
}