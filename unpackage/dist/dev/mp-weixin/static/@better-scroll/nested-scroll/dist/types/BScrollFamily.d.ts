import BScroll from '@better-scroll/core';
import { EventEmitter } from '@better-scroll/shared-utils';
export declare type BScrollFamilyTuple = [BScrollFamily, number];
export default class BScrollFamily {
    static create(scroll: BScroll): BScrollFamily;
    ancestors: BScrollFamilyTuple[];
    descendants: BScrollFamilyTuple[];
    hooksManager: [EventEmitter, string, Function][];
    selfScroll: BScroll;
    analyzed: boolean;
    constructor(scroll: BScroll);
    hasAncestors(bscrollFamily: BScrollFamily): boolean;
    hasDescendants(bscrollFamily: BScrollFamily): boolean;
    addAncestor(bscrollFamily: BScrollFamily, distance: number): void;
    addDescendant(bscrollFamily: BScrollFamily, distance: number): void;
    removeAncestor(bscrollFamily: BScrollFamily): BScrollFamilyTuple[] | undefined;
    removeDescendant(bscrollFamily: BScrollFamily): BScrollFamilyTuple[] | undefined;
    registerHooks(hook: EventEmitter, eventType: string, handler: Function): void;
    setAnalyzed(flag?: boolean): void;
    purge(): void;
}
