import { Type } from 'class-transformer';
import {
  IsNumber,
  Min
} from 'class-validator';

export class PaginationQuery {
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  public limit: number = 10;
  
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  public page: number = 1;
}