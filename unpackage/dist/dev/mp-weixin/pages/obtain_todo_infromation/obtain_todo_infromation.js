"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      todoContent: "",
      todoTime: "",
      todoTimeDate: "",
      todoTimeClock: "0:0",
      todoRemark: "",
      todos: []
    };
  },
  computed: {
    //当前时间，格式为y-m-d，类型为字符串
    currentTime() {
      const date = /* @__PURE__ */ new Date();
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();
      month = month > 9 ? month : "0" + month;
      day = day > 9 ? day : "0" + day;
      this.todoTimeDate = `${year}-${month}-${day}`;
      return `${year}-${month}-${day}`;
    }
  },
  methods: {
    // 添加日程
    addTodo() {
      if (this.todoContent) {
        let todo_len = 0;
        try {
          todo_len = common_vendor.index.getStorageSync("todo-len");
          console.log(todo_len);
          if (!todo_len) {
            todo_len = 0;
            common_vendor.index.setStorageSync("todo-len", todo_len);
          }
        } catch (e) {
          common_vendor.index.showToast({
            title: "更新数据失败",
            icon: "error"
          });
          return;
        }
        this.todoTime = this.todoTimeDate + "  " + this.todoTimeClock;
        this.todos.push({
          _id: todo_len + 1,
          content: this.todoContent,
          time: this.todoTime,
          remark: this.todoRemark
        });
        common_vendor.index.setStorageSync("todo-" + (todo_len + 1).toString(), this.todos[this.todos.length - 1]);
        common_vendor.index.setStorageSync("todo-len", todo_len + 1);
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
          icon: "error"
        });
      }
    },
    changeDate(e) {
      this.todoTimeDate = e.detail.value;
      console.log(this.todoTimeDate);
    },
    changeClock(e) {
      this.todoTimeClock = e.detail.value;
      console.log(this.todoTimeClock);
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.todoContent,
    b: common_vendor.o(($event) => $data.todoContent = $event.detail.value),
    c: common_vendor.t($data.todoTimeDate),
    d: $options.currentTime,
    e: $data.todoTimeDate,
    f: common_vendor.o((...args) => $options.changeDate && $options.changeDate(...args)),
    g: common_vendor.t($data.todoTimeClock),
    h: $data.todoTimeClock,
    i: common_vendor.o((...args) => $options.changeClock && $options.changeClock(...args)),
    j: $data.todoRemark,
    k: common_vendor.o(($event) => $data.todoRemark = $event.detail.value),
    l: common_vendor.o((...args) => $options.addTodo && $options.addTodo(...args)),
    m: common_vendor.o((...args) => $options.addTodo && $options.addTodo(...args)),
    n: common_vendor.f($data.todos, (todo, index, i0) => {
      return {
        a: common_vendor.t(todo.content),
        b: common_vendor.t(todo.time),
        c: common_vendor.t(todo.remark),
        d: index
      };
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-d0934496"]]);
wx.createPage(MiniProgramPage);
