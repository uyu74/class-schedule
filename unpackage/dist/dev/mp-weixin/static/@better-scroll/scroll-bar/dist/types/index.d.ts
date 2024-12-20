import BScroll from '@better-scroll/core';
import Indicator, { OffsetType } from './indicator';
export declare type ScrollbarOptions = Partial<ScrollbarConfig> | true;
export interface ScrollbarConfig {
    fade: boolean;
    fadeInTime: number;
    fadeOutTime: number;
    interactive: boolean;
    customElements: HTMLElement[];
    minSize: number;
    scrollbarTrackClickable: boolean;
    scrollbarTrackOffsetType: OffsetType;
    scrollbarTrackOffsetTime: number;
}
declare module '@better-scroll/core' {
    interface CustomOptions {
        scrollbar?: ScrollbarOptions;
    }
}
export default class ScrollBar {
    scroll: BScroll;
    static pluginName: string;
    options: ScrollbarConfig;
    indicators: Indicator[];
    constructor(scroll: BScroll);
    private handleHooks;
    private handleOptions;
    private createIndicators;
    private createScrollbarElement;
}
