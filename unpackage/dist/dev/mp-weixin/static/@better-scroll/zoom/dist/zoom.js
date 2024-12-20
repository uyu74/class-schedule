/*!
 * better-scroll / zoom
 * (c) 2016-2023 ustbhuangyi
 * Released under the MIT License.
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Zoom = factory());
})(this, (function () { 'use strict';

  var sourcePrefix = 'plugins.zoom';
  var propertiesMap = [
      {
          key: 'zoomTo',
          name: 'zoomTo'
      }
  ];
  var propertiesConfig = propertiesMap.map(function (item) {
      return {
          key: item.key,
          sourceKey: sourcePrefix + "." + item.name
      };
  });

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
  function getDistance(x, y) {
      return Math.sqrt(x * x + y * y);
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
  function offsetToBody(el) {
      var rect = el.getBoundingClientRect();
      return {
          left: -(rect.left + window.pageXOffset),
          top: -(rect.top + window.pageYOffset),
      };
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

  var DEFAULT_INTERVAL = 1000 / 60;
  var windowCompat = inBrowser && window;
  /* istanbul ignore next */
  function noop() { }
  var requestAnimationFrame = (function () {
      /* istanbul ignore if  */
      if (!inBrowser) {
          return noop;
      }
      return (windowCompat.requestAnimationFrame ||
          windowCompat.webkitRequestAnimationFrame ||
          windowCompat.mozRequestAnimationFrame ||
          windowCompat.oRequestAnimationFrame ||
          // if all else fails, use setTimeout
          function (callback) {
              return window.setTimeout(callback, callback.interval || DEFAULT_INTERVAL); // make interval as precise as possible.
          });
  })();
  var cancelAnimationFrame = (function () {
      /* istanbul ignore if  */
      if (!inBrowser) {
          return noop;
      }
      return (windowCompat.cancelAnimationFrame ||
          windowCompat.webkitCancelAnimationFrame ||
          windowCompat.mozCancelAnimationFrame ||
          windowCompat.oCancelAnimationFrame ||
          function (id) {
              window.clearTimeout(id);
          });
  })();

  var TWO_FINGERS = 2;
  var RAW_SCALE = 1;
  var Zoom = /** @class */ (function () {
      function Zoom(scroll) {
          this.scroll = scroll;
          this.scale = RAW_SCALE;
          this.prevScale = 1;
          this.init();
      }
      Zoom.prototype.init = function () {
          this.handleBScroll();
          this.handleOptions();
          this.handleHooks();
          this.tryInitialZoomTo(this.zoomOpt);
      };
      Zoom.prototype.zoomTo = function (scale, x, y, bounceTime) {
          var _a = this.resolveOrigin(x, y), originX = _a.originX, originY = _a.originY;
          var origin = {
              x: originX,
              y: originY,
              baseScale: this.scale,
          };
          this._doZoomTo(scale, origin, bounceTime, true);
      };
      Zoom.prototype.handleBScroll = function () {
          this.scroll.proxy(propertiesConfig);
          this.scroll.registerType([
              'beforeZoomStart',
              'zoomStart',
              'zooming',
              'zoomEnd',
          ]);
      };
      Zoom.prototype.handleOptions = function () {
          var userOptions = (this.scroll.options.zoom === true
              ? {}
              : this.scroll.options.zoom);
          var defaultOptions = {
              start: 1,
              min: 1,
              max: 4,
              initialOrigin: [0, 0],
              minimalZoomDistance: 5,
              bounceTime: 800,
          };
          this.zoomOpt = extend(defaultOptions, userOptions);
      };
      Zoom.prototype.handleHooks = function () {
          var _this = this;
          var scroll = this.scroll;
          var scroller = this.scroll.scroller;
          this.wrapper = this.scroll.scroller.wrapper;
          this.setTransformOrigin(this.scroll.scroller.content);
          var scrollBehaviorX = scroller.scrollBehaviorX;
          var scrollBehaviorY = scroller.scrollBehaviorY;
          this.hooksFn = [];
          // BScroll
          this.registerHooks(scroll.hooks, scroll.hooks.eventTypes.contentChanged, function (content) {
              _this.setTransformOrigin(content);
              _this.scale = RAW_SCALE;
              _this.tryInitialZoomTo(_this.zoomOpt);
          });
          this.registerHooks(scroll.hooks, scroll.hooks.eventTypes.beforeInitialScrollTo, function () {
              // if perform a zoom action, we should prevent initial scroll when initialised
              if (_this.zoomOpt.start !== RAW_SCALE) {
                  return true;
              }
          });
          // enlarge boundary
          this.registerHooks(scrollBehaviorX.hooks, scrollBehaviorX.hooks.eventTypes.beforeComputeBoundary, function () {
              // content may change, don't cache it's size
              var contentSize = getRect(_this.scroll.scroller.content);
              scrollBehaviorX.contentSize = Math.floor(contentSize.width * _this.scale);
          });
          this.registerHooks(scrollBehaviorY.hooks, scrollBehaviorY.hooks.eventTypes.beforeComputeBoundary, function () {
              // content may change, don't cache it's size
              var contentSize = getRect(_this.scroll.scroller.content);
              scrollBehaviorY.contentSize = Math.floor(contentSize.height * _this.scale);
          });
          // touch event
          this.registerHooks(scroller.actions.hooks, scroller.actions.hooks.eventTypes.start, function (e) {
              var numberOfFingers = (e.touches && e.touches.length) || 0;
              _this.fingersOperation(numberOfFingers);
              if (numberOfFingers === TWO_FINGERS) {
                  _this.zoomStart(e);
              }
          });
          this.registerHooks(scroller.actions.hooks, scroller.actions.hooks.eventTypes.beforeMove, function (e) {
              var numberOfFingers = (e.touches && e.touches.length) || 0;
              _this.fingersOperation(numberOfFingers);
              if (numberOfFingers === TWO_FINGERS) {
                  _this.zoom(e);
                  return true;
              }
          });
          this.registerHooks(scroller.actions.hooks, scroller.actions.hooks.eventTypes.beforeEnd, function (e) {
              var numberOfFingers = _this.fingersOperation();
              if (numberOfFingers === TWO_FINGERS) {
                  _this.zoomEnd();
                  return true;
              }
          });
          this.registerHooks(scroller.translater.hooks, scroller.translater.hooks.eventTypes.beforeTranslate, function (transformStyle, point) {
              var scale = point.scale ? point.scale : _this.prevScale;
              _this.prevScale = scale;
              transformStyle.push("scale(" + scale + ")");
          });
          this.registerHooks(scroller.hooks, scroller.hooks.eventTypes.scrollEnd, function () {
              if (_this.fingersOperation() === TWO_FINGERS) {
                  _this.scroll.trigger(_this.scroll.eventTypes.zoomEnd, {
                      scale: _this.scale,
                  });
              }
          });
          this.registerHooks(this.scroll.hooks, 'destroy', this.destroy);
      };
      Zoom.prototype.setTransformOrigin = function (content) {
          content.style[style.transformOrigin] = '0 0';
      };
      Zoom.prototype.tryInitialZoomTo = function (options) {
          var start = options.start, initialOrigin = options.initialOrigin;
          var _a = this.scroll.scroller, scrollBehaviorX = _a.scrollBehaviorX, scrollBehaviorY = _a.scrollBehaviorY;
          if (start !== RAW_SCALE) {
              // Movable plugin may wanna modify minScrollPos or maxScrollPos
              // so we force Movable to caculate them
              this.resetBoundaries([scrollBehaviorX, scrollBehaviorY]);
              this.zoomTo(start, initialOrigin[0], initialOrigin[1], 0);
          }
      };
      // getter or setter operation
      Zoom.prototype.fingersOperation = function (amounts) {
          if (typeof amounts === 'number') {
              this.numberOfFingers = amounts;
          }
          else {
              return this.numberOfFingers;
          }
      };
      Zoom.prototype._doZoomTo = function (scale, origin, time, useCurrentPos) {
          var _this = this;
          if (time === void 0) { time = this.zoomOpt.bounceTime; }
          if (useCurrentPos === void 0) { useCurrentPos = false; }
          var _a = this.zoomOpt, min = _a.min, max = _a.max;
          var fromScale = this.scale;
          var toScale = between(scale, min, max);
          (function () {
              if (time === 0) {
                  _this.scroll.trigger(_this.scroll.eventTypes.zooming, {
                      scale: toScale,
                  });
                  return;
              }
              if (time > 0) {
                  var timer_1;
                  var startTime_1 = getNow();
                  var endTime_1 = startTime_1 + time;
                  var scheduler_1 = function () {
                      var now = getNow();
                      if (now >= endTime_1) {
                          _this.scroll.trigger(_this.scroll.eventTypes.zooming, {
                              scale: toScale,
                          });
                          cancelAnimationFrame(timer_1);
                          return;
                      }
                      var ratio = ease.bounce.fn((now - startTime_1) / time);
                      var currentScale = ratio * (toScale - fromScale) + fromScale;
                      _this.scroll.trigger(_this.scroll.eventTypes.zooming, {
                          scale: currentScale,
                      });
                      timer_1 = requestAnimationFrame(scheduler_1);
                  };
                  // start scheduler job
                  scheduler_1();
              }
          })();
          // suppose you are zooming by two fingers
          this.fingersOperation(2);
          this._zoomTo(toScale, fromScale, origin, time, useCurrentPos);
      };
      Zoom.prototype._zoomTo = function (toScale, fromScale, origin, time, useCurrentPos) {
          if (useCurrentPos === void 0) { useCurrentPos = false; }
          var ratio = toScale / origin.baseScale;
          this.setScale(toScale);
          var scroller = this.scroll.scroller;
          var scrollBehaviorX = scroller.scrollBehaviorX, scrollBehaviorY = scroller.scrollBehaviorY;
          this.resetBoundaries([scrollBehaviorX, scrollBehaviorY]);
          // position is restrained in boundary
          var newX = this.getNewPos(origin.x, ratio, scrollBehaviorX, true, useCurrentPos);
          var newY = this.getNewPos(origin.y, ratio, scrollBehaviorY, true, useCurrentPos);
          if (scrollBehaviorX.currentPos !== Math.round(newX) ||
              scrollBehaviorY.currentPos !== Math.round(newY) ||
              toScale !== fromScale) {
              scroller.scrollTo(newX, newY, time, ease.bounce, {
                  start: {
                      scale: fromScale,
                  },
                  end: {
                      scale: toScale,
                  },
              });
          }
      };
      Zoom.prototype.resolveOrigin = function (x, y) {
          var _a = this.scroll.scroller, scrollBehaviorX = _a.scrollBehaviorX, scrollBehaviorY = _a.scrollBehaviorY;
          var resolveFormula = {
              left: function () {
                  return 0;
              },
              top: function () {
                  return 0;
              },
              right: function () {
                  return scrollBehaviorX.contentSize;
              },
              bottom: function () {
                  return scrollBehaviorY.contentSize;
              },
              center: function (index) {
                  var baseSize = index === 0
                      ? scrollBehaviorX.contentSize
                      : scrollBehaviorY.contentSize;
                  return baseSize / 2;
              },
          };
          return {
              originX: typeof x === 'number' ? x : resolveFormula[x](0),
              originY: typeof y === 'number' ? y : resolveFormula[y](1),
          };
      };
      Zoom.prototype.zoomStart = function (e) {
          var firstFinger = e.touches[0];
          var secondFinger = e.touches[1];
          this.startDistance = this.getFingerDistance(e);
          this.startScale = this.scale;
          var _a = offsetToBody(this.wrapper), left = _a.left, top = _a.top;
          this.origin = {
              x: Math.abs(firstFinger.pageX + secondFinger.pageX) / 2 +
                  left -
                  this.scroll.x,
              y: Math.abs(firstFinger.pageY + secondFinger.pageY) / 2 +
                  top -
                  this.scroll.y,
              baseScale: this.startScale,
          };
          this.scroll.trigger(this.scroll.eventTypes.beforeZoomStart);
      };
      Zoom.prototype.zoom = function (e) {
          var currentDistance = this.getFingerDistance(e);
          // at least minimalZoomDistance pixels for the zoom to initiate
          if (!this.zoomed &&
              Math.abs(currentDistance - this.startDistance) <
                  this.zoomOpt.minimalZoomDistance) {
              return;
          }
          // when out of boundary , perform a damping algorithm
          var endScale = this.dampingScale((currentDistance / this.startDistance) * this.startScale);
          var ratio = endScale / this.startScale;
          this.setScale(endScale);
          if (!this.zoomed) {
              this.zoomed = true;
              this.scroll.trigger(this.scroll.eventTypes.zoomStart);
          }
          var scroller = this.scroll.scroller;
          var scrollBehaviorX = scroller.scrollBehaviorX, scrollBehaviorY = scroller.scrollBehaviorY;
          var x = this.getNewPos(this.origin.x, ratio, scrollBehaviorX, false, false);
          var y = this.getNewPos(this.origin.y, ratio, scrollBehaviorY, false, false);
          this.scroll.trigger(this.scroll.eventTypes.zooming, {
              scale: this.scale,
          });
          scroller.translater.translate({ x: x, y: y, scale: endScale });
      };
      Zoom.prototype.zoomEnd = function () {
          if (!this.zoomed)
              return;
          // if out of boundary, do rebound!
          if (this.shouldRebound()) {
              this._doZoomTo(this.scale, this.origin, this.zoomOpt.bounceTime);
              return;
          }
          this.scroll.trigger(this.scroll.eventTypes.zoomEnd, { scale: this.scale });
      };
      Zoom.prototype.getFingerDistance = function (e) {
          var firstFinger = e.touches[0];
          var secondFinger = e.touches[1];
          var deltaX = Math.abs(firstFinger.pageX - secondFinger.pageX);
          var deltaY = Math.abs(firstFinger.pageY - secondFinger.pageY);
          return getDistance(deltaX, deltaY);
      };
      Zoom.prototype.shouldRebound = function () {
          var _a = this.zoomOpt, min = _a.min, max = _a.max;
          var currentScale = this.scale;
          // scale exceeded!
          if (currentScale !== between(currentScale, min, max)) {
              return true;
          }
          var _b = this.scroll.scroller, scrollBehaviorX = _b.scrollBehaviorX, scrollBehaviorY = _b.scrollBehaviorY;
          // enlarge boundaries manually when zoom is end
          this.resetBoundaries([scrollBehaviorX, scrollBehaviorY]);
          var xInBoundary = scrollBehaviorX.checkInBoundary().inBoundary;
          var yInBoundary = scrollBehaviorX.checkInBoundary().inBoundary;
          return !(xInBoundary && yInBoundary);
      };
      Zoom.prototype.dampingScale = function (scale) {
          var _a = this.zoomOpt, min = _a.min, max = _a.max;
          if (scale < min) {
              scale = 0.5 * min * Math.pow(2.0, scale / min);
          }
          else if (scale > max) {
              scale = 2.0 * max * Math.pow(0.5, max / scale);
          }
          return scale;
      };
      Zoom.prototype.setScale = function (scale) {
          this.scale = scale;
      };
      Zoom.prototype.resetBoundaries = function (scrollBehaviorPairs) {
          scrollBehaviorPairs.forEach(function (behavior) { return behavior.computeBoundary(); });
      };
      Zoom.prototype.getNewPos = function (origin, lastScale, scrollBehavior, shouldInBoundary, useCurrentPos) {
          if (useCurrentPos === void 0) { useCurrentPos = false; }
          var newPos = origin -
              origin * lastScale +
              (useCurrentPos ? scrollBehavior.currentPos : scrollBehavior.startPos);
          if (shouldInBoundary) {
              newPos = between(newPos, scrollBehavior.maxScrollPos, scrollBehavior.minScrollPos);
          }
          // maxScrollPos or minScrollPos maybe a negative or positive digital
          return newPos > 0 ? Math.floor(newPos) : Math.ceil(newPos);
      };
      Zoom.prototype.registerHooks = function (hooks, name, handler) {
          hooks.on(name, handler, this);
          this.hooksFn.push([hooks, name, handler]);
      };
      Zoom.prototype.destroy = function () {
          this.hooksFn.forEach(function (item) {
              var hooks = item[0];
              var hooksName = item[1];
              var handlerFn = item[2];
              hooks.off(hooksName, handlerFn);
          });
          this.hooksFn.length = 0;
      };
      Zoom.pluginName = 'zoom';
      return Zoom;
  }());

  return Zoom;

}));
