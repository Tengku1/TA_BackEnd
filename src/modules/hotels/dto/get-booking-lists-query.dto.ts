import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsString,
  Min
} from 'class-validator';

export class GetBookingListsQuery {
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  public limit: number = 10;
  
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  public page: number = 1;

  @ApiProperty({
    required: false
  })
  @IsOptional()
  @IsString()
  status: string;

  @ApiProperty({
    required: false
  })
  @IsOptional()
  @IsString()
  start: string;
  
  @ApiProperty({
    required: false
  })
  @IsOptional()
  @IsString()
  end: string;
}