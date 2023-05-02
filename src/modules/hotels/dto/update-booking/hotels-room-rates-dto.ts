import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { IsArrayOfObjects } from 'decorators/validators.decorator';
import { CancellationPoliciesDto } from '../cancellation-policies.dto';

export class PutHotelsRoomRatesDto {
  @IsOptional()
  @IsString()
  rateClass: string;

  @IsOptional()
  @IsString()
  net: string;

  @IsOptional()
  @IsString()
  rateComments: string;

  @IsOptional()
  @IsString()
  paymentType: string;

  @IsOptional()
  @IsString()
  packaging: string;

  @IsOptional()
  @IsString()
  boardCode: string;

  @IsOptional()
  @IsString()
  boardName: string;

  @IsNotEmpty()
  @ValidateNested({ each: true })
  @IsArrayOfObjects()
  @Type(() => CancellationPoliciesDto)
  cancellationPolicies?: CancellationPoliciesDto[];

  @IsOptional()
  @IsNumber()
  rooms: number;

  @IsOptional()
  @IsNumber()
  adults: number;

  @IsOptional()
  @IsNumber()
  children: number;
}