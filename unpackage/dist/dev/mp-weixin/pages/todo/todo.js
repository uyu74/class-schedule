"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      todos: []
    };
  },
  onShow() {
    console.log("出现了");
    const todo_len = common_vendor.index.getStorageSync("todo-len");
    console.log(todo_len);
    for (let i = 1; i <= todo_len; i = i + 1) {
      console.log(i);
      let todo_item = common_vendor.index.getStorageSync("todo-" + i);
      if (todo_item) {
        this.todos[i - 1] = todo_item;
        console.log(todo_item);
      } else {
        console.log("错误");
      }
    }
  },
  methods: {}
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f($data.todos, (todo, k0, i0) => {
      return {
        a: common_vendor.t(todo.content),
        b: common_vendor.t(todo.time),
        c: common_vendor.t(todo.remark),
        d: todo._id
      };
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-067fb54d"]]);
wx.createPage(MiniProgramPage);
