"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      courseName: "",
      courseTime: "",
      courseLocation: "",
      courses: []
    };
  },
  methods: {
    // 添加课程
    addCourse() {
      if (this.courseName && this.courseTime && this.courseLocation) {
        this.courses.push({
          name: this.courseName,
          time: this.courseTime,
          location: this.courseLocation
        });
        this.courseName = "";
        this.courseTime = "";
        this.courseLocation = "";
        common_vendor.index.setStorageSync("courses", this.courses);
        common_vendor.index.showToast({
          title: "课程已添加",
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
    a: $data.courseName,
    b: common_vendor.o(($event) => $data.courseName = $event.detail.value),
    c: $data.courseTime,
    d: common_vendor.o(($event) => $data.courseTime = $event.detail.value),
    e: $data.courseLocation,
    f: common_vendor.o(($event) => $data.courseLocation = $event.detail.value),
    g: common_vendor.o((...args) => $options.addCourse && $options.addCourse(...args)),
    h: common_vendor.o((...args) => $options.addCourse && $options.addCourse(...args)),
    i: common_vendor.f($data.courses, (course, index, i0) => {
      return {
        a: common_vendor.t(course.name),
        b: common_vendor.t(course.time),
        c: common_vendor.t(course.location),
        d: index
      };
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-bb6e3cb4"]]);
wx.createPage(MiniProgramPage);
