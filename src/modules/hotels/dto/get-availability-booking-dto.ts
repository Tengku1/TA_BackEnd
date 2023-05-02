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
import { GetBookingAvailabilityFilterDto } from './booking-dto/get-booking-availability-filter.dto';
import { GetBookingAvailabilityGeolocationDto } from './booking-dto/get-booking-availability-geolocation.dto';
import { GetBookingAvailabilityOccupanciesDto } from './booking-dto/get-booking-availability-occupancies.dto';
import { GetBookingAvailabilityStayDto } from './booking-dto/get-booking-availability-stay.dto';

export class GetAvailabilityBookingDto {
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

  @IsNotEmpty()
  @ValidateNested({ each: true })
  @IsObject()
  @Type(() => GetBookingAvailabilityGeolocationDto)
  geolocation: GetBookingAvailabilityGeolocationDto[];

  @IsNotEmpty()
  @ValidateNested({ each: true })
  @IsObject()
  @Type(() => GetBookingAvailabilityFilterDto)
  filter: GetBookingAvailabilityFilterDto[];

  @IsOptional()
  @IsNumber()
  offset: number = 0;

  @ApiProperty({ enum: HotelbedsLanguage })
  @IsOptional()
  @IsEnum(HotelbedsLanguage)
  language: HotelbedsLanguage;
}