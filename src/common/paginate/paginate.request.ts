import { ApiParam, ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, Max, Min } from 'class-validator';
import { OrderEnum } from './order.enum';

export class PaginateRequest {
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Max(50)
    @Min(1)
    limit?: number = 5;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    page?: number = 1;

    @ApiProperty({
        default: 'created_at',
        description: 'nama kolom'
    })
    @IsOptional()
    @Type(() => String)
    sort?: string;

    @ApiPropertyOptional({
        enum: OrderEnum,
        default: OrderEnum.ASC,
    })
    @IsEnum(OrderEnum)
    @IsOptional()
    order?: OrderEnum = OrderEnum.ASC;

    @IsOptional()
    @Type(() => String)
    search?: string;
}