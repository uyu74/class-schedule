import BScroll from '@better-scroll/core';
export interface InfinityOptions {
    fetch: (count: number) => Promise<Array<any> | false>;
    render: (item: any, div?: HTMLElement) => HTMLElement;
    createTombstone: () => HTMLElement;
}
declare module '@better-scroll/core' {
    interface CustomOptions {
        infinity?: InfinityOptions;
    }
}
export default class InfinityScroll {
    scroll: BScroll;
    static pluginName: string;
    start: number;
    end: number;
    options: InfinityOptions;
    private tombstone;
    private domManager;
    private dataManager;
    private indexCalculator;
    constructor(scroll: BScroll);
    init(): void;
    private modifyBoundary;
    private handleOptions;
    update(pos: {
        y: number;
    }): void;
    private onFetchFinish;
    private updateDom;
    destroy(): void;
}
