import {
  IsNotEmpty,
  IsString
} from 'class-validator';

export class CreateBookingHolderDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  surname: string;
}