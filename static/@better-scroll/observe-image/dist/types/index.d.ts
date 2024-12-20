import BScroll from '@better-scroll/core';
import { EventRegister } from '@better-scroll/shared-utils';
export declare type ObserveImageOptions = Partial<ObserveImageConfig> | true;
export interface ObserveImageConfig {
    debounceTime: number;
}
declare module '@better-scroll/core' {
    interface CustomOptions {
        observeImage?: ObserveImageOptions;
    }
}
export default class ObserveImage {
    scroll: BScroll;
    static pluginName: string;
    imageLoadEventRegister: EventRegister;
    imageErrorEventRegister: EventRegister;
    refreshTimer: number;
    options: ObserveImageConfig;
    constructor(scroll: BScroll);
    init(): void;
    private handleOptions;
    private bindEventsToWrapper;
    private load;
}
