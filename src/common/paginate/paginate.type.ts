export type Column<T> = Extract<keyof T, string>
export type Order<T> = [Column<T>, 'ASC' | 'DESC']
export type SortBy<T> = Order<T>[]