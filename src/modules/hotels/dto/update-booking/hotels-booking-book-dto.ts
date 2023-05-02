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
import { PutHotelsBookingHotelDto } from './hotels-booking-hotel-dto';
import { PutHotelsBookingModificationPoliciesDto } from './hotels-booking-modification-dto';

export class PutHotelsBookingBookDto {
  @IsOptional()
  @IsString()
  creationDate: string;

  @IsOptional()
  @IsString()
  status: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @IsObject()
  @Type(() => PutHotelsBookingModificationPoliciesDto)
  modificationPolicies: PutHotelsBookingModificationPoliciesDto[];

  @IsOptional()
  @ValidateNested({ each: true })
  @IsObject()
  @Type(() => CreateBookingHolderDto)
  holder?: CreateBookingHolderDto[];

  @IsOptional()
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