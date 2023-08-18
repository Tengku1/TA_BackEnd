import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import HotelbedsLanguage from '../enum/hotelbeds-language.enum';
import { CreateBookingHolderDto } from './booking-dto/create-booking-holder.dto';
import { CreateBookingRoomsDto } from './booking-dto/create-booking-rooms.dto';

export class  CreateHotelsBookingDto {
  @IsNotEmpty()
  @IsString()
  user: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @ValidateNested({ each: true })
  @IsObject()
  @Type(() => CreateBookingHolderDto)
  holder?: CreateBookingHolderDto[];

  @IsNotEmpty()
  @IsString()
  check_in: string;

  @IsNotEmpty()
  @IsString()
  check_out: string;

  @IsNotEmpty()
  @IsNumber()
  hotelCode: number;

  @IsNotEmpty()
  @IsString()
  hotelName: string;
  
  @IsNotEmpty()
  @IsString()
  zoneName: string;

  @IsNotEmpty()
  @IsString()
  categoryName: string;

  @IsNotEmpty()
  @IsString()
  destinationName: string;

  @IsOptional()
  @IsString()
  currency: string = 'IDR';

  @IsNotEmpty()
  @ValidateNested({ each: true })
  @IsObject()
  @Type(() => CreateBookingRoomsDto)
  rooms?: CreateBookingRoomsDto[];

  @IsOptional()
  @IsString()
  remark: string = '';

  @IsOptional()
  @IsString()
  pending_amount: string = '';

  @IsNotEmpty()
  @IsString()
  latitude: string;

  @IsNotEmpty()
  @IsString()
  longitude: string;

  @IsOptional()
  @IsString()
  image: string;
  
  @IsOptional()
  @IsNumber()
  tolerance: number;

  @IsNotEmpty()
  @IsString()
  clientReference: string;

  @IsNotEmpty()
  @IsString()
  cancellationPolicies: string;

  @ApiProperty({ enum: HotelbedsLanguage })
  @IsOptional()
  @IsEnum(HotelbedsLanguage)
  language: HotelbedsLanguage;
}