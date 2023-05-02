export class LoadMoreMeta {
    itemKey: string;
    hasNext: boolean;
    nextCursor: string;
    previousCursor: string
}

export class LoadMoreResponse {
    data: any[];
    meta: LoadMoreMeta;
}