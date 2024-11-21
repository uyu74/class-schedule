"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      todoContent: "",
      todoTime: "",
      todoTimeDate: "",
      todoTimeClock: "00:00",
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
    },
    disableButton() {
      return !this.todoContent.trim();
    }
  },
  methods: {
    //更新储存，按时间顺序
    refreshStorage(e) {
      let old_todolist = common_vendor.index.getStorageSync("todo-list");
      let insertIndex = old_todolist.findIndex((item) => item.time > e.time);
      if (insertIndex == -1) {
        old_todolist.push(e);
      } else {
        console.log(insertIndex);
        old_todolist.splice(insertIndex, 0, e);
      }
      common_vendor.index.setStorageSync("todo-list", old_todolist);
      return true;
    },
    //本页的显示的更新
    refreshTodoShown(e) {
      this.todos.push(e);
      return;
    },
    //检测初始化，若没有就初始为空
    initTodoList() {
      let todo_list = common_vendor.index.getStorageSync("todo-list");
      if (!todo_list) {
        common_vendor.index.setStorageSync("todo-list", [
          /* {
          	content:"",
          	time:"",
          	remark:""
          } */
        ]);
      }
      return;
    },
    // 添加日程
    addTodo() {
      this.initTodoList();
      const todo = {
        content: this.todoContent,
        time: this.todoTimeDate + " " + this.todoTimeClock,
        remark: this.todoRemark
      };
      const successStorage = this.refreshStorage(todo);
      if (successStorage == false) {
        common_vendor.index.showToast({
          content: "内存操作异常",
          icon: "error"
        });
        return;
      }
      this.refreshTodoShown(todo);
      this.todoContent = "";
      this.todoRemark = "";
    },
    changeDate(e) {
      this.todoTimeDate = e.detail.value;
    },
    changeClock(e) {
      this.todoTimeClock = e.detail.value;
      let parts = this.todoTimeClock.split(":");
      if (parts[0] == "0")
        parts[0].push("0");
      if (parts[1] == "0")
        parts[1].push("0");
      this.todoTimeClock = parts[0] + ":" + parts[1];
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
    l: $options.disableButton ? 1 : "",
    m: !$options.disableButton ? 1 : "",
    n: $options.disableButton,
    o: common_vendor.o((...args) => $options.addTodo && $options.addTodo(...args)),
    p: common_vendor.o((...args) => $options.addTodo && $options.addTodo(...args)),
    q: common_vendor.f($data.todos, (todo, index, i0) => {
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
