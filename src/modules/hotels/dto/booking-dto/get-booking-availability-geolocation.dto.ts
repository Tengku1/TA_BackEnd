import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString
} from 'class-validator';

export class GetBookingAvailabilityGeolocationDto {
  @IsNotEmpty()
  @IsNumber()
  latitude: number;

  @IsNotEmpty()
  @IsNumber()
  longitude: number;

  @IsOptional()
  @IsNumber()
  radius: number = 20;

  @IsOptional()
  @IsString()
  unit: string = 'km';
}