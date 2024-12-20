import BScroll from '@better-scroll/core';
import { ApplyOrder, EaseItem } from '@better-scroll/shared-utils';
declare type PositionX = number | 'left' | 'right' | 'center';
declare type PositionY = number | 'top' | 'bottom' | 'center';
declare module '@better-scroll/core' {
    interface CustomOptions {
        movable?: true;
    }
    interface CustomAPI {
        movable: PluginAPI;
    }
}
interface PluginAPI {
    putAt(x: PositionX, y: PositionY, time?: number, easing?: EaseItem): void;
}
export default class Movable implements PluginAPI {
    scroll: BScroll;
    static pluginName: string;
    static applyOrder: ApplyOrder;
    private hooksFn;
    constructor(scroll: BScroll);
    private handleBScroll;
    private handleHooks;
    putAt(x: PositionX, y: PositionY, time?: number, easing?: EaseItem): void;
    private resolvePostion;
    destroy(): void;
    private registerHooks;
}
export {};
