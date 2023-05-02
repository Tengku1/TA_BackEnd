import {
  IsOptional,
  IsString,
} from 'class-validator';

export class PutHotelsBookingHotelSupplierDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  vatNumber: string;
}