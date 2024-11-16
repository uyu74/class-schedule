"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  methods: {
    // 跳转到课程表页面
    goToNextPage() {
      common_vendor.index.navigateTo({
        url: "/pages/obtain_class_information/obtain_class_information"
        // 目标页面路径
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o((...args) => $options.goToNextPage && $options.goToNextPage(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-e6e5e79f"]]);
wx.createPage(MiniProgramPage);