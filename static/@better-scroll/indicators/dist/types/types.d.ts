export declare type Ratio = number | RatioOfDirection;
export declare type RatioOfDirection = {
    x: number;
    y: number;
};
export interface IndicatorOptions {
    interactive?: boolean;
    ratio?: Ratio;
    relationElementHandleElementIndex?: number;
    relationElement: HTMLElement;
}
export declare const enum Direction {
    Vertical = "vertical",
    Horizontal = "horizontal"
}
export declare type Postion = {
    x: number;
    y: number;
};
export declare const enum ValueSign {
    Positive = -1,
    NotPositive = 1
}
