/*!
 * better-scroll / wheel
 * (c) 2016-2023 ustbhuangyi
 * Released under the MIT License.
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Wheel = factory());
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
  function hasClass(el, className) {
      var reg = new RegExp('(^|\\s)' + className + '(\\s|$)');
      return reg.test(el.className);
  }
  function HTMLCollectionToArray(el) {
      return Array.prototype.slice.call(el, 0);
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

  var sourcePrefix = 'plugins.wheel';
  var propertiesMap = [
      {
          key: 'wheelTo',
          name: 'wheelTo',
      },
      {
          key: 'getSelectedIndex',
          name: 'getSelectedIndex',
      },
      {
          key: 'restorePosition',
          name: 'restorePosition',
      },
  ];
  var propertiesConfig = propertiesMap.map(function (item) {
      return {
          key: item.key,
          sourceKey: sourcePrefix + "." + item.name,
      };
  });

  var WHEEL_INDEX_CHANGED_EVENT_NAME = 'wheelIndexChanged';
  var CONSTANTS = {
      rate: 4
  };
  var Wheel = /** @class */ (function () {
      function Wheel(scroll) {
          this.scroll = scroll;
          this.init();
      }
      Wheel.prototype.init = function () {
          this.handleBScroll();
          this.handleOptions();
          this.handleHooks();
          // init boundary for Wheel
          this.refreshBoundary();
          this.setSelectedIndex(this.options.selectedIndex);
      };
      Wheel.prototype.handleBScroll = function () {
          this.scroll.proxy(propertiesConfig);
          this.scroll.registerType([WHEEL_INDEX_CHANGED_EVENT_NAME]);
      };
      Wheel.prototype.handleOptions = function () {
          var userOptions = (this.scroll.options.wheel === true
              ? {}
              : this.scroll.options.wheel);
          var defaultOptions = {
              wheelWrapperClass: 'wheel-scroll',
              wheelItemClass: 'wheel-item',
              rotate: 25,
              adjustTime: 400,
              selectedIndex: 0,
              wheelDisabledItemClass: 'wheel-disabled-item'
          };
          this.options = extend(defaultOptions, userOptions);
      };
      Wheel.prototype.handleHooks = function () {
          var _this = this;
          var scroll = this.scroll;
          var scroller = this.scroll.scroller;
          var actionsHandler = scroller.actionsHandler, scrollBehaviorX = scroller.scrollBehaviorX, scrollBehaviorY = scroller.scrollBehaviorY, animater = scroller.animater;
          var prevContent = scroller.content;
          // BScroll
          scroll.on(scroll.eventTypes.scrollEnd, function (position) {
              var index = _this.findNearestValidWheel(position.y).index;
              if (scroller.animater.forceStopped && !_this.isAdjustingPosition) {
                  _this.target = _this.items[index];
                  // since stopped from an animation.
                  // prevent user's scrollEnd callback triggered twice
                  return true;
              }
              else {
                  _this.setSelectedIndex(index);
                  if (_this.isAdjustingPosition) {
                      _this.isAdjustingPosition = false;
                  }
              }
          });
          // BScroll.hooks
          this.scroll.hooks.on(this.scroll.hooks.eventTypes.refresh, function (content) {
              if (content !== prevContent) {
                  prevContent = content;
                  _this.setSelectedIndex(_this.options.selectedIndex, true);
              }
              // rotate all wheel-items
              // because position may not change
              _this.rotateX(_this.scroll.y);
              // check we are stop at a disable item or not
              _this.wheelTo(_this.selectedIndex, 0);
          });
          this.scroll.hooks.on(this.scroll.hooks.eventTypes.beforeInitialScrollTo, function (position) {
              // selectedIndex has higher priority than bs.options.startY
              position.x = 0;
              position.y = -(_this.selectedIndex * _this.itemHeight);
          });
          // Scroller
          scroller.hooks.on(scroller.hooks.eventTypes.checkClick, function () {
              var index = HTMLCollectionToArray(_this.items).indexOf(_this.target);
              if (index === -1)
                  return true;
              _this.wheelTo(index, _this.options.adjustTime, ease.swipe);
              return true;
          });
          scroller.hooks.on(scroller.hooks.eventTypes.scrollTo, function (endPoint) {
              endPoint.y = _this.findNearestValidWheel(endPoint.y).y;
          });
          // when content is scrolling
          // click wheel-item DOM repeatedly and crazily will cause scrollEnd not triggered
          // so reset forceStopped
          scroller.hooks.on(scroller.hooks.eventTypes.minDistanceScroll, function () {
              var animater = scroller.animater;
              if (animater.forceStopped === true) {
                  animater.forceStopped = false;
              }
          });
          scroller.hooks.on(scroller.hooks.eventTypes.scrollToElement, function (el, pos) {
              if (!hasClass(el, _this.options.wheelItemClass)) {
                  return true;
              }
              else {
                  pos.top = _this.findNearestValidWheel(pos.top).y;
              }
          });
          // ActionsHandler
          actionsHandler.hooks.on(actionsHandler.hooks.eventTypes.beforeStart, function (e) {
              _this.target = e.target;
          });
          // ScrollBehaviorX
          // Wheel has no x direction now
          scrollBehaviorX.hooks.on(scrollBehaviorX.hooks.eventTypes.computeBoundary, function (boundary) {
              boundary.maxScrollPos = 0;
              boundary.minScrollPos = 0;
          });
          // ScrollBehaviorY
          scrollBehaviorY.hooks.on(scrollBehaviorY.hooks.eventTypes.computeBoundary, function (boundary) {
              _this.items = _this.scroll.scroller.content.children;
              _this.checkWheelAllDisabled();
              _this.itemHeight =
                  _this.items.length > 0
                      ? scrollBehaviorY.contentSize / _this.items.length
                      : 0;
              boundary.maxScrollPos = -_this.itemHeight * (_this.items.length - 1);
              boundary.minScrollPos = 0;
          });
          scrollBehaviorY.hooks.on(scrollBehaviorY.hooks.eventTypes.momentum, function (momentumInfo) {
              momentumInfo.rate = CONSTANTS.rate;
              momentumInfo.destination = _this.findNearestValidWheel(momentumInfo.destination).y;
          });
          scrollBehaviorY.hooks.on(scrollBehaviorY.hooks.eventTypes.end, function (momentumInfo) {
              var validWheel = _this.findNearestValidWheel(scrollBehaviorY.currentPos);
              momentumInfo.destination = validWheel.y;
              momentumInfo.duration = _this.options.adjustTime;
          });
          // Animater
          animater.hooks.on(animater.hooks.eventTypes.time, function (time) {
              _this.transitionDuration(time);
          });
          animater.hooks.on(animater.hooks.eventTypes.timeFunction, function (easing) {
              _this.timeFunction(easing);
          });
          // bs.stop() to make wheel stop at a correct position when pending
          animater.hooks.on(animater.hooks.eventTypes.callStop, function () {
              var index = _this.findNearestValidWheel(_this.scroll.y).index;
              _this.isAdjustingPosition = true;
              _this.wheelTo(index, 0);
          });
          // Translater
          animater.translater.hooks.on(animater.translater.hooks.eventTypes.translate, function (endPoint) {
              _this.rotateX(endPoint.y);
          });
      };
      Wheel.prototype.refreshBoundary = function () {
          var _a = this.scroll.scroller, scrollBehaviorX = _a.scrollBehaviorX, scrollBehaviorY = _a.scrollBehaviorY, content = _a.content;
          scrollBehaviorX.refresh(content);
          scrollBehaviorY.refresh(content);
      };
      Wheel.prototype.setSelectedIndex = function (index, contentChanged) {
          if (contentChanged === void 0) { contentChanged = false; }
          var prevSelectedIndex = this.selectedIndex;
          this.selectedIndex = index;
          // if content DOM changed, should not trigger event
          if (prevSelectedIndex !== index && !contentChanged) {
              this.scroll.trigger(WHEEL_INDEX_CHANGED_EVENT_NAME, index);
          }
      };
      Wheel.prototype.getSelectedIndex = function () {
          return this.selectedIndex;
      };
      Wheel.prototype.wheelTo = function (index, time, ease) {
          if (index === void 0) { index = 0; }
          if (time === void 0) { time = 0; }
          var y = -index * this.itemHeight;
          this.scroll.scrollTo(0, y, time, ease);
      };
      Wheel.prototype.restorePosition = function () {
          // bs is scrolling
          var isPending = this.scroll.pending;
          if (isPending) {
              var selectedIndex = this.getSelectedIndex();
              this.scroll.scroller.animater.clearTimer();
              this.wheelTo(selectedIndex, 0);
          }
      };
      Wheel.prototype.transitionDuration = function (time) {
          for (var i = 0; i < this.items.length; i++) {
              this.items[i].style[style.transitionDuration] =
                  time + 'ms';
          }
      };
      Wheel.prototype.timeFunction = function (easing) {
          for (var i = 0; i < this.items.length; i++) {
              this.items[i].style[style.transitionTimingFunction] = easing;
          }
      };
      Wheel.prototype.rotateX = function (y) {
          var _a = this.options.rotate, rotate = _a === void 0 ? 25 : _a;
          for (var i = 0; i < this.items.length; i++) {
              var deg = rotate * (y / this.itemHeight + i);
              // Too small value is invalid in some phones, issue 1026
              var SafeDeg = deg.toFixed(3);
              this.items[i].style[style.transform] = "rotateX(" + SafeDeg + "deg)";
          }
      };
      Wheel.prototype.findNearestValidWheel = function (y) {
          y = y > 0 ? 0 : y < this.scroll.maxScrollY ? this.scroll.maxScrollY : y;
          var currentIndex = Math.abs(Math.round(-y / this.itemHeight));
          var cacheIndex = currentIndex;
          var items = this.items;
          var wheelDisabledItemClassName = this.options
              .wheelDisabledItemClass;
          // implement web native select element
          // first, check whether there is a enable item whose index is smaller than currentIndex
          // then, check whether there is a enable item whose index is bigger than currentIndex
          // otherwise, there are all disabled items, just keep currentIndex unchange
          while (currentIndex >= 0) {
              if (!hasClass(items[currentIndex], wheelDisabledItemClassName)) {
                  break;
              }
              currentIndex--;
          }
          if (currentIndex < 0) {
              currentIndex = cacheIndex;
              while (currentIndex <= items.length - 1) {
                  if (!hasClass(items[currentIndex], wheelDisabledItemClassName)) {
                      break;
                  }
                  currentIndex++;
              }
          }
          // keep it unchange when all the items are disabled
          if (currentIndex === items.length) {
              currentIndex = cacheIndex;
          }
          // when all the items are disabled, selectedIndex should always be -1
          return {
              index: this.wheelItemsAllDisabled ? -1 : currentIndex,
              y: -currentIndex * this.itemHeight
          };
      };
      Wheel.prototype.checkWheelAllDisabled = function () {
          var wheelDisabledItemClassName = this.options.wheelDisabledItemClass;
          var items = this.items;
          this.wheelItemsAllDisabled = true;
          for (var i = 0; i < items.length; i++) {
              if (!hasClass(items[i], wheelDisabledItemClassName)) {
                  this.wheelItemsAllDisabled = false;
                  break;
              }
          }
      };
      Wheel.pluginName = 'wheel';
      return Wheel;
  }());

  return Wheel;

}));
