/*!
 * better-scroll / infinity
 * (c) 2016-2023 ustbhuangyi
 * Released under the MIT License.
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Infinity = factory());
})(this, (function () { 'use strict';

  function warn(msg) {
      console.error("[BScroll warn]: " + msg);
  }

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

  function __awaiter(thisArg, _arguments, P, generator) {
      function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
      return new (P || (P = Promise))(function (resolve, reject) {
          function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
          function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
          function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
          step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
  }

  function __generator(thisArg, body) {
      var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
      return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
      function verb(n) { return function (v) { return step([n, v]); }; }
      function step(op) {
          if (f) throw new TypeError("Generator is already executing.");
          while (_) try {
              if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
              if (y = 0, t) op = [op[0] & 2, t.value];
              switch (op[0]) {
                  case 0: case 1: t = op; break;
                  case 4: _.label++; return { value: op[1], done: false };
                  case 5: _.label++; y = op[1]; op = [0]; continue;
                  case 7: op = _.ops.pop(); _.trys.pop(); continue;
                  default:
                      if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                      if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                      if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                      if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                      if (t[2]) _.ops.pop();
                      _.trys.pop(); continue;
              }
              op = body.call(thisArg, _);
          } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
          if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
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
  var cssVendor = vendor && vendor !== 'standard' ? '-' + vendor.toLowerCase() + '-' : '';
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

  var PRE_NUM = 10;
  var POST_NUM = 30;
  var IndexCalculator = /** @class */ (function () {
      function IndexCalculator(wrapperHeight, tombstoneHeight) {
          this.wrapperHeight = wrapperHeight;
          this.tombstoneHeight = tombstoneHeight;
          this.lastDirection = 1 /* DOWN */;
          this.lastPos = 0;
      }
      IndexCalculator.prototype.calculate = function (pos, list) {
          var offset = pos - this.lastPos;
          this.lastPos = pos;
          var direction = this.getDirection(offset);
          // important! start index is much more important than end index.
          var start = this.calculateIndex(0, pos, list);
          var end = this.calculateIndex(start, pos + this.wrapperHeight, list);
          if (direction === 1 /* DOWN */) {
              start -= PRE_NUM;
              end += POST_NUM;
          }
          else {
              start -= POST_NUM;
              end += PRE_NUM;
          }
          if (start < 0) {
              start = 0;
          }
          return {
              start: start,
              end: end,
          };
      };
      IndexCalculator.prototype.getDirection = function (offset) {
          var direction;
          if (offset > 0) {
              direction = 1 /* DOWN */;
          }
          else if (offset < 0) {
              direction = 0 /* UP */;
          }
          else {
              return this.lastDirection;
          }
          this.lastDirection = direction;
          return direction;
      };
      IndexCalculator.prototype.calculateIndex = function (start, offset, list) {
          if (offset <= 0) {
              return start;
          }
          var i = start;
          var startPos = list[i] && list[i].pos !== -1 ? list[i].pos : 0;
          var lastPos = startPos;
          var tombstone = 0;
          while (i < list.length && list[i].pos < offset) {
              lastPos = list[i].pos;
              i++;
          }
          if (i === list.length) {
              tombstone = Math.floor((offset - lastPos) / this.tombstoneHeight);
          }
          i += tombstone;
          return i;
      };
      IndexCalculator.prototype.resetState = function () {
          this.lastDirection = 1 /* DOWN */;
          this.lastPos = 0;
      };
      return IndexCalculator;
  }());

  var ListItem = /** @class */ (function () {
      function ListItem() {
          this.data = null;
          this.dom = null;
          this.tombstone = null;
          this.width = 0;
          this.height = 0;
          this.pos = 0;
      }
      return ListItem;
  }());
  var DataManager = /** @class */ (function () {
      function DataManager(list, fetchFn, onFetchFinish) {
          this.fetchFn = fetchFn;
          this.onFetchFinish = onFetchFinish;
          this.loadedNum = 0;
          this.fetching = false;
          this.hasMore = true;
          this.list = list || [];
      }
      DataManager.prototype.update = function (end) {
          return __awaiter(this, void 0, void 0, function () {
              var len;
              return __generator(this, function (_a) {
                  if (!this.hasMore) {
                      end = Math.min(end, this.list.length);
                  }
                  // add data placeholder
                  if (end > this.list.length) {
                      len = end - this.list.length;
                      this.addEmptyData(len);
                  }
                  // tslint:disable-next-line: no-floating-promises
                  return [2 /*return*/, this.checkToFetch(end)];
              });
          });
      };
      DataManager.prototype.add = function (data) {
          for (var i = 0; i < data.length; i++) {
              if (!this.list[this.loadedNum]) {
                  this.list[this.loadedNum] = { data: data[i] };
              }
              else {
                  this.list[this.loadedNum] = __assign(__assign({}, this.list[this.loadedNum]), { data: data[i] });
              }
              this.loadedNum++;
          }
          return this.list;
      };
      DataManager.prototype.addEmptyData = function (len) {
          for (var i = 0; i < len; i++) {
              this.list.push(new ListItem());
          }
          return this.list;
      };
      DataManager.prototype.fetch = function (len) {
          return __awaiter(this, void 0, void 0, function () {
              var data;
              return __generator(this, function (_a) {
                  switch (_a.label) {
                      case 0:
                          if (this.fetching) {
                              return [2 /*return*/, []];
                          }
                          this.fetching = true;
                          return [4 /*yield*/, this.fetchFn(len)];
                      case 1:
                          data = _a.sent();
                          this.fetching = false;
                          return [2 /*return*/, data];
                  }
              });
          });
      };
      DataManager.prototype.checkToFetch = function (end) {
          return __awaiter(this, void 0, void 0, function () {
              var min, newData, currentEnd;
              return __generator(this, function (_a) {
                  switch (_a.label) {
                      case 0:
                          if (!this.hasMore) {
                              return [2 /*return*/];
                          }
                          if (end <= this.loadedNum) {
                              return [2 /*return*/];
                          }
                          min = end - this.loadedNum;
                          return [4 /*yield*/, this.fetch(min)];
                      case 1:
                          newData = _a.sent();
                          if (newData instanceof Array && newData.length) {
                              this.add(newData);
                              currentEnd = this.onFetchFinish(this.list, true);
                              return [2 /*return*/, this.checkToFetch(currentEnd)];
                          }
                          else if (typeof newData === 'boolean' && newData === false) {
                              this.hasMore = false;
                              this.list.splice(this.loadedNum);
                              this.onFetchFinish(this.list, false);
                          }
                          return [2 /*return*/];
                  }
              });
          });
      };
      DataManager.prototype.getList = function () {
          return this.list;
      };
      DataManager.prototype.resetState = function () {
          this.loadedNum = 0;
          this.fetching = false;
          this.hasMore = true;
          this.list = [];
      };
      return DataManager;
  }());

  var Tombstone = /** @class */ (function () {
      function Tombstone(create) {
          this.create = create;
          this.cached = [];
          this.width = 0;
          this.height = 0;
          this.initialed = false;
          this.getSize();
      }
      Tombstone.isTombstone = function (el) {
          if (el && el.classList) {
              return el.classList.contains('tombstone');
          }
          return false;
      };
      Tombstone.prototype.getSize = function () {
          if (!this.initialed) {
              var tombstone = this.create();
              tombstone.style.position = 'absolute';
              document.body.appendChild(tombstone);
              tombstone.style.display = '';
              this.height = tombstone.offsetHeight;
              this.width = tombstone.offsetWidth;
              document.body.removeChild(tombstone);
              this.cached.push(tombstone);
          }
      };
      Tombstone.prototype.getOne = function () {
          var tombstone = this.cached.pop();
          if (tombstone) {
              var tombstoneStyle = tombstone.style;
              tombstoneStyle.display = '';
              tombstoneStyle.opacity = '1';
              tombstoneStyle[style.transform] = '';
              tombstoneStyle[style.transition] = '';
              return tombstone;
          }
          return this.create();
      };
      Tombstone.prototype.recycle = function (tombstones) {
          for (var _i = 0, tombstones_1 = tombstones; _i < tombstones_1.length; _i++) {
              var tombstone = tombstones_1[_i];
              tombstone.style.display = 'none';
              this.cached.push(tombstone);
          }
          return this.cached;
      };
      Tombstone.prototype.recycleOne = function (tombstone) {
          this.cached.push(tombstone);
          return this.cached;
      };
      return Tombstone;
  }());

  var ANIMATION_DURATION_MS = 200;
  var DomManager = /** @class */ (function () {
      function DomManager(content, renderFn, tombstone) {
          this.renderFn = renderFn;
          this.tombstone = tombstone;
          this.unusedDom = [];
          this.timers = [];
          this.setContent(content);
      }
      DomManager.prototype.update = function (list, start, end) {
          if (start >= list.length) {
              start = list.length - 1;
          }
          if (end > list.length) {
              end = list.length;
          }
          this.collectUnusedDom(list, start, end);
          this.createDom(list, start, end);
          this.cacheHeight(list, start, end);
          var _a = this.positionDom(list, start, end), startPos = _a.startPos, startDelta = _a.startDelta, endPos = _a.endPos;
          return {
              start: start,
              startPos: startPos,
              startDelta: startDelta,
              end: end,
              endPos: endPos,
          };
      };
      DomManager.prototype.collectUnusedDom = function (list, start, end) {
          // TODO optimise
          for (var i = 0; i < list.length; i++) {
              if (i === start) {
                  i = end - 1;
                  continue;
              }
              if (list[i].dom) {
                  var dom = list[i].dom;
                  if (Tombstone.isTombstone(dom)) {
                      this.tombstone.recycleOne(dom);
                      dom.style.display = 'none';
                  }
                  else {
                      this.unusedDom.push(dom);
                  }
                  list[i].dom = null;
              }
          }
          return list;
      };
      DomManager.prototype.createDom = function (list, start, end) {
          for (var i = start; i < end; i++) {
              var dom = list[i].dom;
              var data = list[i].data;
              if (dom) {
                  if (Tombstone.isTombstone(dom) && data) {
                      list[i].tombstone = dom;
                      list[i].dom = null;
                  }
                  else {
                      continue;
                  }
              }
              dom = data
                  ? this.renderFn(data, this.unusedDom.pop())
                  : this.tombstone.getOne();
              dom.style.position = 'absolute';
              list[i].dom = dom;
              list[i].pos = -1;
              this.content.appendChild(dom);
          }
      };
      DomManager.prototype.cacheHeight = function (list, start, end) {
          for (var i = start; i < end; i++) {
              if (list[i].data && !list[i].height) {
                  list[i].height = list[i].dom.offsetHeight;
              }
          }
      };
      DomManager.prototype.positionDom = function (list, start, end) {
          var _this = this;
          var tombstoneEles = [];
          var _a = this.getStartPos(list, start, end), startPos = _a.start, startDelta = _a.delta;
          var pos = startPos;
          for (var i = start; i < end; i++) {
              var tombstone = list[i].tombstone;
              if (tombstone) {
                  var tombstoneStyle = tombstone.style;
                  tombstoneStyle[style.transition] = cssVendor + "transform " + ANIMATION_DURATION_MS + "ms, opacity " + ANIMATION_DURATION_MS + "ms";
                  tombstoneStyle[style.transform] = "translateY(" + pos + "px)";
                  tombstoneStyle.opacity = '0';
                  list[i].tombstone = null;
                  tombstoneEles.push(tombstone);
              }
              if (list[i].dom && list[i].pos !== pos) {
                  list[i].dom.style[style.transform] = "translateY(" + pos + "px)";
                  list[i].pos = pos;
              }
              pos += list[i].height || this.tombstone.height;
          }
          var timerId = window.setTimeout(function () {
              _this.tombstone.recycle(tombstoneEles);
          }, ANIMATION_DURATION_MS);
          this.timers.push(timerId);
          return {
              startPos: startPos,
              startDelta: startDelta,
              endPos: pos,
          };
      };
      DomManager.prototype.getStartPos = function (list, start, end) {
          if (list[start] && list[start].pos !== -1) {
              return {
                  start: list[start].pos,
                  delta: 0,
              };
          }
          // TODO optimise
          var pos = list[0].pos === -1 ? 0 : list[0].pos;
          for (var i_1 = 0; i_1 < start; i_1++) {
              pos += list[i_1].height || this.tombstone.height;
          }
          var originPos = pos;
          var i;
          for (i = start; i < end; i++) {
              if (!Tombstone.isTombstone(list[i].dom) && list[i].pos !== -1) {
                  pos = list[i].pos;
                  break;
              }
          }
          var x = i;
          if (x < end) {
              while (x > start) {
                  pos -= list[x - 1].height;
                  x--;
              }
          }
          var delta = originPos - pos;
          return {
              start: pos,
              delta: delta,
          };
      };
      DomManager.prototype.removeTombstone = function () {
          var tombstones = this.content.querySelectorAll('.tombstone');
          for (var i = tombstones.length - 1; i >= 0; i--) {
              this.content.removeChild(tombstones[i]);
          }
      };
      DomManager.prototype.setContent = function (content) {
          if (content !== this.content) {
              this.content = content;
          }
      };
      DomManager.prototype.destroy = function () {
          this.removeTombstone();
          this.timers.forEach(function (id) {
              clearTimeout(id);
          });
      };
      DomManager.prototype.resetState = function () {
          this.destroy();
          this.timers = [];
          this.unusedDom = [];
      };
      return DomManager;
  }());

  var EXTRA_SCROLL_Y = -2000;
  var InfinityScroll = /** @class */ (function () {
      function InfinityScroll(scroll) {
          this.scroll = scroll;
          this.start = 0;
          this.end = 0;
          this.init();
      }
      InfinityScroll.prototype.init = function () {
          var _this = this;
          this.handleOptions();
          var _a = this.options, fetchFn = _a.fetch, renderFn = _a.render, createTombstoneFn = _a.createTombstone;
          this.tombstone = new Tombstone(createTombstoneFn);
          this.indexCalculator = new IndexCalculator(this.scroll.scroller.scrollBehaviorY.wrapperSize, this.tombstone.height);
          this.domManager = new DomManager(this.scroll.scroller.content, renderFn, this.tombstone);
          this.dataManager = new DataManager([], fetchFn, this.onFetchFinish.bind(this));
          this.scroll.on(this.scroll.eventTypes.destroy, this.destroy, this);
          this.scroll.on(this.scroll.eventTypes.scroll, this.update, this);
          this.scroll.on(this.scroll.eventTypes.contentChanged, function (content) {
              _this.domManager.setContent(content);
              _this.indexCalculator.resetState();
              _this.domManager.resetState();
              _this.dataManager.resetState();
              _this.update({ y: 0 });
          });
          var scrollBehaviorY = this.scroll.scroller.scrollBehaviorY;
          scrollBehaviorY.hooks.on(scrollBehaviorY.hooks.eventTypes.computeBoundary, this.modifyBoundary, this);
          this.update({ y: 0 });
      };
      InfinityScroll.prototype.modifyBoundary = function (boundary) {
          // manually set position to allow scroll
          boundary.maxScrollPos = EXTRA_SCROLL_Y;
      };
      InfinityScroll.prototype.handleOptions = function () {
          // narrow down type to an object
          var infinityOptions = this.scroll.options.infinity;
          if (infinityOptions) {
              if (typeof infinityOptions.fetch !== 'function') {
                  warn('Infinity plugin need fetch Function to new data.');
              }
              if (typeof infinityOptions.render !== 'function') {
                  warn('Infinity plugin need render Function to render each item.');
              }
              if (typeof infinityOptions.render !== 'function') {
                  warn('Infinity plugin need createTombstone Function to create tombstone.');
              }
              this.options = infinityOptions;
          }
          this.scroll.options.probeType = 3 /* Realtime */;
      };
      InfinityScroll.prototype.update = function (pos) {
          var position = Math.round(-pos.y);
          // important! calculate start/end index to render
          var _a = this.indexCalculator.calculate(position, this.dataManager.getList()), start = _a.start, end = _a.end;
          this.start = start;
          this.end = end;
          // tslint:disable-next-line: no-floating-promises
          this.dataManager.update(end);
          this.updateDom(this.dataManager.getList());
      };
      InfinityScroll.prototype.onFetchFinish = function (list, hasMore) {
          var end = this.updateDom(list).end;
          if (!hasMore) {
              this.domManager.removeTombstone();
              this.scroll.scroller.animater.stop();
              this.scroll.resetPosition();
          }
          // tslint:disable-next-line: no-floating-promises
          return end;
      };
      InfinityScroll.prototype.updateDom = function (list) {
          var _a = this.domManager.update(list, this.start, this.end), end = _a.end, startPos = _a.startPos, endPos = _a.endPos, startDelta = _a.startDelta;
          if (startDelta) {
              this.scroll.minScrollY = startDelta;
          }
          if (endPos > this.scroll.maxScrollY) {
              this.scroll.maxScrollY = -(endPos - this.scroll.scroller.scrollBehaviorY.wrapperSize);
          }
          return {
              end: end,
              startPos: startPos,
              endPos: endPos,
          };
      };
      InfinityScroll.prototype.destroy = function () {
          var _a = this.scroll.scroller, content = _a.content, scrollBehaviorY = _a.scrollBehaviorY;
          while (content.firstChild) {
              content.removeChild(content.firstChild);
          }
          this.domManager.destroy();
          this.scroll.off('scroll', this.update);
          this.scroll.off('destroy', this.destroy);
          scrollBehaviorY.hooks.off(scrollBehaviorY.hooks.eventTypes.computeBoundary);
      };
      InfinityScroll.pluginName = 'infinity';
      return InfinityScroll;
  }());

  return InfinityScroll;

}));
