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
import { CreateBookingHolderDto } from '../booking-dto/create-booking-holder.dto';
import { ModificationPoliciesDto } from './hotels-room-rates-cancellation-dto';
import { PutHotelsBookingHotelDto } from './hotels-booking-hotel-dto';

export class PutHotelsBookingModificationPoliciesDto {
  @IsOptional()
  @IsString()
  creationDate: string;

  @IsOptional()
  @IsString()
  status: string;

  @IsNotEmpty()
  @ValidateNested({ each: true })
  @IsObject()
  @Type(() => ModificationPoliciesDto)
  modificationPolicies: ModificationPoliciesDto[];

  @IsNotEmpty()
  @ValidateNested({ each: true })
  @IsObject()
  @Type(() => CreateBookingHolderDto)
  holder?: CreateBookingHolderDto[];

  @IsNotEmpty()
  @ValidateNested({ each: true })
  @IsArrayOfObjects()
  @Type(() => PutHotelsBookingHotelDto)
  hotel?: PutHotelsBookingHotelDto[];

  @IsOptional()
  @IsNumber()
  totalNet: number;

  @IsOptional()
  @IsNumber()
  pendingAmount: number;

  @IsOptional()
  @IsString()
  currency: string;
}