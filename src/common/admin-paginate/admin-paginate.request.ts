import { Transform, Type } from 'class-transformer';
import { IsArray, IsEnum, IsNumber, IsObject, IsOptional, Max, Min } from 'class-validator';
import { OrderEnum } from '../paginate';

export class AdminPaginateRequest {
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Max(1000)
    @Min(1)
    limit?: number = 1000;

    @IsOptional()
    @Type(() => Number)
    @Transform(({ value }) => {
        return value < 1 ? 1 : value;
    })
    page?: number = 1;

    @IsOptional()
    @Transform(({ value }) => {
        try {
            return JSON.parse(value)
        } catch (error) {
            return {};
        }
    })
    @IsObject()
    sort?: any = {};

    @IsOptional()
    @Transform(({ value }) => {
        try {
            return JSON.parse(value);
        } catch (error) {
            return {};
        }
    })
    @IsObject()
    filter?: any = {};

    @IsOptional()
    q?: string;

    @IsOptional()
    fields?: string[];

    @IsOptional()
    id?: any;

    get hasSort() {
        if (!this.sort)
            return false;
        if (Object.keys(this.sort).length === 0)
            return false;
        return true;
    }
    get hasFilter() {
        if (!this.filter)
            return false;
        if (Object.keys(this.filter).length === 0)
            return false;
        return true;
    }
    get hasFilterIds() {
        if (this.filterIds.length > 0)
            return true;

        return false;
    }
    get where() {
        if (this.hasFilterIds)
            return this.filter.id;

        return this.filter;
    }
    get filterIds(): Array<any> {
        if (!this.hasFilter)
            return [];

        if (!this.filter.id)
            return [];

        if (Array.isArray(this.filter.id))
            return this.filter.id.map(val => {
                if (val.id)
                    return val.id;

                return val;
            });

        return [this.filter.id];
    }
}