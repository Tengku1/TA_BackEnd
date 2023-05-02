import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { IsArrayOfObjects } from 'decorators/validators.decorator';
import { CreateBookingPaxesDto } from '../booking-dto/create-booking-paxes.dto';
import { PutHotelsRoomRatesDto } from './hotels-room-rates-dto';

export class PutHotelsRoomDto {
  @IsOptional()
  @IsString()
  status: string;

  @IsOptional()
  @IsNumber()
  id: number;

  @IsOptional()
  @IsString()
  code: string;

  @IsOptional()
  @IsString()
  name: string;
  
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @IsArrayOfObjects()
  @Type(() => CreateBookingPaxesDto)
  paxes?: CreateBookingPaxesDto[];

  @IsNotEmpty()
  @ValidateNested({ each: true })
  @IsArrayOfObjects()
  @Type(() => PutHotelsRoomRatesDto)
  rates?: PutHotelsRoomRatesDto[];
}