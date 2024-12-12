"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      single: "",
      // 存储选择的时间
      scheduleName: ""
      // 存储传递过来的课程表名称
    };
  },
  onLoad(options) {
    if (options.scheduleName) {
      this.scheduleName = options.scheduleName;
    }
  }
};
if (!Array) {
  const _easycom_uni_section2 = common_vendor.resolveComponent("uni-section");
  const _easycom_uni_datetime_picker2 = common_vendor.resolveComponent("uni-datetime-picker");
  (_easycom_uni_section2 + _easycom_uni_datetime_picker2)();
}
const _easycom_uni_section = () => "../../uni_modules/uni-section/components/uni-section/uni-section.js";
const _easycom_uni_datetime_picker = () => "../../uni_modules/uni-datetime-picker/components/uni-datetime-picker/uni-datetime-picker.js";
if (!Math) {
  (_easycom_uni_section + _easycom_uni_datetime_picker)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.p({
      title: "学期开始的第一天",
      type: "line"
    }),
    b: common_vendor.o(_ctx.maskClick),
    c: common_vendor.o(($event) => $data.single = $event),
    d: common_vendor.p({
      type: "date",
      ["clear-icon"]: false,
      modelValue: $data.single
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-e6e5e79f"]]);
wx.createPage(MiniProgramPage);
