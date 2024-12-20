import BScroll from '@better-scroll/core';
import BScrollFamily from './BScrollFamily';
export declare const DEFAUL_GROUP_ID = "INTERNAL_NESTED_SCROLL";
export declare type NestedScrollGroupId = string | number;
export interface NestedScrollConfig {
    groupId: NestedScrollGroupId;
}
export declare type NestedScrollOptions = NestedScrollConfig | true;
declare module '@better-scroll/core' {
    interface CustomOptions {
        nestedScroll?: NestedScrollOptions;
    }
    interface CustomAPI {
        nestedScroll: PluginAPI;
    }
}
interface PluginAPI {
    purgeNestedScroll(groupId: NestedScrollGroupId): void;
}
interface NestedScrollInstancesMap {
    [key: string]: NestedScroll;
    [index: number]: NestedScroll;
}
export default class NestedScroll implements PluginAPI {
    static pluginName: string;
    static instancesMap: NestedScrollInstancesMap;
    store: BScrollFamily[];
    options: NestedScrollConfig;
    private hooksFn;
    constructor(scroll: BScroll);
    static getAllNestedScrolls(): NestedScroll[];
    static purgeAllNestedScrolls(): void;
    private handleOptions;
    private init;
    private handleHooks;
    deleteScroll(scroll: BScroll): void;
    addBScroll(scroll: BScroll): void;
    private buildBScrollGraph;
    private analyzeBScrollGraph;
    private ensureEventInvokeSequence;
    private registerHooks;
    purgeNestedScroll(): void;
}
export {};
