import {
  IsNotEmpty,
  IsNumber,
  IsOptional
} from 'class-validator';

export class UpdateHotelConfigurationsDto {
  @IsOptional()
  @IsNumber()
  percentage_fee: number;
}