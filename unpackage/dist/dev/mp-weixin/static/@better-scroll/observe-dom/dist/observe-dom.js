/*!
 * better-scroll / observe-dom
 * (c) 2016-2023 ustbhuangyi
 * Released under the MIT License.
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.ObserveDom = factory());
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

  var ObserveDOM = /** @class */ (function () {
      function ObserveDOM(scroll) {
          this.scroll = scroll;
          this.stopObserver = false;
          this.init();
      }
      ObserveDOM.prototype.init = function () {
          this.handleMutationObserver();
          this.handleHooks();
      };
      ObserveDOM.prototype.handleMutationObserver = function () {
          var _this = this;
          if (typeof MutationObserver !== 'undefined') {
              var timer_1 = 0;
              this.observer = new MutationObserver(function (mutations) {
                  _this.mutationObserverHandler(mutations, timer_1);
              });
              this.startObserve(this.observer);
          }
          else {
              this.checkDOMUpdate();
          }
      };
      ObserveDOM.prototype.handleHooks = function () {
          var _this = this;
          this.hooksFn = [];
          this.registerHooks(this.scroll.hooks, this.scroll.hooks.eventTypes.contentChanged, function () {
              _this.stopObserve();
              // launch a new mutationObserver
              _this.handleMutationObserver();
          });
          this.registerHooks(this.scroll.hooks, this.scroll.hooks.eventTypes.enable, function () {
              if (_this.stopObserver) {
                  _this.handleMutationObserver();
              }
          });
          this.registerHooks(this.scroll.hooks, this.scroll.hooks.eventTypes.disable, function () {
              _this.stopObserve();
          });
          this.registerHooks(this.scroll.hooks, this.scroll.hooks.eventTypes.destroy, function () {
              _this.destroy();
          });
      };
      ObserveDOM.prototype.mutationObserverHandler = function (mutations, timer) {
          var _this = this;
          if (this.shouldNotRefresh()) {
              return;
          }
          var immediateRefresh = false;
          var deferredRefresh = false;
          for (var i = 0; i < mutations.length; i++) {
              var mutation = mutations[i];
              if (mutation.type !== 'attributes') {
                  immediateRefresh = true;
                  break;
              }
              else {
                  if (mutation.target !== this.scroll.scroller.content) {
                      deferredRefresh = true;
                      break;
                  }
              }
          }
          if (immediateRefresh) {
              this.scroll.refresh();
          }
          else if (deferredRefresh) {
              // attributes changes too often
              clearTimeout(timer);
              timer = window.setTimeout(function () {
                  if (!_this.shouldNotRefresh()) {
                      _this.scroll.refresh();
                  }
              }, 60);
          }
      };
      ObserveDOM.prototype.startObserve = function (observer) {
          var config = {
              attributes: true,
              childList: true,
              subtree: true,
          };
          observer.observe(this.scroll.scroller.content, config);
      };
      ObserveDOM.prototype.shouldNotRefresh = function () {
          var scroller = this.scroll.scroller;
          var scrollBehaviorX = scroller.scrollBehaviorX, scrollBehaviorY = scroller.scrollBehaviorY;
          var outsideBoundaries = scrollBehaviorX.currentPos > scrollBehaviorX.minScrollPos ||
              scrollBehaviorX.currentPos < scrollBehaviorX.maxScrollPos ||
              scrollBehaviorY.currentPos > scrollBehaviorY.minScrollPos ||
              scrollBehaviorY.currentPos < scrollBehaviorY.maxScrollPos;
          return scroller.animater.pending || outsideBoundaries;
      };
      ObserveDOM.prototype.checkDOMUpdate = function () {
          var _this = this;
          var content = this.scroll.scroller.content;
          var contentRect = getRect(content);
          var oldWidth = contentRect.width;
          var oldHeight = contentRect.height;
          var check = function () {
              if (_this.stopObserver) {
                  return;
              }
              contentRect = getRect(content);
              var newWidth = contentRect.width;
              var newHeight = contentRect.height;
              if (oldWidth !== newWidth || oldHeight !== newHeight) {
                  _this.scroll.refresh();
              }
              oldWidth = newWidth;
              oldHeight = newHeight;
              next();
          };
          var next = function () {
              setTimeout(function () {
                  check();
              }, 1000);
          };
          next();
      };
      ObserveDOM.prototype.registerHooks = function (hooks, name, handler) {
          hooks.on(name, handler, this);
          this.hooksFn.push([hooks, name, handler]);
      };
      ObserveDOM.prototype.stopObserve = function () {
          this.stopObserver = true;
          if (this.observer) {
              this.observer.disconnect();
          }
      };
      ObserveDOM.prototype.destroy = function () {
          this.stopObserve();
          this.hooksFn.forEach(function (item) {
              var hooks = item[0];
              var hooksName = item[1];
              var handlerFn = item[2];
              hooks.off(hooksName, handlerFn);
          });
          this.hooksFn.length = 0;
      };
      ObserveDOM.pluginName = 'observeDOM';
      return ObserveDOM;
  }());

  return ObserveDOM;

}));
