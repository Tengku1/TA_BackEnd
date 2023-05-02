import {
  IsOptional,
  IsString,
} from 'class-validator';

export class CancellationPoliciesDto {
  @IsOptional()
  @IsString()
  rateClass: string;

  @IsOptional()
  @IsString()
  net: string;
}