"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      time: ""
    };
  },
  methods: {
    onTimeChange(e) {
      this.setData({
        time: e.detail.value
        // 获取选中的时间
      });
      console.log("选中的时间是：", e.detail.value);
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.t($data.time || "请选择时间")
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
