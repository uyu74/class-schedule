"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {};
  },
  methods: {
    // 跳转到课程表页面
    goToObtainClassInformationPage() {
      common_vendor.index.navigateTo({
        url: "/pages/obtain_class_information/obtain_class_information"
        // 目标页面路径
      });
    },
    goToScheduleSettingsPage() {
      common_vendor.index.navigateTo({
        url: "/pages/schedule_settings/schedule_settings"
      });
    },
    onLoad() {
      const storedCourses = common_vendor.index.getStorageSync("courses");
      if (storedCourses) {
        this.courses = storedCourses;
        console.log("成功找到课程");
      } else {
        console.log("没有找到课程数据");
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o((...args) => $options.goToObtainClassInformationPage && $options.goToObtainClassInformationPage(...args)),
    b: common_vendor.o((...args) => $options.goToScheduleSettingsPage && $options.goToScheduleSettingsPage(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
