import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString
} from 'class-validator';
import HotelbedsLanguage from '../enum/hotelbeds-language.enum';

export class GetCheckRatesHotelsDto {
  @IsNotEmpty()
  @IsString()
  rateKey: string;

  @ApiProperty({ enum: HotelbedsLanguage })
  @IsOptional()
  @IsEnum(HotelbedsLanguage)
  language: HotelbedsLanguage = HotelbedsLanguage.ENG;
}