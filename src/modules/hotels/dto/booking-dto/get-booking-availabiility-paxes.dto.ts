import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber
} from 'class-validator';
import { BookingAvailabilityTypePaxes } from 'modules/hotels/enum/booking-availability-type-paxes.dto';

export class GetBookingAvailabilityPaxes {
  @IsNotEmpty()
  @IsEnum(BookingAvailabilityTypePaxes)
  type: BookingAvailabilityTypePaxes[];

  @IsNotEmpty()
  @IsNumber()
  age: number;
}