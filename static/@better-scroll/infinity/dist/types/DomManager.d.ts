import { pListItem } from './DataManager';
import Tombstone from './Tombstone';
export default class DomManager {
    private renderFn;
    private tombstone;
    private content;
    private unusedDom;
    private timers;
    constructor(content: HTMLElement, renderFn: (data: any, div?: HTMLElement) => HTMLElement, tombstone: Tombstone);
    update(list: Array<pListItem>, start: number, end: number): {
        start: number;
        end: number;
        startPos: number;
        startDelta: number;
        endPos: number;
    };
    private collectUnusedDom;
    private createDom;
    private cacheHeight;
    private positionDom;
    private getStartPos;
    removeTombstone(): void;
    setContent(content: HTMLElement): void;
    destroy(): void;
    resetState(): void;
}
