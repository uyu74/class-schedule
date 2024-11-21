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
    const todo_list = common_vendor.index.getStorageSync("todo-list");
    if (todo_list) {
      console.log(todo_list);
      this.todos = todo_list;
    } else {
      console.log("没有list");
    }
  },
  computed: {
    currentTime() {
      const now = /* @__PURE__ */ new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const day = String(now.getDate()).padStart(2, "0");
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const formattedTime = `${year}-${month}-${day} ${hours}:${minutes}`;
      return formattedTime;
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
        d: todo.time <= $options.currentTime ? 1 : ""
      };
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-067fb54d"]]);
wx.createPage(MiniProgramPage);
