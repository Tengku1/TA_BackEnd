import {
  IsNotEmpty,
  IsString
} from 'class-validator';

export class GetBookingAvailabilityStayDto {
  @IsNotEmpty()
  @IsString()
  checkIn: string;

  @IsNotEmpty()
  @IsString()
  checkOut: string;
}