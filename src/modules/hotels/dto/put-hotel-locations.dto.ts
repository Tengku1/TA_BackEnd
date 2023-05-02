import { 
  IsBoolean,
  IsOptional, 
  IsString 
} from 'class-validator';

export class PutHotelLocationsDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  country: string;

  @IsOptional()
  @IsString()
  province: string;

  @IsOptional()
  latitude: string = "";

  @IsOptional()
  longitude: string = "";

  @IsOptional()
  area: string = "";

  @IsOptional()
  unit: string = "";

  @IsOptional()
  @IsBoolean()
  is_popular: Boolean = true;
}