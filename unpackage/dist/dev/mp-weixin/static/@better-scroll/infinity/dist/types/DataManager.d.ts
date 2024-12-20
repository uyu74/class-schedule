declare class ListItem {
    data: any | null;
    dom: HTMLElement | null;
    tombstone: HTMLElement | null;
    width: number;
    height: number;
    pos: number;
    constructor();
}
export declare type pListItem = Partial<ListItem>;
export default class DataManager {
    private fetchFn;
    private onFetchFinish;
    loadedNum: number;
    private fetching;
    private hasMore;
    private list;
    constructor(list: Array<pListItem>, fetchFn: (len: number) => Promise<Array<any> | boolean>, onFetchFinish: (list: Array<pListItem>, hasMore: boolean) => number);
    update(end: number): Promise<void>;
    add(data: Array<any>): Array<pListItem>;
    addEmptyData(len: number): Array<pListItem>;
    fetch(len: number): Promise<Array<any> | boolean>;
    checkToFetch(end: number): Promise<void>;
    getList(): Partial<ListItem>[];
    resetState(): void;
}
export {};
