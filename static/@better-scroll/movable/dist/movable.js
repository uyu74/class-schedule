/*!
 * better-scroll / movable
 * (c) 2016-2023 ustbhuangyi
 * Released under the MIT License.
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Movable = factory());
})(this, (function () { 'use strict';

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

  var sourcePrefix = 'plugins.movable';
  var propertiesMap = [
      {
          key: 'putAt',
          name: 'putAt',
      },
  ];
  var propertiesConfig = propertiesMap.map(function (item) {
      return {
          key: item.key,
          sourceKey: sourcePrefix + "." + item.name,
      };
  });

  var Movable = /** @class */ (function () {
      function Movable(scroll) {
          this.scroll = scroll;
          this.handleBScroll();
          this.handleHooks();
      }
      Movable.prototype.handleBScroll = function () {
          this.scroll.proxy(propertiesConfig);
      };
      Movable.prototype.handleHooks = function () {
          var _this = this;
          this.hooksFn = [];
          var _a = this.scroll.scroller, scrollBehaviorX = _a.scrollBehaviorX, scrollBehaviorY = _a.scrollBehaviorY;
          var computeBoundary = function (boundary, behavior) {
              if (boundary.maxScrollPos > 0) {
                  // content is smaller than wrapper
                  boundary.minScrollPos = behavior.wrapperSize - behavior.contentSize;
                  boundary.maxScrollPos = 0;
              }
          };
          this.registerHooks(scrollBehaviorX.hooks, scrollBehaviorX.hooks.eventTypes.ignoreHasScroll, function () { return true; });
          this.registerHooks(scrollBehaviorX.hooks, scrollBehaviorX.hooks.eventTypes.computeBoundary, function (boundary) {
              computeBoundary(boundary, scrollBehaviorX);
          });
          this.registerHooks(scrollBehaviorY.hooks, scrollBehaviorY.hooks.eventTypes.ignoreHasScroll, function () { return true; });
          this.registerHooks(scrollBehaviorY.hooks, scrollBehaviorY.hooks.eventTypes.computeBoundary, function (boundary) {
              computeBoundary(boundary, scrollBehaviorY);
          });
          this.registerHooks(this.scroll.hooks, this.scroll.hooks.eventTypes.destroy, function () {
              _this.destroy();
          });
      };
      Movable.prototype.putAt = function (x, y, time, easing) {
          if (time === void 0) { time = this.scroll.options.bounceTime; }
          if (easing === void 0) { easing = ease.bounce; }
          var position = this.resolvePostion(x, y);
          this.scroll.scrollTo(position.x, position.y, time, easing);
      };
      Movable.prototype.resolvePostion = function (x, y) {
          var _a = this.scroll.scroller, scrollBehaviorX = _a.scrollBehaviorX, scrollBehaviorY = _a.scrollBehaviorY;
          var resolveFormula = {
              left: function () {
                  return 0;
              },
              top: function () {
                  return 0;
              },
              right: function () {
                  return scrollBehaviorX.minScrollPos;
              },
              bottom: function () {
                  return scrollBehaviorY.minScrollPos;
              },
              center: function (index) {
                  var baseSize = index === 0
                      ? scrollBehaviorX.minScrollPos
                      : scrollBehaviorY.minScrollPos;
                  return baseSize / 2;
              },
          };
          return {
              x: typeof x === 'number' ? x : resolveFormula[x](0),
              y: typeof y === 'number' ? y : resolveFormula[y](1),
          };
      };
      Movable.prototype.destroy = function () {
          this.hooksFn.forEach(function (item) {
              var hooks = item[0];
              var hooksName = item[1];
              var handlerFn = item[2];
              hooks.off(hooksName, handlerFn);
          });
          this.hooksFn.length = 0;
      };
      Movable.prototype.registerHooks = function (hooks, name, handler) {
          hooks.on(name, handler, this);
          this.hooksFn.push([hooks, name, handler]);
      };
      Movable.pluginName = 'movable';
      Movable.applyOrder = "pre" /* Pre */;
      return Movable;
  }());

  return Movable;

}));
