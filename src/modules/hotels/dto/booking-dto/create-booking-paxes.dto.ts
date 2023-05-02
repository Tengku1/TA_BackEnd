import {
  IsNotEmpty,
  IsNumber,
  IsString
} from 'class-validator';

export class CreateBookingPaxesDto {
  @IsNotEmpty()
  @IsNumber()
  roomId: number;

  @IsNotEmpty()
  @IsString()
  type: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  surname: string;
}