/*!
 * better-scroll / pull-up
 * (c) 2016-2023 ustbhuangyi
 * Released under the MIT License.
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.PullUp = factory());
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

  var sourcePrefix = 'plugins.pullUpLoad';
  var propertiesMap = [
      {
          key: 'finishPullUp',
          name: 'finishPullUp'
      },
      {
          key: 'openPullUp',
          name: 'openPullUp'
      },
      {
          key: 'closePullUp',
          name: 'closePullUp'
      },
      {
          key: 'autoPullUpLoad',
          name: 'autoPullUpLoad'
      }
  ];
  var propertiesConfig = propertiesMap.map(function (item) {
      return {
          key: item.key,
          sourceKey: sourcePrefix + "." + item.name
      };
  });

  var PULL_UP_HOOKS_NAME = 'pullingUp';
  var PullUp = /** @class */ (function () {
      function PullUp(scroll) {
          this.scroll = scroll;
          this.pulling = false;
          this.watching = false;
          this.init();
      }
      PullUp.prototype.init = function () {
          this.handleBScroll();
          this.handleOptions(this.scroll.options.pullUpLoad);
          this.handleHooks();
          this.watch();
      };
      PullUp.prototype.handleBScroll = function () {
          this.scroll.registerType([PULL_UP_HOOKS_NAME]);
          this.scroll.proxy(propertiesConfig);
      };
      PullUp.prototype.handleOptions = function (userOptions) {
          if (userOptions === void 0) { userOptions = {}; }
          userOptions = (userOptions === true ? {} : userOptions);
          var defaultOptions = {
              threshold: 0,
          };
          this.options = extend(defaultOptions, userOptions);
          this.scroll.options.probeType = 3 /* Realtime */;
      };
      PullUp.prototype.handleHooks = function () {
          var _this = this;
          this.hooksFn = [];
          var scrollBehaviorY = this.scroll.scroller.scrollBehaviorY;
          this.registerHooks(this.scroll.hooks, this.scroll.hooks.eventTypes.contentChanged, function () {
              _this.finishPullUp();
          });
          this.registerHooks(scrollBehaviorY.hooks, scrollBehaviorY.hooks.eventTypes.computeBoundary, function (boundary) {
              // content is smaller than wrapper
              if (boundary.maxScrollPos > 0) {
                  // allow scrolling when content is not full of wrapper
                  boundary.maxScrollPos = -1;
              }
          });
      };
      PullUp.prototype.registerHooks = function (hooks, name, handler) {
          hooks.on(name, handler, this);
          this.hooksFn.push([hooks, name, handler]);
      };
      PullUp.prototype.watch = function () {
          if (this.watching) {
              return;
          }
          this.watching = true;
          this.registerHooks(this.scroll, this.scroll.eventTypes.scroll, this.checkPullUp);
      };
      PullUp.prototype.unwatch = function () {
          this.watching = false;
          this.scroll.off(this.scroll.eventTypes.scroll, this.checkPullUp);
      };
      PullUp.prototype.checkPullUp = function (pos) {
          var _this = this;
          var threshold = this.options.threshold;
          if (this.scroll.movingDirectionY === 1 /* Positive */ &&
              pos.y <= this.scroll.maxScrollY + threshold) {
              this.pulling = true;
              // must reset pulling after scrollEnd
              this.scroll.once(this.scroll.eventTypes.scrollEnd, function () {
                  _this.pulling = false;
              });
              this.unwatch();
              this.scroll.trigger(PULL_UP_HOOKS_NAME);
          }
      };
      PullUp.prototype.finishPullUp = function () {
          var _this = this;
          // reset Direction, fix #936
          this.scroll.scroller.scrollBehaviorY.setMovingDirection(0 /* Default */);
          if (this.pulling) {
              this.scroll.once(this.scroll.eventTypes.scrollEnd, function () {
                  _this.watch();
              });
          }
          else {
              this.watch();
          }
      };
      // allow 'true' type is compat for beta version implements
      PullUp.prototype.openPullUp = function (config) {
          if (config === void 0) { config = {}; }
          this.handleOptions(config);
          this.watch();
      };
      PullUp.prototype.closePullUp = function () {
          this.unwatch();
      };
      PullUp.prototype.autoPullUpLoad = function () {
          var threshold = this.options.threshold;
          var scrollBehaviorY = this.scroll.scroller.scrollBehaviorY;
          if (this.pulling || !this.watching) {
              return;
          }
          // simulate a pullUp action
          var NEGATIVE_VALUE = -1;
          var outOfBoundaryPos = scrollBehaviorY.maxScrollPos + threshold + NEGATIVE_VALUE;
          this.scroll.scroller.scrollBehaviorY.setMovingDirection(NEGATIVE_VALUE);
          this.scroll.scrollTo(this.scroll.x, outOfBoundaryPos, this.scroll.options.bounceTime);
      };
      PullUp.pluginName = 'pullUpLoad';
      return PullUp;
  }());

  return PullUp;

}));
