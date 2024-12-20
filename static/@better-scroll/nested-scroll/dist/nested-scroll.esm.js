/*!
 * better-scroll / nested-scroll
 * (c) 2016-2023 ustbhuangyi
 * Released under the MIT License.
 */
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __spreadArrays() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
}

function warn(msg) {
    console.error("[BScroll warn]: " + msg);
}

// ssr support
var inBrowser = typeof window !== 'undefined';
var ua = inBrowser && navigator.userAgent.toLowerCase();
!!(ua && /wechatdevtools/.test(ua));
ua && ua.indexOf('android') > 0;
/* istanbul ignore next */
((function () {
    if (typeof ua === 'string') {
        var regex = /os (\d\d?_\d(_\d)?)/;
        var matches = regex.exec(ua);
        if (!matches)
            return false;
        var parts = matches[1].split('_').map(function (item) {
            return parseInt(item, 10);
        });
        // ios version >= 13.4 issue 982
        return !!(parts[0] === 13 && parts[1] >= 4);
    }
    return false;
}))();
/* istanbul ignore next */
var supportsPassive = false;
/* istanbul ignore next */
if (inBrowser) {
    var EventName = 'test-passive';
    try {
        var opts = {};
        Object.defineProperty(opts, 'passive', {
            get: function () {
                supportsPassive = true;
            },
        }); // https://github.com/facebook/flow/issues/285
        window.addEventListener(EventName, function () { }, opts);
    }
    catch (e) { }
}

var extend = function (target, source) {
    for (var key in source) {
        target[key] = source[key];
    }
    return target;
};
function findIndex(ary, fn) {
    if (ary.findIndex) {
        return ary.findIndex(fn);
    }
    var index = -1;
    ary.some(function (item, i, ary) {
        var ret = fn(item, i, ary);
        if (ret) {
            index = i;
            return ret;
        }
    });
    return index;
}

var elementStyle = (inBrowser &&
    document.createElement('div').style);
var vendor = (function () {
    /* istanbul ignore if  */
    if (!inBrowser) {
        return false;
    }
    var transformNames = [
        {
            key: 'standard',
            value: 'transform',
        },
        {
            key: 'webkit',
            value: 'webkitTransform',
        },
        {
            key: 'Moz',
            value: 'MozTransform',
        },
        {
            key: 'O',
            value: 'OTransform',
        },
        {
            key: 'ms',
            value: 'msTransform',
        },
    ];
    for (var _i = 0, transformNames_1 = transformNames; _i < transformNames_1.length; _i++) {
        var obj = transformNames_1[_i];
        if (elementStyle[obj.value] !== undefined) {
            return obj.key;
        }
    }
    /* istanbul ignore next  */
    return false;
})();
/* istanbul ignore next  */
function prefixStyle(style) {
    if (vendor === false) {
        return style;
    }
    if (vendor === 'standard') {
        if (style === 'transitionEnd') {
            return 'transitionend';
        }
        return style;
    }
    return vendor + style.charAt(0).toUpperCase() + style.substr(1);
}
vendor && vendor !== 'standard' ? '-' + vendor.toLowerCase() + '-' : '';
var transform = prefixStyle('transform');
var transition = prefixStyle('transition');
inBrowser && prefixStyle('perspective') in elementStyle;
({
    transform: transform,
    transition: transition,
    transitionTimingFunction: prefixStyle('transitionTimingFunction'),
    transitionDuration: prefixStyle('transitionDuration'),
    transitionDelay: prefixStyle('transitionDelay'),
    transformOrigin: prefixStyle('transformOrigin'),
    transitionEnd: prefixStyle('transitionEnd'),
    transitionProperty: prefixStyle('transitionProperty'),
});

var BScrollFamily = /** @class */ (function () {
    function BScrollFamily(scroll) {
        this.ancestors = [];
        this.descendants = [];
        this.hooksManager = [];
        this.analyzed = false;
        this.selfScroll = scroll;
    }
    BScrollFamily.create = function (scroll) {
        return new BScrollFamily(scroll);
    };
    BScrollFamily.prototype.hasAncestors = function (bscrollFamily) {
        var index = findIndex(this.ancestors, function (_a) {
            var item = _a[0];
            return item === bscrollFamily;
        });
        return index > -1;
    };
    BScrollFamily.prototype.hasDescendants = function (bscrollFamily) {
        var index = findIndex(this.descendants, function (_a) {
            var item = _a[0];
            return item === bscrollFamily;
        });
        return index > -1;
    };
    BScrollFamily.prototype.addAncestor = function (bscrollFamily, distance) {
        var ancestors = this.ancestors;
        ancestors.push([bscrollFamily, distance]);
        // by ascend
        ancestors.sort(function (a, b) {
            return a[1] - b[1];
        });
    };
    BScrollFamily.prototype.addDescendant = function (bscrollFamily, distance) {
        var descendants = this.descendants;
        descendants.push([bscrollFamily, distance]);
        // by ascend
        descendants.sort(function (a, b) {
            return a[1] - b[1];
        });
    };
    BScrollFamily.prototype.removeAncestor = function (bscrollFamily) {
        var ancestors = this.ancestors;
        if (ancestors.length) {
            var index = findIndex(this.ancestors, function (_a) {
                var item = _a[0];
                return item === bscrollFamily;
            });
            if (index > -1) {
                return ancestors.splice(index, 1);
            }
        }
    };
    BScrollFamily.prototype.removeDescendant = function (bscrollFamily) {
        var descendants = this.descendants;
        if (descendants.length) {
            var index = findIndex(this.descendants, function (_a) {
                var item = _a[0];
                return item === bscrollFamily;
            });
            if (index > -1) {
                return descendants.splice(index, 1);
            }
        }
    };
    BScrollFamily.prototype.registerHooks = function (hook, eventType, handler) {
        hook.on(eventType, handler);
        this.hooksManager.push([hook, eventType, handler]);
    };
    BScrollFamily.prototype.setAnalyzed = function (flag) {
        if (flag === void 0) { flag = false; }
        this.analyzed = flag;
    };
    BScrollFamily.prototype.purge = function () {
        var _this = this;
        // remove self from graph
        this.ancestors.forEach(function (_a) {
            var bscrollFamily = _a[0];
            bscrollFamily.removeDescendant(_this);
        });
        this.descendants.forEach(function (_a) {
            var bscrollFamily = _a[0];
            bscrollFamily.removeAncestor(_this);
        });
        // remove all hook handlers
        this.hooksManager.forEach(function (_a) {
            var hooks = _a[0], eventType = _a[1], handler = _a[2];
            hooks.off(eventType, handler);
        });
        this.hooksManager = [];
    };
    return BScrollFamily;
}());

var sourcePrefix = 'plugins.nestedScroll';
var propertiesMap = [
    {
        key: 'purgeNestedScroll',
        name: 'purgeNestedScroll',
    },
];
var propertiesConfig = propertiesMap.map(function (item) {
    return {
        key: item.key,
        sourceKey: sourcePrefix + "." + item.name,
    };
});

var DEFAUL_GROUP_ID = 'INTERNAL_NESTED_SCROLL';
var forceScrollStopHandler = function (scrolls) {
    scrolls.forEach(function (scroll) {
        if (scroll.pending) {
            scroll.stop();
            scroll.resetPosition();
        }
    });
};
var enableScrollHander = function (scrolls) {
    scrolls.forEach(function (scroll) {
        scroll.enable();
    });
};
var disableScrollHander = function (scrolls, currentScroll) {
    scrolls.forEach(function (scroll) {
        if (scroll.hasHorizontalScroll === currentScroll.hasHorizontalScroll ||
            scroll.hasVerticalScroll === currentScroll.hasVerticalScroll) {
            scroll.disable();
        }
    });
};
var syncTouchstartData = function (scrolls) {
    scrolls.forEach(function (scroll) {
        var _a = scroll.scroller, actions = _a.actions, scrollBehaviorX = _a.scrollBehaviorX, scrollBehaviorY = _a.scrollBehaviorY;
        // prevent click triggering many times
        actions.fingerMoved = true;
        actions.contentMoved = false;
        actions.directionLockAction.reset();
        scrollBehaviorX.start();
        scrollBehaviorY.start();
        scrollBehaviorX.resetStartPos();
        scrollBehaviorY.resetStartPos();
        actions.startTime = +new Date();
    });
};
var isOutOfBoundary = function (scroll) {
    var hasHorizontalScroll = scroll.hasHorizontalScroll, hasVerticalScroll = scroll.hasVerticalScroll, x = scroll.x, y = scroll.y, minScrollX = scroll.minScrollX, maxScrollX = scroll.maxScrollX, minScrollY = scroll.minScrollY, maxScrollY = scroll.maxScrollY, movingDirectionX = scroll.movingDirectionX, movingDirectionY = scroll.movingDirectionY;
    var ret = false;
    var outOfLeftBoundary = x >= minScrollX && movingDirectionX === -1 /* Negative */;
    var outOfRightBoundary = x <= maxScrollX && movingDirectionX === 1 /* Positive */;
    var outOfTopBoundary = y >= minScrollY && movingDirectionY === -1 /* Negative */;
    var outOfBottomBoundary = y <= maxScrollY && movingDirectionY === 1 /* Positive */;
    if (hasVerticalScroll) {
        ret = outOfTopBoundary || outOfBottomBoundary;
    }
    else if (hasHorizontalScroll) {
        ret = outOfLeftBoundary || outOfRightBoundary;
    }
    return ret;
};
var isResettingPosition = function (scroll) {
    var hasHorizontalScroll = scroll.hasHorizontalScroll, hasVerticalScroll = scroll.hasVerticalScroll, x = scroll.x, y = scroll.y, minScrollX = scroll.minScrollX, maxScrollX = scroll.maxScrollX, minScrollY = scroll.minScrollY, maxScrollY = scroll.maxScrollY;
    var ret = false;
    var outOfLeftBoundary = x > minScrollX;
    var outOfRightBoundary = x < maxScrollX;
    var outOfTopBoundary = y > minScrollY;
    var outOfBottomBoundary = y < maxScrollY;
    if (hasVerticalScroll) {
        ret = outOfTopBoundary || outOfBottomBoundary;
    }
    else if (hasHorizontalScroll) {
        ret = outOfLeftBoundary || outOfRightBoundary;
    }
    return ret;
};
var resetPositionHandler = function (scroll) {
    scroll.scroller.reflow();
    scroll.resetPosition(0 /* Immediately */);
};
var calculateDistance = function (childNode, parentNode) {
    var distance = 0;
    var parent = childNode.parentNode;
    while (parent && parent !== parentNode) {
        distance++;
        parent = parent.parentNode;
    }
    return distance;
};
var NestedScroll = /** @class */ (function () {
    function NestedScroll(scroll) {
        var groupId = this.handleOptions(scroll);
        var instance = NestedScroll.instancesMap[groupId];
        if (!instance) {
            instance = NestedScroll.instancesMap[groupId] = this;
            instance.store = [];
            instance.hooksFn = [];
        }
        instance.init(scroll);
        return instance;
    }
    NestedScroll.getAllNestedScrolls = function () {
        var instancesMap = NestedScroll.instancesMap;
        return Object.keys(instancesMap).map(function (key) { return instancesMap[key]; });
    };
    NestedScroll.purgeAllNestedScrolls = function () {
        var nestedScrolls = NestedScroll.getAllNestedScrolls();
        nestedScrolls.forEach(function (ns) { return ns.purgeNestedScroll(); });
    };
    NestedScroll.prototype.handleOptions = function (scroll) {
        var userOptions = (scroll.options.nestedScroll === true
            ? {}
            : scroll.options.nestedScroll);
        var defaultOptions = {
            groupId: DEFAUL_GROUP_ID,
        };
        this.options = extend(defaultOptions, userOptions);
        var groupIdType = typeof this.options.groupId;
        if (groupIdType !== 'string' && groupIdType !== 'number') {
            warn('groupId must be string or number for NestedScroll plugin');
        }
        return this.options.groupId;
    };
    NestedScroll.prototype.init = function (scroll) {
        scroll.proxy(propertiesConfig);
        this.addBScroll(scroll);
        this.buildBScrollGraph();
        this.analyzeBScrollGraph();
        this.ensureEventInvokeSequence();
        this.handleHooks(scroll);
    };
    NestedScroll.prototype.handleHooks = function (scroll) {
        var _this = this;
        this.registerHooks(scroll.hooks, scroll.hooks.eventTypes.destroy, function () {
            _this.deleteScroll(scroll);
        });
    };
    NestedScroll.prototype.deleteScroll = function (scroll) {
        var wrapper = scroll.wrapper;
        wrapper.isBScrollContainer = undefined;
        var store = this.store;
        var hooksFn = this.hooksFn;
        var i = findIndex(store, function (bscrollFamily) {
            return bscrollFamily.selfScroll === scroll;
        });
        if (i > -1) {
            var bscrollFamily = store[i];
            bscrollFamily.purge();
            store.splice(i, 1);
        }
        var k = findIndex(hooksFn, function (_a) {
            var hooks = _a[0];
            return hooks === scroll.hooks;
        });
        if (k > -1) {
            var _a = hooksFn[k], hooks = _a[0], eventType = _a[1], handler = _a[2];
            hooks.off(eventType, handler);
            hooksFn.splice(k, 1);
        }
    };
    NestedScroll.prototype.addBScroll = function (scroll) {
        this.store.push(BScrollFamily.create(scroll));
    };
    NestedScroll.prototype.buildBScrollGraph = function () {
        var store = this.store;
        var bf1;
        var bf2;
        var wrapper1;
        var wrapper2;
        var len = this.store.length;
        // build graph
        for (var i = 0; i < len; i++) {
            bf1 = store[i];
            wrapper1 = bf1.selfScroll.wrapper;
            for (var j = 0; j < len; j++) {
                bf2 = store[j];
                wrapper2 = bf2.selfScroll.wrapper;
                // same bs
                if (bf1 === bf2)
                    continue;
                if (!wrapper1.contains(wrapper2))
                    continue;
                // bs1 contains bs2
                var distance = calculateDistance(wrapper2, wrapper1);
                if (!bf1.hasDescendants(bf2)) {
                    bf1.addDescendant(bf2, distance);
                }
                if (!bf2.hasAncestors(bf1)) {
                    bf2.addAncestor(bf1, distance);
                }
            }
        }
    };
    NestedScroll.prototype.analyzeBScrollGraph = function () {
        this.store.forEach(function (bscrollFamily) {
            if (bscrollFamily.analyzed) {
                return;
            }
            var ancestors = bscrollFamily.ancestors, descendants = bscrollFamily.descendants, currentScroll = bscrollFamily.selfScroll;
            var beforeScrollStartHandler = function () {
                // always get the latest scroll
                var ancestorScrolls = ancestors.map(function (_a) {
                    var bscrollFamily = _a[0];
                    return bscrollFamily.selfScroll;
                });
                var descendantScrolls = descendants.map(function (_a) {
                    var bscrollFamily = _a[0];
                    return bscrollFamily.selfScroll;
                });
                forceScrollStopHandler(__spreadArrays(ancestorScrolls, descendantScrolls));
                if (isResettingPosition(currentScroll)) {
                    resetPositionHandler(currentScroll);
                }
                syncTouchstartData(ancestorScrolls);
                disableScrollHander(ancestorScrolls, currentScroll);
            };
            var touchEndHandler = function () {
                var ancestorScrolls = ancestors.map(function (_a) {
                    var bscrollFamily = _a[0];
                    return bscrollFamily.selfScroll;
                });
                var descendantScrolls = descendants.map(function (_a) {
                    var bscrollFamily = _a[0];
                    return bscrollFamily.selfScroll;
                });
                enableScrollHander(__spreadArrays(ancestorScrolls, descendantScrolls));
            };
            bscrollFamily.registerHooks(currentScroll, currentScroll.eventTypes.beforeScrollStart, beforeScrollStartHandler);
            bscrollFamily.registerHooks(currentScroll, currentScroll.eventTypes.touchEnd, touchEndHandler);
            var selfActionsHooks = currentScroll.scroller.actions.hooks;
            bscrollFamily.registerHooks(selfActionsHooks, selfActionsHooks.eventTypes.detectMovingDirection, function () {
                var ancestorScrolls = ancestors.map(function (_a) {
                    var bscrollFamily = _a[0];
                    return bscrollFamily.selfScroll;
                });
                var parentScroll = ancestorScrolls[0];
                var otherAncestorScrolls = ancestorScrolls.slice(1);
                var contentMoved = currentScroll.scroller.actions.contentMoved;
                var isTopScroll = ancestorScrolls.length === 0;
                if (contentMoved) {
                    disableScrollHander(ancestorScrolls, currentScroll);
                }
                else if (!isTopScroll) {
                    if (isOutOfBoundary(currentScroll)) {
                        disableScrollHander([currentScroll], currentScroll);
                        if (parentScroll) {
                            enableScrollHander([parentScroll]);
                        }
                        disableScrollHander(otherAncestorScrolls, currentScroll);
                        return true;
                    }
                }
            });
            bscrollFamily.setAnalyzed(true);
        });
    };
    // make sure touchmove|touchend invoke from child to parent
    NestedScroll.prototype.ensureEventInvokeSequence = function () {
        var copied = this.store.slice();
        var sequencedScroll = copied.sort(function (a, b) {
            return a.descendants.length - b.descendants.length;
        });
        sequencedScroll.forEach(function (bscrollFamily) {
            var scroll = bscrollFamily.selfScroll;
            scroll.scroller.actionsHandler.rebindDOMEvents();
        });
    };
    NestedScroll.prototype.registerHooks = function (hooks, name, handler) {
        hooks.on(name, handler, this);
        this.hooksFn.push([hooks, name, handler]);
    };
    NestedScroll.prototype.purgeNestedScroll = function () {
        var groupId = this.options.groupId;
        this.store.forEach(function (bscrollFamily) {
            bscrollFamily.purge();
        });
        this.store = [];
        this.hooksFn.forEach(function (_a) {
            var hooks = _a[0], eventType = _a[1], handler = _a[2];
            hooks.off(eventType, handler);
        });
        this.hooksFn = [];
        delete NestedScroll.instancesMap[groupId];
    };
    NestedScroll.pluginName = 'nestedScroll';
    NestedScroll.instancesMap = {};
    return NestedScroll;
}());

export { DEFAUL_GROUP_ID, NestedScroll as default };
