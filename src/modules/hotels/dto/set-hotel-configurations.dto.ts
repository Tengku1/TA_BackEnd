import {
  IsNotEmpty, 
  IsNumber
} from 'class-validator';

export class SetHotelConfigurationsDto {
  @IsNotEmpty()
  @IsNumber()
  percentage_fee: number;
}