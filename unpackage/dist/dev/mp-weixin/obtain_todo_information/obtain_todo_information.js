"use strict";
const common_vendor = require("../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      todoContent: "",
      todoTime: "",
      todoRemark: "",
      todos: []
    };
  },
  methods: {
    // 添加日程
    addTodo() {
      if (this.todoContent && this.todoTime) {
        this.todos.push({
          content: this.todoContent,
          time: this.todoTime,
          remark: this.todoRemark
        });
        this.todoContent = "";
        this.todoTime = "";
        this.todoRemark = "";
        common_vendor.index.showToast({
          title: "日程已添加",
          icon: "success"
        });
      } else {
        common_vendor.index.showToast({
          title: "请填写完整的课程信息",
          icon: "none"
        });
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.todoContent,
    b: common_vendor.o(($event) => $data.todoContent = $event.detail.value),
    c: $data.todoTime,
    d: common_vendor.o(($event) => $data.todoTime = $event.detail.value),
    e: $data.todoRemark,
    f: common_vendor.o(($event) => $data.todoRemark = $event.detail.value),
    g: common_vendor.o((...args) => $options.addTodo && $options.addTodo(...args)),
    h: common_vendor.o((...args) => $options.addTodo && $options.addTodo(...args)),
    i: common_vendor.f($data.todos, (todo, index, i0) => {
      return {
        a: common_vendor.t(todo.content),
        b: common_vendor.t(todo.time),
        c: common_vendor.t(todo.remark),
        d: index
      };
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-91c96349"]]);
wx.createPage(MiniProgramPage);
