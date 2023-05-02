import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { IsArrayOfObjects } from 'decorators/validators.decorator';
import HotelbedsLanguage from '../enum/hotelbeds-language.enum';
import { CreateBookingHolderDto } from './booking-dto/create-booking-holder.dto';
import { CreateBookingRoomsDto } from './booking-dto/create-booking-rooms.dto';

export class  CreateHotelsBookingDto {
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
  @IsNumber()
  total_room: number;

  @IsNotEmpty()
  @IsNumber()
  xplorin_selling_rate: number;

  @IsNotEmpty()
  @IsNumber()
  fee: number;

  @IsNotEmpty()
  @IsBoolean()
  hotel_mandatory_rate: boolean;

  @IsNotEmpty()
  @ValidateNested({ each: true })
  @IsArrayOfObjects()
  @Type(() => CreateBookingRoomsDto)
  rooms?: CreateBookingRoomsDto[];

  @IsNotEmpty()
  @IsString()
  image: string;

  @IsNotEmpty()
  @IsString()
  clientReference: string;

  @IsOptional()
  @IsString()
  remark: string = '';
  
  @IsOptional()
  @IsNumber()
  tolerance: number;

  @IsOptional()
  @IsString()
  vendor: string;

  @ApiProperty({ enum: HotelbedsLanguage })
  @IsOptional()
  @IsEnum(HotelbedsLanguage)
  language: HotelbedsLanguage;
}