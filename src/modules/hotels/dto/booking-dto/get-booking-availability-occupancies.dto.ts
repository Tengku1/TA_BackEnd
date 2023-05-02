import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  ValidateIf,
  ValidateNested
} from 'class-validator';
import { IsArrayOfObjects } from 'decorators/validators.decorator';
import { GetBookingAvailabilityPaxes } from './get-booking-availabiility-paxes.dto';

export class GetBookingAvailabilityOccupanciesDto {
  @IsNotEmpty()
  @IsNumber()
  rooms: number;

  @IsNotEmpty()
  @IsNumber()
  adults: number;

  @IsNotEmpty()
  @IsNumber()
  children: number;

  @IsOptional()
  @ValidateIf(o => o.children > 0)
  @ValidateNested({ each: true })
  @IsArrayOfObjects()
  @Type(() => GetBookingAvailabilityPaxes)
  paxes: GetBookingAvailabilityPaxes[];
}