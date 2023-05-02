import {
  IsNotEmpty,
  IsNumber,
  IsOptional
} from 'class-validator';

export class GetBookingAvailabilityFilterDto {
  @IsNotEmpty()
  @IsNumber()
  minRate: number = 0;

  @IsNotEmpty()
  @IsNumber()
  maxRate: number = 999999999999;

  @IsOptional()
  @IsNumber()
  minCategory: number = 1;

  @IsOptional()
  @IsNumber()
  maxCategory: number = 5;
}