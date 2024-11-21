"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  data() {
    return {
      todos: []
    };
  },
  onShow() {
    const todo_list = common_vendor.index.getStorageSync("todo-list");
    if (todo_list) {
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
  methods: {
    onclickTodo(i) {
      common_vendor.index.navigateTo({
        url: "/pages/todo_settings/todo_settings?id=" + i
      });
    },
    moveToAddTodo() {
      console.log("点了");
      common_vendor.index.navigateTo({
        url: "/pages/obtain_todo_infromation/obtain_todo_infromation"
      });
    },
    deleteTodo(i) {
      let todo_list = common_vendor.index.getStorageSync("todo-list");
      todo_list.splice(i, 1);
      this.todos = todo_list;
      common_vendor.index.setStorageSync("todo-list", todo_list);
      return;
    },
    onlongPressTodo(i) {
      common_vendor.index.showModal({
        title: "提示",
        content: "确定要删除该事项吗",
        success: (res) => {
          if (res.confirm)
            this.deleteTodo(i);
        },
        fail: (err) => {
          common_vendor.index.showToast({
            title: "运行失败",
            icon: "err"
          });
        }
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f($data.todos, (todo, index, i0) => {
      return {
        a: common_vendor.t(todo.content),
        b: common_vendor.t(todo.time),
        c: common_vendor.t(todo.remark),
        d: todo.time <= $options.currentTime ? 1 : "",
        e: common_vendor.o(($event) => $options.onlongPressTodo(index), index),
        f: common_vendor.o(($event) => $options.onclickTodo(index), index),
        g: index
      };
    }),
    b: common_assets._imports_0$1,
    c: common_vendor.o(($event) => $options.moveToAddTodo())
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-067fb54d"]]);
wx.createPage(MiniProgramPage);
