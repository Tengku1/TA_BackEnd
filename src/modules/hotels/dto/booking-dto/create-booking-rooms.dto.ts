import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested
} from 'class-validator';
import { CreateBookingPaxesDto } from './create-booking-paxes.dto';

export class CreateBookingRoomsDto {
  @IsOptional()
  @IsString()
  roomCode: string;

  @IsOptional()
  @IsString()
  roomName: string;

  @IsNotEmpty()
  @IsString()
  rateKey: string;

  @IsNotEmpty()
  @ValidateNested({ each: true })
  @IsObject()
  @Type(() => CreateBookingPaxesDto)
  paxes?: CreateBookingPaxesDto[];
}