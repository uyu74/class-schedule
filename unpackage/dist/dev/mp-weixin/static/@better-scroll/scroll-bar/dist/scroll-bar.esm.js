/*!
 * better-scroll / scroll-bar
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

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

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

function getNow() {
    return window.performance &&
        window.performance.now &&
        window.performance.timing
        ? window.performance.now() + window.performance.timing.navigationStart
        : +new Date();
}
var extend = function (target, source) {
    for (var key in source) {
        target[key] = source[key];
    }
    return target;
};
function between(x, min, max) {
    if (x < min) {
        return min;
    }
    if (x > max) {
        return max;
    }
    return x;
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
function addEvent(el, type, fn, capture) {
    var useCapture = supportsPassive
        ? {
            passive: false,
            capture: !!capture,
        }
        : !!capture;
    el.addEventListener(type, fn, useCapture);
}
function removeEvent(el, type, fn, capture) {
    el.removeEventListener(type, fn, {
        capture: !!capture,
    });
}
function maybePrevent(e) {
    if (e.cancelable) {
        e.preventDefault();
    }
}
vendor && vendor !== 'standard' ? '-' + vendor.toLowerCase() + '-' : '';
var transform = prefixStyle('transform');
var transition = prefixStyle('transition');
inBrowser && prefixStyle('perspective') in elementStyle;
var style = {
    transform: transform,
    transition: transition,
    transitionTimingFunction: prefixStyle('transitionTimingFunction'),
    transitionDuration: prefixStyle('transitionDuration'),
    transitionDelay: prefixStyle('transitionDelay'),
    transformOrigin: prefixStyle('transformOrigin'),
    transitionEnd: prefixStyle('transitionEnd'),
    transitionProperty: prefixStyle('transitionProperty'),
};

var EventEmitter = /** @class */ (function () {
    function EventEmitter(names) {
        this.events = {};
        this.eventTypes = {};
        this.registerType(names);
    }
    EventEmitter.prototype.on = function (type, fn, context) {
        if (context === void 0) { context = this; }
        this.hasType(type);
        if (!this.events[type]) {
            this.events[type] = [];
        }
        this.events[type].push([fn, context]);
        return this;
    };
    EventEmitter.prototype.once = function (type, fn, context) {
        var _this = this;
        if (context === void 0) { context = this; }
        this.hasType(type);
        var magic = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            _this.off(type, magic);
            var ret = fn.apply(context, args);
            if (ret === true) {
                return ret;
            }
        };
        magic.fn = fn;
        this.on(type, magic);
        return this;
    };
    EventEmitter.prototype.off = function (type, fn) {
        if (!type && !fn) {
            this.events = {};
            return this;
        }
        if (type) {
            this.hasType(type);
            if (!fn) {
                this.events[type] = [];
                return this;
            }
            var events = this.events[type];
            if (!events) {
                return this;
            }
            var count = events.length;
            while (count--) {
                if (events[count][0] === fn ||
                    (events[count][0] && events[count][0].fn === fn)) {
                    events.splice(count, 1);
                }
            }
            return this;
        }
    };
    EventEmitter.prototype.trigger = function (type) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        this.hasType(type);
        var events = this.events[type];
        if (!events) {
            return;
        }
        var len = events.length;
        var eventsCopy = __spreadArrays(events);
        var ret;
        for (var i = 0; i < len; i++) {
            var event_1 = eventsCopy[i];
            var fn = event_1[0], context = event_1[1];
            if (fn) {
                ret = fn.apply(context, args);
                if (ret === true) {
                    return ret;
                }
            }
        }
    };
    EventEmitter.prototype.registerType = function (names) {
        var _this = this;
        names.forEach(function (type) {
            _this.eventTypes[type] = type;
        });
    };
    EventEmitter.prototype.destroy = function () {
        this.events = {};
        this.eventTypes = {};
    };
    EventEmitter.prototype.hasType = function (type) {
        var types = this.eventTypes;
        var isType = types[type] === type;
        if (!isType) {
            warn("EventEmitter has used unknown event type: \"" + type + "\", should be oneof [" +
                ("" + Object.keys(types).map(function (_) { return JSON.stringify(_); })) +
                "]");
        }
    };
    return EventEmitter;
}());
var EventRegister = /** @class */ (function () {
    function EventRegister(wrapper, events) {
        this.wrapper = wrapper;
        this.events = events;
        this.addDOMEvents();
    }
    EventRegister.prototype.destroy = function () {
        this.removeDOMEvents();
        this.events = [];
    };
    EventRegister.prototype.addDOMEvents = function () {
        this.handleDOMEvents(addEvent);
    };
    EventRegister.prototype.removeDOMEvents = function () {
        this.handleDOMEvents(removeEvent);
    };
    EventRegister.prototype.handleDOMEvents = function (eventOperation) {
        var _this = this;
        var wrapper = this.wrapper;
        this.events.forEach(function (event) {
            eventOperation(wrapper, event.name, _this, !!event.capture);
        });
    };
    EventRegister.prototype.handleEvent = function (e) {
        var eventType = e.type;
        this.events.some(function (event) {
            if (event.name === eventType) {
                event.handler(e);
                return true;
            }
            return false;
        });
    };
    return EventRegister;
}());

var EventHandler = /** @class */ (function () {
    function EventHandler(indicator, options) {
        this.indicator = indicator;
        this.options = options;
        this.hooks = new EventEmitter(['touchStart', 'touchMove', 'touchEnd']);
        this.registerEvents();
    }
    EventHandler.prototype.registerEvents = function () {
        var _a = this.options, disableMouse = _a.disableMouse, disableTouch = _a.disableTouch;
        var startEvents = [];
        var moveEvents = [];
        var endEvents = [];
        if (!disableMouse) {
            startEvents.push({
                name: 'mousedown',
                handler: this.start.bind(this),
            });
            moveEvents.push({
                name: 'mousemove',
                handler: this.move.bind(this),
            });
            endEvents.push({
                name: 'mouseup',
                handler: this.end.bind(this),
            });
        }
        if (!disableTouch) {
            startEvents.push({
                name: 'touchstart',
                handler: this.start.bind(this),
            });
            moveEvents.push({
                name: 'touchmove',
                handler: this.move.bind(this),
            });
            endEvents.push({
                name: 'touchend',
                handler: this.end.bind(this),
            }, {
                name: 'touchcancel',
                handler: this.end.bind(this),
            });
        }
        this.startEventRegister = new EventRegister(this.indicator.indicatorEl, startEvents);
        this.moveEventRegister = new EventRegister(window, moveEvents);
        this.endEventRegister = new EventRegister(window, endEvents);
    };
    EventHandler.prototype.BScrollIsDisabled = function () {
        return !this.indicator.scroll.enabled;
    };
    EventHandler.prototype.start = function (e) {
        if (this.BScrollIsDisabled()) {
            return;
        }
        var point = (e.touches ? e.touches[0] : e);
        maybePrevent(e);
        e.stopPropagation();
        this.initiated = true;
        this.lastPoint = point[this.indicator.keysMap.point];
        this.hooks.trigger(this.hooks.eventTypes.touchStart);
    };
    EventHandler.prototype.move = function (e) {
        if (!this.initiated) {
            return;
        }
        var point = (e.touches ? e.touches[0] : e);
        var pointPos = point[this.indicator.keysMap.point];
        maybePrevent(e);
        e.stopPropagation();
        var delta = pointPos - this.lastPoint;
        this.lastPoint = pointPos;
        this.hooks.trigger(this.hooks.eventTypes.touchMove, delta);
    };
    EventHandler.prototype.end = function (e) {
        if (!this.initiated) {
            return;
        }
        this.initiated = false;
        maybePrevent(e);
        e.stopPropagation();
        this.hooks.trigger(this.hooks.eventTypes.touchEnd);
    };
    EventHandler.prototype.destroy = function () {
        this.startEventRegister.destroy();
        this.moveEventRegister.destroy();
        this.endEventRegister.destroy();
    };
    return EventHandler;
}());

var Indicator = /** @class */ (function () {
    function Indicator(scroll, options) {
        this.scroll = scroll;
        this.options = options;
        this.hooksFn = [];
        this.wrapper = options.wrapper;
        this.direction = options.direction;
        this.indicatorEl = this.wrapper.children[0];
        this.keysMap = this.getKeysMap();
        this.handleFade();
        this.handleHooks();
    }
    Indicator.prototype.handleFade = function () {
        if (this.options.fade) {
            this.wrapper.style.opacity = '0';
        }
    };
    Indicator.prototype.handleHooks = function () {
        var _this = this;
        var _a = this.options, fade = _a.fade, interactive = _a.interactive, scrollbarTrackClickable = _a.scrollbarTrackClickable;
        var scroll = this.scroll;
        var scrollHooks = scroll.hooks;
        var translaterHooks = scroll.scroller.translater.hooks;
        var animaterHooks = scroll.scroller.animater.hooks;
        this.registerHooks(scrollHooks, scrollHooks.eventTypes.refresh, this.refresh);
        this.registerHooks(translaterHooks, translaterHooks.eventTypes.translate, function (pos) {
            var hasScrollKey = _this.keysMap.hasScroll;
            if (_this.scroll[hasScrollKey]) {
                _this.updatePosition(pos);
            }
        });
        this.registerHooks(animaterHooks, animaterHooks.eventTypes.time, this.transitionTime);
        this.registerHooks(animaterHooks, animaterHooks.eventTypes.timeFunction, this.transitionTimingFunction);
        if (fade) {
            this.registerHooks(scroll, scroll.eventTypes.scrollEnd, function () {
                _this.fade();
            });
            this.registerHooks(scroll, scroll.eventTypes.scrollStart, function () {
                _this.fade(true);
            });
            // for mousewheel event
            if (scroll.eventTypes.mousewheelStart &&
                scroll.eventTypes.mousewheelEnd) {
                this.registerHooks(scroll, scroll.eventTypes.mousewheelStart, function () {
                    _this.fade(true);
                });
                this.registerHooks(scroll, scroll.eventTypes.mousewheelMove, function () {
                    _this.fade(true);
                });
                this.registerHooks(scroll, scroll.eventTypes.mousewheelEnd, function () {
                    _this.fade();
                });
            }
        }
        if (interactive) {
            var _b = this.scroll.options, disableMouse = _b.disableMouse, disableTouch = _b.disableTouch;
            this.eventHandler = new EventHandler(this, {
                disableMouse: disableMouse,
                disableTouch: disableTouch,
            });
            var eventHandlerHooks = this.eventHandler.hooks;
            this.registerHooks(eventHandlerHooks, eventHandlerHooks.eventTypes.touchStart, this.startHandler);
            this.registerHooks(eventHandlerHooks, eventHandlerHooks.eventTypes.touchMove, this.moveHandler);
            this.registerHooks(eventHandlerHooks, eventHandlerHooks.eventTypes.touchEnd, this.endHandler);
        }
        if (scrollbarTrackClickable) {
            this.bindClick();
        }
    };
    Indicator.prototype.registerHooks = function (hooks, name, handler) {
        hooks.on(name, handler, this);
        this.hooksFn.push([hooks, name, handler]);
    };
    Indicator.prototype.bindClick = function () {
        var wrapper = this.wrapper;
        this.clickEventRegister = new EventRegister(wrapper, [
            {
                name: 'click',
                handler: this.handleClick.bind(this),
            },
        ]);
    };
    Indicator.prototype.handleClick = function (e) {
        var newPos = this.calculateclickOffsetPos(e);
        var _a = this.scroll, x = _a.x, y = _a.y;
        x = this.direction === "horizontal" /* Horizontal */ ? newPos : x;
        y = this.direction === "vertical" /* Vertical */ ? newPos : y;
        this.scroll.scrollTo(x, y, this.options.scrollbarTrackOffsetTime);
    };
    Indicator.prototype.calculateclickOffsetPos = function (e) {
        var _a = this.keysMap, poinKey = _a.point, domRectKey = _a.domRect;
        var scrollbarTrackOffsetType = this.options.scrollbarTrackOffsetType;
        var clickPointOffset = e[poinKey] - this.wrapperRect[domRectKey];
        var scrollToWhere = clickPointOffset < this.currentPos ? -1 /* Up */ : 1 /* Down */;
        var delta = 0;
        var currentPos = this.currentPos;
        if (scrollbarTrackOffsetType === "step" /* Step */) {
            delta = this.scrollInfo.baseSize * scrollToWhere;
        }
        else {
            delta = 0;
            currentPos = clickPointOffset;
        }
        return this.newPos(currentPos, delta, this.scrollInfo);
    };
    Indicator.prototype.getKeysMap = function () {
        if (this.direction === "vertical" /* Vertical */) {
            return {
                hasScroll: 'hasVerticalScroll',
                size: 'height',
                wrapperSize: 'clientHeight',
                scrollerSize: 'scrollerHeight',
                maxScrollPos: 'maxScrollY',
                pos: 'y',
                point: 'pageY',
                translateProperty: 'translateY',
                domRect: 'top',
            };
        }
        return {
            hasScroll: 'hasHorizontalScroll',
            size: 'width',
            wrapperSize: 'clientWidth',
            scrollerSize: 'scrollerWidth',
            maxScrollPos: 'maxScrollX',
            pos: 'x',
            point: 'pageX',
            translateProperty: 'translateX',
            domRect: 'left',
        };
    };
    Indicator.prototype.fade = function (visible) {
        var _a = this.options, fadeInTime = _a.fadeInTime, fadeOutTime = _a.fadeOutTime;
        var time = visible ? fadeInTime : fadeOutTime;
        var wrapper = this.wrapper;
        wrapper.style[style.transitionDuration] = time + 'ms';
        wrapper.style.opacity = visible ? '1' : '0';
    };
    Indicator.prototype.refresh = function () {
        var hasScrollKey = this.keysMap.hasScroll;
        var scroll = this.scroll;
        var x = scroll.x, y = scroll.y;
        this.wrapperRect = this.wrapper.getBoundingClientRect();
        if (this.canScroll(scroll[hasScrollKey])) {
            var _a = this.keysMap, wrapperSizeKey = _a.wrapperSize, scrollerSizeKey = _a.scrollerSize, maxScrollPosKey = _a.maxScrollPos;
            this.scrollInfo = this.refreshScrollInfo(this.wrapper[wrapperSizeKey], scroll[scrollerSizeKey], scroll[maxScrollPosKey], this.indicatorEl[wrapperSizeKey]);
            this.updatePosition({
                x: x,
                y: y,
            });
        }
    };
    Indicator.prototype.transitionTime = function (time) {
        if (time === void 0) { time = 0; }
        this.indicatorEl.style[style.transitionDuration] = time + 'ms';
    };
    Indicator.prototype.transitionTimingFunction = function (easing) {
        this.indicatorEl.style[style.transitionTimingFunction] = easing;
    };
    Indicator.prototype.canScroll = function (hasScroll) {
        this.wrapper.style.display = hasScroll ? 'block' : 'none';
        return hasScroll;
    };
    Indicator.prototype.refreshScrollInfo = function (wrapperSize, scrollerSize, maxScrollPos, indicatorElSize) {
        var baseSize = Math.max(Math.round((wrapperSize * wrapperSize) / (scrollerSize || wrapperSize || 1)), this.options.minSize);
        if (this.options.isCustom) {
            baseSize = indicatorElSize;
        }
        var maxIndicatorScrollPos = wrapperSize - baseSize;
        // sizeRatio is negative
        var sizeRatio = maxIndicatorScrollPos / maxScrollPos;
        return {
            baseSize: baseSize,
            maxScrollPos: maxIndicatorScrollPos,
            minScrollPos: 0,
            sizeRatio: sizeRatio,
        };
    };
    Indicator.prototype.updatePosition = function (point) {
        var _a = this.caculatePosAndSize(point, this.scrollInfo), pos = _a.pos, size = _a.size;
        this.refreshStyle(size, pos);
        this.currentPos = pos;
    };
    Indicator.prototype.caculatePosAndSize = function (point, scrollInfo) {
        var posKey = this.keysMap.pos;
        var sizeRatio = scrollInfo.sizeRatio, baseSize = scrollInfo.baseSize, maxScrollPos = scrollInfo.maxScrollPos, minScrollPos = scrollInfo.minScrollPos;
        var minSize = this.options.minSize;
        var pos = Math.round(sizeRatio * point[posKey]);
        var size;
        // when out of boundary, slow down size reduction
        if (pos < minScrollPos) {
            size = Math.max(baseSize + pos * 3, minSize);
            pos = minScrollPos;
        }
        else if (pos > maxScrollPos) {
            size = Math.max(baseSize - (pos - maxScrollPos) * 3, minSize);
            pos = maxScrollPos + baseSize - size;
        }
        else {
            size = baseSize;
        }
        return {
            pos: pos,
            size: size,
        };
    };
    Indicator.prototype.refreshStyle = function (size, pos) {
        var _a = this.keysMap, translatePropertyKey = _a.translateProperty, sizeKey = _a.size;
        var translateZ = this.scroll.options.translateZ;
        this.indicatorEl.style[sizeKey] = size + "px";
        this.indicatorEl.style[style.transform] = translatePropertyKey + "(" + pos + "px)" + translateZ;
    };
    Indicator.prototype.startHandler = function () {
        this.moved = false;
        this.startTime = getNow();
        this.transitionTime();
        this.scroll.scroller.hooks.trigger(this.scroll.scroller.hooks.eventTypes.beforeScrollStart);
    };
    Indicator.prototype.moveHandler = function (delta) {
        if (!this.moved && !this.indicatorNotMoved(delta)) {
            this.moved = true;
            this.scroll.scroller.hooks.trigger(this.scroll.scroller.hooks.eventTypes.scrollStart);
        }
        if (this.moved) {
            var newPos = this.newPos(this.currentPos, delta, this.scrollInfo);
            this.syncBScroll(newPos);
        }
    };
    Indicator.prototype.endHandler = function () {
        if (this.moved) {
            var _a = this.scroll, x = _a.x, y = _a.y;
            this.scroll.scroller.hooks.trigger(this.scroll.scroller.hooks.eventTypes.scrollEnd, {
                x: x,
                y: y,
            });
        }
    };
    Indicator.prototype.indicatorNotMoved = function (delta) {
        var currentPos = this.currentPos;
        var _a = this.scrollInfo, maxScrollPos = _a.maxScrollPos, minScrollPos = _a.minScrollPos;
        var notMoved = (currentPos === minScrollPos && delta <= 0) ||
            (currentPos === maxScrollPos && delta >= 0);
        return notMoved;
    };
    Indicator.prototype.syncBScroll = function (newPos) {
        var timestamp = getNow();
        var _a = this.scroll, x = _a.x, y = _a.y, options = _a.options, scroller = _a.scroller, maxScrollY = _a.maxScrollY, minScrollY = _a.minScrollY, maxScrollX = _a.maxScrollX, minScrollX = _a.minScrollX;
        var probeType = options.probeType, momentumLimitTime = options.momentumLimitTime;
        var position = { x: x, y: y };
        if (this.direction === "vertical" /* Vertical */) {
            position.y = between(newPos, maxScrollY, minScrollY);
        }
        else {
            position.x = between(newPos, maxScrollX, minScrollX);
        }
        scroller.translater.translate(position);
        // dispatch scroll in interval time
        if (timestamp - this.startTime > momentumLimitTime) {
            this.startTime = timestamp;
            if (probeType === 1 /* Throttle */) {
                scroller.hooks.trigger(scroller.hooks.eventTypes.scroll, position);
            }
        }
        // dispatch scroll all the time
        if (probeType > 1 /* Throttle */) {
            scroller.hooks.trigger(scroller.hooks.eventTypes.scroll, position);
        }
    };
    Indicator.prototype.newPos = function (currentPos, delta, scrollInfo) {
        var maxScrollPos = scrollInfo.maxScrollPos, sizeRatio = scrollInfo.sizeRatio, minScrollPos = scrollInfo.minScrollPos;
        var newPos = currentPos + delta;
        newPos = between(newPos, minScrollPos, maxScrollPos);
        return Math.round(newPos / sizeRatio);
    };
    Indicator.prototype.destroy = function () {
        var _a = this.options, interactive = _a.interactive, scrollbarTrackClickable = _a.scrollbarTrackClickable, isCustom = _a.isCustom;
        if (interactive) {
            this.eventHandler.destroy();
        }
        if (scrollbarTrackClickable) {
            this.clickEventRegister.destroy();
        }
        if (!isCustom) {
            this.wrapper.parentNode.removeChild(this.wrapper);
        }
        this.hooksFn.forEach(function (item) {
            var hooks = item[0];
            var hooksName = item[1];
            var handlerFn = item[2];
            hooks.off(hooksName, handlerFn);
        });
        this.hooksFn.length = 0;
    };
    return Indicator;
}());

var ScrollBar = /** @class */ (function () {
    function ScrollBar(scroll) {
        this.scroll = scroll;
        this.handleOptions();
        this.createIndicators();
        this.handleHooks();
    }
    ScrollBar.prototype.handleHooks = function () {
        var _this = this;
        var scroll = this.scroll;
        scroll.hooks.on(scroll.hooks.eventTypes.destroy, function () {
            for (var _i = 0, _a = _this.indicators; _i < _a.length; _i++) {
                var indicator = _a[_i];
                indicator.destroy();
            }
        });
    };
    ScrollBar.prototype.handleOptions = function () {
        var userOptions = (this.scroll.options.scrollbar === true
            ? {}
            : this.scroll.options.scrollbar);
        var defaultOptions = {
            fade: true,
            fadeInTime: 250,
            fadeOutTime: 500,
            interactive: false,
            customElements: [],
            minSize: 8,
            scrollbarTrackClickable: false,
            scrollbarTrackOffsetType: "step" /* Step */,
            scrollbarTrackOffsetTime: 300,
        };
        this.options = extend(defaultOptions, userOptions);
    };
    ScrollBar.prototype.createIndicators = function () {
        var indicatorOptions;
        var scroll = this.scroll;
        var indicators = [];
        var scrollDirectionConfigKeys = ['scrollX', 'scrollY'];
        var indicatorDirections = [
            "horizontal" /* Horizontal */,
            "vertical" /* Vertical */,
        ];
        var customScrollbarEls = this.options.customElements;
        for (var i = 0; i < scrollDirectionConfigKeys.length; i++) {
            var key = scrollDirectionConfigKeys[i];
            // wanna scroll in specified direction
            if (scroll.options[key]) {
                var customElement = customScrollbarEls.shift();
                var direction = indicatorDirections[i];
                var isCustom = false;
                var scrollbarWrapper = customElement
                    ? customElement
                    : this.createScrollbarElement(direction);
                // internal scrollbar
                if (scrollbarWrapper !== customElement) {
                    scroll.wrapper.appendChild(scrollbarWrapper);
                }
                else {
                    // custom scrollbar passed by users
                    isCustom = true;
                }
                indicatorOptions = __assign(__assign({ wrapper: scrollbarWrapper, direction: direction }, this.options), { isCustom: isCustom });
                indicators.push(new Indicator(scroll, indicatorOptions));
            }
        }
        this.indicators = indicators;
    };
    ScrollBar.prototype.createScrollbarElement = function (direction, scrollbarTrackClickable) {
        if (scrollbarTrackClickable === void 0) { scrollbarTrackClickable = this.options.scrollbarTrackClickable; }
        var scrollbarWrapperEl = document.createElement('div');
        var scrollbarIndicatorEl = document.createElement('div');
        scrollbarWrapperEl.style.cssText =
            'position:absolute;z-index:9999;overflow:hidden;';
        scrollbarIndicatorEl.style.cssText =
            'box-sizing:border-box;position:absolute;background:rgba(0,0,0,0.5);border:1px solid rgba(255,255,255,0.9);border-radius:3px;';
        scrollbarIndicatorEl.className = 'bscroll-indicator';
        if (direction === "horizontal" /* Horizontal */) {
            scrollbarWrapperEl.style.cssText +=
                'height:7px;left:2px;right:2px;bottom:0;';
            scrollbarIndicatorEl.style.height = '100%';
            scrollbarWrapperEl.className = 'bscroll-horizontal-scrollbar';
        }
        else {
            scrollbarWrapperEl.style.cssText +=
                'width:7px;bottom:2px;top:2px;right:1px;';
            scrollbarIndicatorEl.style.width = '100%';
            scrollbarWrapperEl.className = 'bscroll-vertical-scrollbar';
        }
        if (!scrollbarTrackClickable) {
            scrollbarWrapperEl.style.cssText += 'pointer-events:none;';
        }
        scrollbarWrapperEl.appendChild(scrollbarIndicatorEl);
        return scrollbarWrapperEl;
    };
    ScrollBar.pluginName = 'scrollbar';
    return ScrollBar;
}());

export { ScrollBar as default };
