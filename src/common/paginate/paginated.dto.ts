import { ApiProperty } from "@nestjs/swagger"
import { SortBy } from "./paginate.type"


export class Paginated<T> {
    @ApiProperty({ isArray: true })
    data: T[]
    meta: {
        itemKey: string
        itemsPerPage: number
        totalItems?: number
        currentPage: number
        totalPages?: number
        sortBy: SortBy<T>
        search: string
    }
}