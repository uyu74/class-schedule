export default class Tombstone {
    private create;
    private cached;
    width: number;
    height: number;
    private initialed;
    constructor(create: () => HTMLElement);
    static isTombstone(el: HTMLElement): boolean;
    private getSize;
    getOne(): HTMLElement;
    recycle(tombstones: Array<HTMLElement>): Array<HTMLElement>;
    recycleOne(tombstone: HTMLElement): HTMLElement[];
}
