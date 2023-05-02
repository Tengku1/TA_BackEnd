import {
  IsArray,
  IsNotEmpty,
  IsNumber,
} from 'class-validator';

export class GetByHotelCodeDto {
  @IsNotEmpty()
  @IsArray()
  @IsNumber({},{ each: true })
  hotel: number[];
}