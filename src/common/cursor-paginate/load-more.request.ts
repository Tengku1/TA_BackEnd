import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, Max, Min } from 'class-validator';
import { OrderEnum } from '../paginate';

export class LoadMoreRequest {
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Max(50)
    @Min(1)
    limit?: number = 5;

    @IsOptional()
    @Type(() => String)
    cursor?: string;

    @IsOptional()
    @Type(() => String)
    sort?: string = 'created_at';

    @IsEnum(OrderEnum)
    @IsOptional()
    order?: OrderEnum = OrderEnum.DESC;
}