import {
  IsNotEmpty,
  IsOptional,
  IsString
} from 'class-validator';

export class CreateBookingDeviceDto {
  @IsOptional()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsString()
  ip: string;

  @IsNotEmpty()
  @IsString()
  userAgent: string;
}