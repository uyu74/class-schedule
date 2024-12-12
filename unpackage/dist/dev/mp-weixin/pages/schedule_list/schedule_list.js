"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      schedules: []
      // 存储已创建的课程表名称
    };
  },
  onLoad() {
    const storedSchedules = common_vendor.index.getStorageSync("schedules");
    if (storedSchedules) {
      this.schedules = JSON.parse(storedSchedules);
    }
  },
  methods: {
    // 新建课程表
    createNewSchedule() {
      console.log("新建课程表按钮被点击了");
      common_vendor.index.showModal({
        title: "新建课程表",
        editable: true,
        // 允许用户输入
        placeholderText: "请输入课程表名称",
        // 输入框提示文本
        success: (res) => {
          console.log("弹窗回调结果:", res);
          if (res.confirm) {
            const scheduleName = res.content;
            if (scheduleName.trim()) {
              this.schedules.push(scheduleName);
              common_vendor.index.setStorageSync("schedules", JSON.stringify(this.schedules));
              console.log(scheduleName);
              common_vendor.index.navigateTo({
                url: "/pages/obtain_class_information/obtain_class_information?scheduleName=" + encodeURIComponent(scheduleName)
                // 传递课程表名称
              });
            } else {
              common_vendor.index.showToast({
                title: "课程表名称不能为空",
                icon: "none"
              });
            }
          } else if (res.cancel) {
            console.log("用户点击取消");
          }
        }
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f($data.schedules, (schedule, index, i0) => {
      return {
        a: common_vendor.t(schedule),
        b: index
      };
    }),
    b: common_vendor.o((...args) => $options.createNewSchedule && $options.createNewSchedule(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-71c7243e"]]);
wx.createPage(MiniProgramPage);
