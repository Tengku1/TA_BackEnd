import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { IsArrayOfObjects } from 'decorators/validators.decorator';
import { PutHotelsBookingHotelSupplierDto } from './hotels-booking-hotel-supplier-dto';
import { PutHotelsRoomDto } from './hotels-booking-room-dto';

export class PutHotelsBookingHotelDto {
  @IsOptional()
  @IsString()
  checkIn: string;

  @IsOptional()
  @IsString()
  checkOut: string;

  @IsOptional()
  @IsNumber()
  code: number;

  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  categoryCode: string;

  @IsOptional()
  @IsString()
  categoryName: string;

  @IsOptional()
  @IsString()
  destinationCode: string;

  @IsOptional()
  @IsString()
  destinationName: string;

  @IsOptional()
  @IsNumber()
  zoneCode: number;

  @IsOptional()
  @IsString()
  zoneName: string;

  @IsOptional()
  @IsString()
  latitude: string;

  @IsOptional()
  @IsString()
  longitude: string;

  @IsNotEmpty()
  @ValidateNested({ each: true })
  @IsArrayOfObjects()
  @Type(() => PutHotelsRoomDto)
  rooms: PutHotelsRoomDto[];

  @IsOptional()
  @IsString()
  totalNet: string;

  @IsOptional()
  @IsString()
  currency: string;

  @IsNotEmpty()
  @ValidateNested({ each: true })
  @IsObject()
  @Type(() => PutHotelsBookingHotelSupplierDto)
  supllier?: PutHotelsBookingHotelSupplierDto[];
}