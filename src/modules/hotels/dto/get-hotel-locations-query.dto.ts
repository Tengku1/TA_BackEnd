import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min
} from 'class-validator';

export class GetHotelLocationsQuery {
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  public limit: number = 10;
  
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  public page: number = 1;

  @IsOptional()
  @IsString()
  q: string = "";

  @IsOptional()
  @IsString()
  isPopular: string;
}