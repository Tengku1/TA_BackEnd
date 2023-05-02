import {
  IsBoolean,
  IsOptional
} from 'class-validator';

export class PutModificationPoliciesDto {
  @IsOptional()
  @IsBoolean()
  creationDate: boolean;

  @IsOptional()
  @IsBoolean()
  status: boolean;
}