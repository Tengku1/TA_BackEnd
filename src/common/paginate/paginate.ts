import { Repository, FindConditions, SelectQueryBuilder, Like, ObjectLiteral, Raw } from 'typeorm'
import { ServiceUnavailableException } from '@nestjs/common'
import { PaginateRequest } from './paginate.request'
import { Column, Order, SortBy } from './paginate.type';
import { Paginated } from './paginated.dto';
export interface PaginateConfig<T> {
    itemKey: Column<T>
    sortableColumns: Column<T>[]
    searchableColumns?: Column<T>[]
    maxLimit?: number
    defaultSortBy?: SortBy<T>
    defaultLimit?: number
    where?: FindConditions<T>
    queryBuilder?: SelectQueryBuilder<T>,
    displayCount?: boolean
}

export async function paginate<T>(
    query: PaginateRequest,
    repo: Repository<T> | SelectQueryBuilder<T>,
    config: PaginateConfig<T>
): Promise<Paginated<T>> {
    let page = query.page || 1
    const limit = Math.min(query.limit || config.defaultLimit || 10, config.maxLimit || 100);
    const sortBy = [] as SortBy<T>
    const search = query.search

    function isEntityKey(sortableColumns: Column<T>[], column: string): column is Column<T> {
        return !!sortableColumns.find((c) => c === column)
    }

    const { sortableColumns } = config
    if (config.sortableColumns.length < 1) throw new ServiceUnavailableException()

    if (query.sort) {
        let _sortBy = [];
        _sortBy.push([ query.sort, query.order ] as [string, string]);

        for (const order of _sortBy) {
            if (isEntityKey(sortableColumns, order[0]) && ['ASC', 'DESC'].includes(order[1])) {
                sortBy.push(order as Order<T>)
            }
        }
    }
    if (!sortBy.length) {
        sortBy.push(...(config.defaultSortBy || [[sortableColumns[0], 'ASC']]))
    }

    if (page < 1) page = 1

    let [items, totalItems]: [T[], number] = [[], 0]

    let queryBuilder: SelectQueryBuilder<T>

    if (repo instanceof Repository) {
        queryBuilder = repo
            .createQueryBuilder('e')
            .take(limit)
            .skip((page - 1) * limit)

        for (const order of sortBy) {
            queryBuilder.addOrderBy('e.' + order[0], order[1])
        }
    } else {
        queryBuilder = repo.take(limit).skip((page - 1) * limit)

        for (const order of sortBy) {
            queryBuilder.addOrderBy(repo.alias + '.' + order[0], order[1])
        }
    }

    const where: ObjectLiteral[] = []
    if (search && config.searchableColumns) {
        for (const column of config.searchableColumns) {
            //where.push({ [column]: Like(`%${search}%`), ...config.where })
            where.push({ [column]: Raw(alias => `${alias} ILIKE '%${search}%'`), ...config.where })
        }
    }

    if (where.length > 0){
        queryBuilder.where(where.length ? where : config.where || {});
    }

    ;[items, totalItems] = await queryBuilder.getManyAndCount()

    let totalPages = totalItems / limit
    if (totalItems % limit) totalPages = Math.ceil(totalPages)

    const results: Paginated<T> = {
        data: items,
        meta: {
            itemKey: config.itemKey,
            itemsPerPage: limit,
            totalItems,
            currentPage: page,
            totalPages: totalPages,
            sortBy,
            search,
        }
    }

    return Object.assign(new Paginated<T>(), results)
}
