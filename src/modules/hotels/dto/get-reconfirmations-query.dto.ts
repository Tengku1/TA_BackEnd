import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  Min
} from 'class-validator';
import { BookingReconfirmationTypes } from '../enum/booking-reconfirmation-types.enum';

export class GetReconfirmationsDto {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  public from: number = 1;
  
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  @Max(10)
  public to: number = 10;

  @IsNotEmpty()
  @IsString()
  start: string;

  @IsNotEmpty()
  @IsString()
  end: string;

  @IsNotEmpty()
  @IsEnum(BookingReconfirmationTypes)
  filterType: BookingReconfirmationTypes[];

  @IsNotEmpty()
  @IsString()
  references: string;
}