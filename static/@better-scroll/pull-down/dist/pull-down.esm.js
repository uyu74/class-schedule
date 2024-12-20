/*!
 * better-scroll / pull-down
 * (c) 2016-2023 ustbhuangyi
 * Released under the MIT License.
 */
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

var ease = {
    // easeOutQuint
    swipe: {
        style: 'cubic-bezier(0.23, 1, 0.32, 1)',
        fn: function (t) {
            return 1 + --t * t * t * t * t;
        }
    },
    // easeOutQuard
    swipeBounce: {
        style: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        fn: function (t) {
            return t * (2 - t);
        }
    },
    // easeOutQuart
    bounce: {
        style: 'cubic-bezier(0.165, 0.84, 0.44, 1)',
        fn: function (t) {
            return 1 - --t * t * t * t;
        }
    }
};

var sourcePrefix = 'plugins.pullDownRefresh';
var propertiesMap = [
    {
        key: 'finishPullDown',
        name: 'finishPullDown'
    },
    {
        key: 'openPullDown',
        name: 'openPullDown'
    },
    {
        key: 'closePullDown',
        name: 'closePullDown'
    },
    {
        key: 'autoPullDownRefresh',
        name: 'autoPullDownRefresh'
    }
];
var propertiesConfig = propertiesMap.map(function (item) {
    return {
        key: item.key,
        sourceKey: sourcePrefix + "." + item.name
    };
});

var PULLING_DOWN_EVENT = 'pullingDown';
var ENTER_THRESHOLD_EVENT = 'enterThreshold';
var LEAVE_THRESHOLD_EVENT = 'leaveThreshold';
var PullDown = /** @class */ (function () {
    function PullDown(scroll) {
        this.scroll = scroll;
        this.pulling = 0 /* DEFAULT */;
        this.thresholdBoundary = 0 /* DEFAULT */;
        this.init();
    }
    PullDown.prototype.setPulling = function (status) {
        this.pulling = status;
    };
    PullDown.prototype.setThresholdBoundary = function (boundary) {
        this.thresholdBoundary = boundary;
    };
    PullDown.prototype.init = function () {
        this.handleBScroll();
        this.handleOptions(this.scroll.options.pullDownRefresh);
        this.handleHooks();
        this.watch();
    };
    PullDown.prototype.handleBScroll = function () {
        this.scroll.registerType([
            PULLING_DOWN_EVENT,
            ENTER_THRESHOLD_EVENT,
            LEAVE_THRESHOLD_EVENT,
        ]);
        this.scroll.proxy(propertiesConfig);
    };
    PullDown.prototype.handleOptions = function (userOptions) {
        if (userOptions === void 0) { userOptions = {}; }
        userOptions = (userOptions === true ? {} : userOptions);
        var defaultOptions = {
            threshold: 90,
            stop: 40,
        };
        this.options = extend(defaultOptions, userOptions);
        this.scroll.options.probeType = 3 /* Realtime */;
    };
    PullDown.prototype.handleHooks = function () {
        var _this = this;
        this.hooksFn = [];
        var scroller = this.scroll.scroller;
        var scrollBehaviorY = scroller.scrollBehaviorY;
        this.currentMinScrollY = this.cachedOriginanMinScrollY =
            scrollBehaviorY.minScrollPos;
        this.registerHooks(this.scroll.hooks, this.scroll.hooks.eventTypes.contentChanged, function () {
            _this.finishPullDown();
        });
        this.registerHooks(scrollBehaviorY.hooks, scrollBehaviorY.hooks.eventTypes.computeBoundary, function (boundary) {
            // content is smaller than wrapper
            if (boundary.maxScrollPos > 0) {
                // allow scrolling when content is not full of wrapper
                boundary.maxScrollPos = -1;
            }
            boundary.minScrollPos = _this.currentMinScrollY;
        });
        // integrate with mousewheel
        if (this.hasMouseWheelPlugin()) {
            this.registerHooks(this.scroll, this.scroll.eventTypes.alterOptions, function (mouseWheelOptions) {
                var SANE_DISCRETE_TIME = 300;
                var SANE_EASE_TIME = 350;
                mouseWheelOptions.discreteTime = SANE_DISCRETE_TIME;
                // easeTime > discreteTime ensure goInto checkPullDown function
                mouseWheelOptions.easeTime = SANE_EASE_TIME;
            });
            this.registerHooks(this.scroll, this.scroll.eventTypes.mousewheelEnd, function () {
                // mouseWheel need trigger checkPullDown manually
                scroller.hooks.trigger(scroller.hooks.eventTypes.end);
            });
        }
    };
    PullDown.prototype.registerHooks = function (hooks, name, handler) {
        hooks.on(name, handler, this);
        this.hooksFn.push([hooks, name, handler]);
    };
    PullDown.prototype.hasMouseWheelPlugin = function () {
        return !!this.scroll.eventTypes.alterOptions;
    };
    PullDown.prototype.watch = function () {
        var scroller = this.scroll.scroller;
        this.watching = true;
        this.registerHooks(scroller.hooks, scroller.hooks.eventTypes.end, this.checkPullDown);
        this.registerHooks(this.scroll, this.scroll.eventTypes.scrollStart, this.resetStateBeforeScrollStart);
        this.registerHooks(this.scroll, this.scroll.eventTypes.scroll, this.checkLocationOfThresholdBoundary);
        if (this.hasMouseWheelPlugin()) {
            this.registerHooks(this.scroll, this.scroll.eventTypes.mousewheelStart, this.resetStateBeforeScrollStart);
        }
    };
    PullDown.prototype.resetStateBeforeScrollStart = function () {
        // current fetching pulldownRefresh has ended
        if (!this.isFetchingStatus()) {
            this.setPulling(1 /* MOVING */);
            this.setThresholdBoundary(0 /* DEFAULT */);
        }
    };
    PullDown.prototype.checkLocationOfThresholdBoundary = function () {
        // pulldownRefresh is in the phase of Moving
        if (this.pulling === 1 /* MOVING */) {
            var scroll_1 = this.scroll;
            // enter threshold boundary
            var enteredThresholdBoundary = this.thresholdBoundary !== 1 /* INSIDE */ &&
                this.locateInsideThresholdBoundary();
            // leave threshold boundary
            var leftThresholdBoundary = this.thresholdBoundary !== 2 /* OUTSIDE */ &&
                !this.locateInsideThresholdBoundary();
            if (enteredThresholdBoundary) {
                this.setThresholdBoundary(1 /* INSIDE */);
                scroll_1.trigger(ENTER_THRESHOLD_EVENT);
            }
            if (leftThresholdBoundary) {
                this.setThresholdBoundary(2 /* OUTSIDE */);
                scroll_1.trigger(LEAVE_THRESHOLD_EVENT);
            }
        }
    };
    PullDown.prototype.locateInsideThresholdBoundary = function () {
        return this.scroll.y <= this.options.threshold;
    };
    PullDown.prototype.unwatch = function () {
        var scroll = this.scroll;
        var scroller = scroll.scroller;
        this.watching = false;
        scroller.hooks.off(scroller.hooks.eventTypes.end, this.checkPullDown);
        scroll.off(scroll.eventTypes.scrollStart, this.resetStateBeforeScrollStart);
        scroll.off(scroll.eventTypes.scroll, this.checkLocationOfThresholdBoundary);
        if (this.hasMouseWheelPlugin()) {
            scroll.off(scroll.eventTypes.mousewheelStart, this.resetStateBeforeScrollStart);
        }
    };
    PullDown.prototype.checkPullDown = function () {
        var _a = this.options, threshold = _a.threshold, stop = _a.stop;
        // check if a real pull down action
        if (this.scroll.y < threshold) {
            return false;
        }
        if (this.pulling === 1 /* MOVING */) {
            this.modifyBehaviorYBoundary(stop);
            this.setPulling(2 /* FETCHING */);
            this.scroll.trigger(PULLING_DOWN_EVENT);
        }
        this.scroll.scrollTo(this.scroll.x, stop, this.scroll.options.bounceTime, ease.bounce);
        return this.isFetchingStatus();
    };
    PullDown.prototype.isFetchingStatus = function () {
        return this.pulling === 2 /* FETCHING */;
    };
    PullDown.prototype.modifyBehaviorYBoundary = function (stopDistance) {
        var scrollBehaviorY = this.scroll.scroller.scrollBehaviorY;
        // manually modify minScrollPos for a hang animation
        // to prevent from resetPosition
        this.cachedOriginanMinScrollY = scrollBehaviorY.minScrollPos;
        this.currentMinScrollY = stopDistance;
        scrollBehaviorY.computeBoundary();
    };
    PullDown.prototype.finishPullDown = function () {
        if (this.isFetchingStatus()) {
            var scrollBehaviorY = this.scroll.scroller.scrollBehaviorY;
            // restore minScrollY since the hang animation has ended
            this.currentMinScrollY = this.cachedOriginanMinScrollY;
            scrollBehaviorY.computeBoundary();
            this.setPulling(0 /* DEFAULT */);
            this.scroll.resetPosition(this.scroll.options.bounceTime, ease.bounce);
        }
    };
    // allow 'true' type is compat for beta version implements
    PullDown.prototype.openPullDown = function (config) {
        if (config === void 0) { config = {}; }
        this.handleOptions(config);
        if (!this.watching) {
            this.watch();
        }
    };
    PullDown.prototype.closePullDown = function () {
        this.unwatch();
    };
    PullDown.prototype.autoPullDownRefresh = function () {
        var _a = this.options, threshold = _a.threshold, stop = _a.stop;
        if (this.isFetchingStatus() || !this.watching) {
            return;
        }
        this.modifyBehaviorYBoundary(stop);
        this.scroll.trigger(this.scroll.eventTypes.scrollStart);
        this.scroll.scrollTo(this.scroll.x, threshold);
        this.setPulling(2 /* FETCHING */);
        this.scroll.trigger(PULLING_DOWN_EVENT);
        this.scroll.scrollTo(this.scroll.x, stop, this.scroll.options.bounceTime, ease.bounce);
    };
    PullDown.pluginName = 'pullDownRefresh';
    return PullDown;
}());

export { PullDown as default };
