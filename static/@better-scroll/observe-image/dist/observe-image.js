/*!
 * better-scroll / observe-image
 * (c) 2016-2023 ustbhuangyi
 * Released under the MIT License.
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.ObserveImage = factory());
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

  var isImageTag = function (el) {
      return el.tagName.toLowerCase() === 'img';
  };
  var ObserveImage = /** @class */ (function () {
      function ObserveImage(scroll) {
          this.scroll = scroll;
          this.refreshTimer = 0;
          this.init();
      }
      ObserveImage.prototype.init = function () {
          this.handleOptions(this.scroll.options.observeImage);
          this.bindEventsToWrapper();
      };
      ObserveImage.prototype.handleOptions = function (userOptions) {
          if (userOptions === void 0) { userOptions = {}; }
          userOptions = (userOptions === true ? {} : userOptions);
          var defaultOptions = {
              debounceTime: 100,
          };
          this.options = extend(defaultOptions, userOptions);
      };
      ObserveImage.prototype.bindEventsToWrapper = function () {
          var wrapper = this.scroll.scroller.wrapper;
          this.imageLoadEventRegister = new EventRegister(wrapper, [
              {
                  name: 'load',
                  handler: this.load.bind(this),
                  capture: true,
              },
          ]);
          this.imageErrorEventRegister = new EventRegister(wrapper, [
              {
                  name: 'error',
                  handler: this.load.bind(this),
                  capture: true,
              },
          ]);
      };
      ObserveImage.prototype.load = function (e) {
          var _this = this;
          var target = e.target;
          var debounceTime = this.options.debounceTime;
          if (target && isImageTag(target)) {
              if (debounceTime === 0) {
                  this.scroll.refresh();
              }
              else {
                  clearTimeout(this.refreshTimer);
                  this.refreshTimer = window.setTimeout(function () {
                      _this.scroll.refresh();
                  }, this.options.debounceTime);
              }
          }
      };
      ObserveImage.pluginName = 'observeImage';
      return ObserveImage;
  }());

  return ObserveImage;

}));
