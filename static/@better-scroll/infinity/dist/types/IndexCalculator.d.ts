export declare const PRE_NUM = 10;
export declare const POST_NUM = 30;
export default class IndexCalculator {
    wrapperHeight: number;
    private tombstoneHeight;
    private lastDirection;
    private lastPos;
    constructor(wrapperHeight: number, tombstoneHeight: number);
    calculate(pos: number, list: Array<any>): {
        start: number;
        end: number;
    };
    private getDirection;
    private calculateIndex;
    resetState(): void;
}
