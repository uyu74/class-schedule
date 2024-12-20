import BScroll from '@better-scroll/core';
export declare type PullDownRefreshOptions = Partial<PullDownRefreshConfig> | true;
declare const enum PullDownPhase {
    DEFAULT = 0,
    MOVING = 1,
    FETCHING = 2
}
declare const enum ThresholdBoundary {
    DEFAULT = 0,
    INSIDE = 1,
    OUTSIDE = 2
}
export interface PullDownRefreshConfig {
    threshold: number;
    stop: number;
}
declare module '@better-scroll/core' {
    interface CustomOptions {
        pullDownRefresh?: PullDownRefreshOptions;
    }
    interface CustomAPI {
        pullDownRefresh: PluginAPI;
    }
}
interface PluginAPI {
    finishPullDown(): void;
    openPullDown(config?: PullDownRefreshOptions): void;
    closePullDown(): void;
    autoPullDownRefresh(): void;
}
export default class PullDown implements PluginAPI {
    scroll: BScroll;
    static pluginName: string;
    private hooksFn;
    pulling: PullDownPhase;
    thresholdBoundary: ThresholdBoundary;
    watching: boolean;
    options: PullDownRefreshConfig;
    cachedOriginanMinScrollY: number;
    currentMinScrollY: number;
    constructor(scroll: BScroll);
    private setPulling;
    private setThresholdBoundary;
    private init;
    private handleBScroll;
    private handleOptions;
    private handleHooks;
    private registerHooks;
    private hasMouseWheelPlugin;
    private watch;
    private resetStateBeforeScrollStart;
    private checkLocationOfThresholdBoundary;
    private locateInsideThresholdBoundary;
    private unwatch;
    private checkPullDown;
    private isFetchingStatus;
    private modifyBehaviorYBoundary;
    finishPullDown(): void;
    openPullDown(config?: PullDownRefreshOptions): void;
    closePullDown(): void;
    autoPullDownRefresh(): void;
}
export {};
