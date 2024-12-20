/*!
 * better-scroll / indicators
 * (c) 2016-2023 ustbhuangyi
 * Released under the MIT License.
 */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Indicators = factory());
})(this, (function () { 'use strict';

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

    function assert(condition, msg) {
        if (!condition) {
            throw new Error('[BScroll] ' + msg);
        }
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
    function getRect(el) {
        /* istanbul ignore if  */
        if (el instanceof window.SVGElement) {
            var rect = el.getBoundingClientRect();
            return {
                top: rect.top,
                left: rect.left,
                width: rect.width,
                height: rect.height,
            };
        }
        else {
            return {
                top: el.offsetTop,
                left: el.offsetLeft,
                width: el.offsetWidth,
                height: el.offsetHeight,
            };
        }
    }
    function getClientSize(el) {
        return {
            width: el.clientWidth,
            height: el.clientHeight,
        };
    }

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

    var resolveRatioOption = function (ratioConfig) {
        var ret = {
            ratioX: 0,
            ratioY: 0,
        };
        /* istanbul ignore if  */
        if (!ratioConfig) {
            return ret;
        }
        if (typeof ratioConfig === 'number') {
            ret.ratioX = ret.ratioY = ratioConfig;
        }
        else if (typeof ratioConfig === 'object' && ratioConfig) {
            ret.ratioX = ratioConfig.x || 0;
            ret.ratioY = ratioConfig.y || 0;
        }
        return ret;
    };
    var handleBubbleAndCancelable = function (e) {
        maybePrevent(e);
        e.stopPropagation();
    };
    var Indicator = /** @class */ (function () {
        function Indicator(scroll, options) {
            this.scroll = scroll;
            this.options = options;
            this.currentPos = {
                x: 0,
                y: 0,
            };
            this.hooksFn = [];
            this.handleDOM();
            this.handleHooks();
            this.handleInteractive();
        }
        Indicator.prototype.handleDOM = function () {
            var _a = this.options, relationElement = _a.relationElement, _b = _a.relationElementHandleElementIndex, relationElementHandleElementIndex = _b === void 0 ? 0 : _b;
            this.wrapper = relationElement;
            this.indicatorEl = this.wrapper.children[relationElementHandleElementIndex];
        };
        Indicator.prototype.handleHooks = function () {
            var _this = this;
            var scroll = this.scroll;
            var scrollHooks = scroll.hooks;
            var translaterHooks = scroll.scroller.translater.hooks;
            var animaterHooks = scroll.scroller.animater.hooks;
            this.registerHooks(scrollHooks, scrollHooks.eventTypes.refresh, this.refresh);
            this.registerHooks(translaterHooks, translaterHooks.eventTypes.translate, function (pos) {
                _this.updatePosition(pos);
            });
            this.registerHooks(animaterHooks, animaterHooks.eventTypes.time, this.transitionTime);
            this.registerHooks(animaterHooks, animaterHooks.eventTypes.timeFunction, this.transitionTimingFunction);
        };
        Indicator.prototype.transitionTime = function (time) {
            if (time === void 0) { time = 0; }
            this.indicatorEl.style[style.transitionDuration] = time + 'ms';
        };
        Indicator.prototype.transitionTimingFunction = function (easing) {
            this.indicatorEl.style[style.transitionTimingFunction] = easing;
        };
        Indicator.prototype.handleInteractive = function () {
            if (this.options.interactive !== false) {
                this.registerEvents();
            }
        };
        Indicator.prototype.registerHooks = function (hooks, name, handler) {
            hooks.on(name, handler, this);
            this.hooksFn.push([hooks, name, handler]);
        };
        Indicator.prototype.registerEvents = function () {
            var _a = this.scroll.options, disableMouse = _a.disableMouse, disableTouch = _a.disableTouch;
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
            this.startEventRegister = new EventRegister(this.indicatorEl, startEvents);
            this.moveEventRegister = new EventRegister(window, moveEvents);
            this.endEventRegister = new EventRegister(window, endEvents);
        };
        Indicator.prototype.refresh = function () {
            var _a = this.scroll, x = _a.x, y = _a.y, hasHorizontalScroll = _a.hasHorizontalScroll, hasVerticalScroll = _a.hasVerticalScroll, maxBScrollX = _a.maxScrollX, maxBScrollY = _a.maxScrollY;
            var _b = resolveRatioOption(this.options.ratio), ratioX = _b.ratioX, ratioY = _b.ratioY;
            var _c = getClientSize(this.wrapper), wrapperWidth = _c.width, wrapperHeight = _c.height;
            var _d = getRect(this.indicatorEl), indicatorWidth = _d.width, indicatorHeight = _d.height;
            if (hasHorizontalScroll) {
                this.maxScrollX = wrapperWidth - indicatorWidth;
                this.translateXSign =
                    this.maxScrollX > 0 ? -1 /* Positive */ : 1 /* NotPositive */;
                this.minScrollX = 0;
                // ensure positive
                this.ratioX = ratioX ? ratioX : Math.abs(this.maxScrollX / maxBScrollX);
            }
            if (hasVerticalScroll) {
                this.maxScrollY = wrapperHeight - indicatorHeight;
                this.translateYSign =
                    this.maxScrollY > 0 ? -1 /* Positive */ : 1 /* NotPositive */;
                this.minScrollY = 0;
                this.ratioY = ratioY ? ratioY : Math.abs(this.maxScrollY / maxBScrollY);
            }
            this.updatePosition({
                x: x,
                y: y,
            });
        };
        Indicator.prototype.start = function (e) {
            if (this.BScrollIsDisabled()) {
                return;
            }
            var point = (e.touches ? e.touches[0] : e);
            handleBubbleAndCancelable(e);
            this.initiated = true;
            this.moved = false;
            this.lastPointX = point.pageX;
            this.lastPointY = point.pageY;
            this.startTime = getNow();
            this.scroll.scroller.hooks.trigger(this.scroll.scroller.hooks.eventTypes.beforeScrollStart);
        };
        Indicator.prototype.BScrollIsDisabled = function () {
            return !this.scroll.enabled;
        };
        Indicator.prototype.move = function (e) {
            if (!this.initiated) {
                return;
            }
            var point = (e.touches ? e.touches[0] : e);
            var pointX = point.pageX;
            var pointY = point.pageY;
            handleBubbleAndCancelable(e);
            var deltaX = pointX - this.lastPointX;
            var deltaY = pointY - this.lastPointY;
            this.lastPointX = pointX;
            this.lastPointY = pointY;
            if (!this.moved && !this.indicatorNotMoved(deltaX, deltaY)) {
                this.moved = true;
                this.scroll.scroller.hooks.trigger(this.scroll.scroller.hooks.eventTypes.scrollStart);
            }
            if (this.moved) {
                var newPos = this.getBScrollPosByRatio(this.currentPos, deltaX, deltaY);
                this.syncBScroll(newPos);
            }
        };
        Indicator.prototype.end = function (e) {
            if (!this.initiated) {
                return;
            }
            this.initiated = false;
            handleBubbleAndCancelable(e);
            if (this.moved) {
                var _a = this.scroll, x = _a.x, y = _a.y;
                this.scroll.scroller.hooks.trigger(this.scroll.scroller.hooks.eventTypes.scrollEnd, {
                    x: x,
                    y: y,
                });
            }
        };
        Indicator.prototype.getBScrollPosByRatio = function (currentPos, deltaX, deltaY) {
            var currentX = currentPos.x, currentY = currentPos.y;
            var _a = this.scroll, hasHorizontalScroll = _a.hasHorizontalScroll, hasVerticalScroll = _a.hasVerticalScroll, BScrollMinScrollX = _a.minScrollX, BScrollMaxScrollX = _a.maxScrollX, BScrollMinScrollY = _a.minScrollY, BScrollMaxScrollY = _a.maxScrollY;
            var _b = this.scroll, x = _b.x, y = _b.y;
            if (hasHorizontalScroll) {
                var newPosX = between(currentX + deltaX, Math.min(this.minScrollX, this.maxScrollX), Math.max(this.minScrollX, this.maxScrollX));
                var roundX = Math.round((newPosX / this.ratioX) * this.translateXSign);
                x = between(roundX, BScrollMaxScrollX, BScrollMinScrollX);
            }
            if (hasVerticalScroll) {
                var newPosY = between(currentY + deltaY, Math.min(this.minScrollY, this.maxScrollY), Math.max(this.minScrollY, this.maxScrollY));
                var roundY = Math.round((newPosY / this.ratioY) * this.translateYSign);
                y = between(roundY, BScrollMaxScrollY, BScrollMinScrollY);
            }
            return { x: x, y: y };
        };
        Indicator.prototype.indicatorNotMoved = function (deltaX, deltaY) {
            var _a = this.currentPos, x = _a.x, y = _a.y;
            var xNotMoved = (x === this.minScrollX && deltaX <= 0) ||
                (x === this.maxScrollX && deltaX >= 0);
            var yNotMoved = (y === this.minScrollY && deltaY <= 0) ||
                (y === this.maxScrollY && deltaY >= 0);
            return xNotMoved && yNotMoved;
        };
        Indicator.prototype.syncBScroll = function (newPos) {
            var timestamp = getNow();
            var _a = this.scroll, options = _a.options, scroller = _a.scroller;
            var probeType = options.probeType, momentumLimitTime = options.momentumLimitTime;
            scroller.translater.translate(newPos);
            // dispatch scroll in interval time
            if (timestamp - this.startTime > momentumLimitTime) {
                this.startTime = timestamp;
                if (probeType === 1 /* Throttle */) {
                    scroller.hooks.trigger(scroller.hooks.eventTypes.scroll, newPos);
                }
            }
            // dispatch scroll all the time
            if (probeType > 1 /* Throttle */) {
                scroller.hooks.trigger(scroller.hooks.eventTypes.scroll, newPos);
            }
        };
        Indicator.prototype.updatePosition = function (BScrollPos) {
            var newIndicatorPos = this.getIndicatorPosByRatio(BScrollPos);
            this.applyTransformProperty(newIndicatorPos);
            this.currentPos = __assign({}, newIndicatorPos);
        };
        Indicator.prototype.applyTransformProperty = function (pos) {
            var translateZ = this.scroll.options.translateZ;
            var transformProperties = [
                "translateX(" + pos.x + "px)",
                "translateY(" + pos.y + "px)",
                "" + translateZ,
            ];
            this.indicatorEl.style[style.transform] =
                transformProperties.join(' ');
        };
        Indicator.prototype.getIndicatorPosByRatio = function (BScrollPos) {
            var x = BScrollPos.x, y = BScrollPos.y;
            var _a = this.scroll, hasHorizontalScroll = _a.hasHorizontalScroll, hasVerticalScroll = _a.hasVerticalScroll;
            var position = __assign({}, this.currentPos);
            if (hasHorizontalScroll) {
                var roundX = Math.round(this.ratioX * x * this.translateXSign);
                // maybe maxScrollX is negative
                position.x = between(roundX, Math.min(this.minScrollX, this.maxScrollX), Math.max(this.minScrollX, this.maxScrollX));
            }
            if (hasVerticalScroll) {
                var roundY = Math.round(this.ratioY * y * this.translateYSign);
                // maybe maxScrollY is negative
                position.y = between(roundY, Math.min(this.minScrollY, this.maxScrollY), Math.max(this.minScrollY, this.maxScrollY));
            }
            return position;
        };
        Indicator.prototype.destroy = function () {
            if (this.options.interactive !== false) {
                this.startEventRegister.destroy();
                this.moveEventRegister.destroy();
                this.endEventRegister.destroy();
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

    var Indicators = /** @class */ (function () {
        function Indicators(scroll) {
            this.scroll = scroll;
            this.options = [];
            this.indicators = [];
            this.handleOptions();
            this.handleHooks();
        }
        Indicators.prototype.handleOptions = function () {
            var UserIndicatorsOptions = this.scroll.options.indicators;
            assert(Array.isArray(UserIndicatorsOptions), "'indicators' must be an array.");
            for (var _i = 0, UserIndicatorsOptions_1 = UserIndicatorsOptions; _i < UserIndicatorsOptions_1.length; _i++) {
                var indicatorOptions = UserIndicatorsOptions_1[_i];
                assert(!!indicatorOptions.relationElement, "'relationElement' must be a HTMLElement.");
                this.createIndicators(indicatorOptions);
            }
        };
        Indicators.prototype.createIndicators = function (options) {
            this.indicators.push(new Indicator(this.scroll, options));
        };
        Indicators.prototype.handleHooks = function () {
            var _this = this;
            var scrollHooks = this.scroll.hooks;
            scrollHooks.on(scrollHooks.eventTypes.destroy, function () {
                for (var _i = 0, _a = _this.indicators; _i < _a.length; _i++) {
                    var indicator = _a[_i];
                    indicator.destroy();
                }
                _this.indicators = [];
            });
        };
        Indicators.pluginName = 'indicators';
        return Indicators;
    }());

    return Indicators;

}));
