import BScroll from '@better-scroll/core';
import Indicator from './indicator';
import { IndicatorOptions } from './types';
declare module '@better-scroll/core' {
    interface CustomOptions {
        indicators?: IndicatorOptions[];
    }
}
export default class Indicators {
    scroll: BScroll;
    static pluginName: string;
    options: IndicatorOptions[];
    indicators: Indicator[];
    constructor(scroll: BScroll);
    private handleOptions;
    private createIndicators;
    private handleHooks;
}
