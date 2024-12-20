import BScroll, { TranslaterPoint } from '@better-scroll/core';
import { EventEmitter, EventRegister } from '@better-scroll/shared-utils';
import EventHandler from './event-handler';
export declare const enum IndicatorDirection {
    Horizontal = "horizontal",
    Vertical = "vertical"
}
export declare const enum OffsetType {
    Step = "step",
    Point = "clickedPoint"
}
export interface IndicatorOptions {
    wrapper: HTMLElement;
    direction: IndicatorDirection;
    fade: boolean;
    fadeInTime: number;
    fadeOutTime: number;
    interactive: boolean;
    minSize: number;
    isCustom: boolean;
    scrollbarTrackClickable: boolean;
    scrollbarTrackOffsetType: OffsetType;
    scrollbarTrackOffsetTime: number;
}
interface KeysMap {
    hasScroll: 'hasVerticalScroll' | 'hasHorizontalScroll';
    size: 'height' | 'width';
    wrapperSize: 'clientHeight' | 'clientWidth';
    scrollerSize: 'scrollerHeight' | 'scrollerWidth';
    maxScrollPos: 'maxScrollY' | 'maxScrollX';
    pos: 'y' | 'x';
    point: 'pageX' | 'pageY';
    translateProperty: 'translateY' | 'translateX';
    domRect: 'top' | 'left';
}
interface ScrollInfo {
    maxScrollPos: number;
    minScrollPos: number;
    sizeRatio: number;
    baseSize: number;
}
export default class Indicator {
    scroll: BScroll;
    options: IndicatorOptions;
    wrapper: HTMLElement;
    wrapperRect: DOMRect;
    indicatorEl: HTMLElement;
    direction: IndicatorDirection;
    scrollInfo: ScrollInfo;
    currentPos: number;
    moved: boolean;
    startTime: number;
    keysMap: KeysMap;
    eventHandler: EventHandler;
    clickEventRegister: EventRegister;
    hooksFn: [EventEmitter, string, Function][];
    constructor(scroll: BScroll, options: IndicatorOptions);
    private handleFade;
    private handleHooks;
    private registerHooks;
    private bindClick;
    private handleClick;
    private calculateclickOffsetPos;
    getKeysMap(): KeysMap;
    fade(visible?: boolean): void;
    refresh(): void;
    transitionTime(time?: number): void;
    transitionTimingFunction(easing: string): void;
    private canScroll;
    private refreshScrollInfo;
    updatePosition(point: TranslaterPoint): void;
    private caculatePosAndSize;
    private refreshStyle;
    startHandler(): void;
    moveHandler(delta: number): void;
    endHandler(): void;
    private indicatorNotMoved;
    private syncBScroll;
    private newPos;
    destroy(): void;
}
export {};
