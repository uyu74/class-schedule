import BScroll from '@better-scroll/core';
import { EventRegister, EventEmitter } from '@better-scroll/shared-utils';
import Indicator from './indicator';
interface EventHandlerOptions {
    disableMouse: boolean;
    disableTouch: boolean;
}
export default class EventHandler {
    indicator: Indicator;
    options: EventHandlerOptions;
    startEventRegister: EventRegister;
    moveEventRegister: EventRegister;
    endEventRegister: EventRegister;
    initiated: boolean;
    lastPoint: number;
    scroll: BScroll;
    hooks: EventEmitter;
    constructor(indicator: Indicator, options: EventHandlerOptions);
    private registerEvents;
    private BScrollIsDisabled;
    private start;
    private move;
    private end;
    destroy(): void;
}
export {};
