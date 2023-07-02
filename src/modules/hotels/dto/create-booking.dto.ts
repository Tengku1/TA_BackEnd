import {
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class CreateBookingDto {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsString()
  bookId: string;
}