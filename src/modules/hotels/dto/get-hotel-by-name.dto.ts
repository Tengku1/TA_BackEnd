import {
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class GetHotelByNameDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}