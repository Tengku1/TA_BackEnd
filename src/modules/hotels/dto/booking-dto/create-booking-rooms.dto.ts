import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  ValidateNested
} from 'class-validator';
import { IsArrayOfObjects } from 'decorators/validators.decorator';
import { CreateBookingPaxesDto } from './create-booking-paxes.dto';

export class CreateBookingRoomsDto {
  @IsNotEmpty()
  @IsString()
  rateKey: string;

  @IsNotEmpty()
  @ValidateNested({ each: true })
  @IsArrayOfObjects()
  @Type(() => CreateBookingPaxesDto)
  paxes?: CreateBookingPaxesDto[];
}