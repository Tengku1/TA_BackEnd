import {
  IsInt,
  IsOptional,
} from 'class-validator';

export class GetLocationsHotelDto {
  @IsOptional()
  @IsInt()
  page: number = 1;

  @IsOptional()
  @IsInt()
  limit: number = 10;

  @IsOptional()
  q: string;

  @IsOptional()
  filter: string;
}