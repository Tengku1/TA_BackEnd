import { 
  IsBoolean, 
  IsNotEmpty, 
  IsOptional, 
  IsString 
} from 'class-validator';

export class CreateHotelLocationsDto {
  @IsNotEmpty()
  @IsString()
  name: string;
  
  @IsNotEmpty()
  @IsString()
  country: string;

  @IsNotEmpty()
  @IsString()
  province: string;

  @IsOptional()
  latitude: string = "";

  @IsOptional()
  longitude: string = "";

  @IsOptional()
  area: string;

  @IsOptional()
  unit: string;

  @IsOptional()
  @IsBoolean()
  is_popular: Boolean = true;
}