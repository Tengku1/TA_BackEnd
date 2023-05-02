import {
  IsOptional,
  IsString,
} from 'class-validator';

export class ModificationPoliciesDto {
  @IsOptional()
  @IsString()
  rateClass: string;

  @IsOptional()
  @IsString()
  net: string;
}