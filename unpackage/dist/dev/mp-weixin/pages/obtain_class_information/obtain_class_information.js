"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      scheduleSettingsPopupVisible: false,
      // 控制设置课程表弹窗显示
      addCoursePopupVisible: false,
      // 控制添加课程弹窗显示
      // 课程表数据
      schedule: {
        scheduleName: "",
        // 课程表名称
        startDate: this.getDateTime(/* @__PURE__ */ new Date()),
        // 学期开始日期
        totalWeeks: "",
        // 总周数
        daysPerWeek: 5,
        // 每周有几天课程
        numPerDay: 5,
        // 一天有几节课
        classDuration: 100,
        // 每节课时长（默认100分钟） 
        classTimes: Array(6).fill({ inputTime: "", endTime: "" }),
        // 存储一天的课程时间
        courseName: "",
        // 课程名称
        courseDayIndex: 0,
        // 星期几，0表示周一
        coursePeriod: 1,
        // 第几节课
        weekRange: Array.from({ length: 17 }, (_, i) => i + 1),
        // 假设最大17周
        selectedWeeks: [],
        // 用户选择的上课周数
        selectedWeeksIndex: [],
        // 用户选择的上课周数索引
        courses: [],
        // 存储所有课程
        weekDays: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
        // 一周七天
        sortedCourses: {
          "周一": [],
          "周二": [],
          "周三": [],
          "周四": [],
          "周五": [],
          "周六": [],
          "周日": []
        }
        // 存储按照排序的课程
      }
    };
  },
  onLoad(options) {
    this.schedule.scheduleName = decodeURIComponent(options.scheduleName);
    if (this.schedule.scheduleName) {
      this.loadSchedule(this.schedule.scheduleName);
    } else {
      console.error("未传递课程表名称");
    }
  },
  watch: {
    // 当 numPerDay 改变时，重新填充 times 数组
    "schedule.numPerDay": function(newNumPerDay) {
      this.times = Array(newNumPerDay).fill({ inputTime: "", endTime: "" });
    }
  },
  mounted() {
    this.schedule.classTimes = Array.from({ length: this.schedule.numPerDay }, () => ({
      inputTime: "",
      endTime: ""
    }));
  },
  methods: {
    calculateEndTime(index) {
      const inputTime = this.schedule.classTimes[index].inputTime;
      if (!inputTime)
        return;
      const [hours, minutes] = inputTime.split(":").map(Number);
      const date = /* @__PURE__ */ new Date();
      date.setHours(hours);
      date.setMinutes(minutes);
      date.setMinutes(date.getMinutes() + 100);
      const endHours = String(date.getHours()).padStart(2, "0");
      const endMinutes = String(date.getMinutes()).padStart(2, "0");
      this.schedule.classTimes[index].endTime = `${endHours}:${endMinutes}`;
    },
    maskClick() {
      console.log("----maskClick事件");
    },
    // 获取日期时间
    getDateTime(date, addZero = true) {
      return `${this.getDate(date, addZero)} ${this.getTime(date, addZero)}`;
    },
    // 获取日期
    getDate(date, addZero = true) {
      date = new Date(date);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      return `${year}-${addZero ? this.addZero(month) : month}-${addZero ? this.addZero(day) : day}`;
    },
    // 获取时间
    getTime(date, addZero = true) {
      date = new Date(date);
      const hour = date.getHours();
      const minute = date.getMinutes();
      const second = date.getSeconds();
      return this.hideSecond ? `${addZero ? this.addZero(hour) : hour}:${addZero ? this.addZero(minute) : minute}` : `${addZero ? this.addZero(hour) : hour}:${addZero ? this.addZero(minute) : minute}:${addZero ? this.addZero(second) : second}`;
    },
    // 补零
    addZero(num) {
      if (num < 10) {
        num = `0${num}`;
      }
      return num;
    },
    // 更新学期开始日期
    onDateChange(e) {
      this.startDate = e.detail.value;
    },
    // 打开设置课程表的弹窗
    openSettingsPopup() {
      console.log("设置课程表按钮被点击了");
      this.scheduleSettingsPopupVisible = true;
    },
    // 关闭设置课程表弹窗
    closeSettingsPopup() {
      console.log("关闭设置课程表弹窗");
      this.scheduleSettingsPopupVisible = false;
    },
    // 打开添加课程的弹窗
    openAddCoursePopup() {
      console.log("添加课程按钮被点击了");
      this.addCoursePopupVisible = true;
    },
    // 关闭添加课程弹窗
    closeAddCoursePopup() {
      console.log("关闭添加课程弹窗");
      this.addCoursePopupVisible = false;
    },
    // 提交设置课程表的数据
    handleScheduleSettingsSubmit() {
      console.log("学期开始日期:", this.schedule.startDate);
      console.log("总周数:", this.schedule.totalWeeks);
      console.log("每周课程天数:", this.schedule.daysPerWeek);
      console.log("每节课时长:", this.schedule.classDuration);
      console.log("课程时间:", this.schedule.classTimes);
      this.closeSettingsPopup();
    },
    //加载课程表
    loadSchedule(scheduleName) {
      let that = this;
      common_vendor.index.getStorage({
        key: "schedules",
        success(res) {
          const schedules = JSON.parse(res.data);
          const schedule = schedules.find((s) => s.scheduleName === scheduleName);
          if (schedule) {
            that.schedule = schedule;
            console.log("课程表已加载", that.schedule);
          } else {
            console.log("未找到对应的课程表");
          }
        },
        fail(err) {
          console.error("加载课程表失败", err);
        }
      });
    },
    // 保存课程表
    saveSchedule() {
      common_vendor.index.setStorage({
        key: "schedule",
        data: JSON.stringify(this.schedule),
        success() {
          console.log("课程表已保存");
        },
        fail(err) {
          console.error("保存课程表失败", err);
        }
      });
    },
    // 处理星期几选择的变化
    onCourseDayChange(e) {
      this.courseDayIndex = e.detail.value;
      console.log("选择的星期:", this.weekDays[this.courseDayIndex]);
    },
    // 处理上课周数的选择
    onWeekChange(e) {
      this.selectedWeeksIndex = e.detail.value;
      this.selectedWeeks = this.selectedWeeksIndex.map((i) => this.weekRange[i]);
    },
    // 按照周一到周天、节次排序课程
    sortCourses() {
      this.sortedCourses = {
        "周一": [],
        "周二": [],
        "周三": [],
        "周四": [],
        "周五": [],
        "周六": [],
        "周日": []
      };
      this.courses.forEach((course) => {
        this.sortedCourses[course.day].push(course);
      });
      Object.keys(this.sortedCourses).forEach((day) => {
        this.sortedCourses[day].sort((a, b) => a.period - b.period);
      });
    }
  }
};
if (!Array) {
  const _easycom_uni_section2 = common_vendor.resolveComponent("uni-section");
  const _easycom_uni_datetime_picker2 = common_vendor.resolveComponent("uni-datetime-picker");
  const _easycom_uni_easyinput2 = common_vendor.resolveComponent("uni-easyinput");
  (_easycom_uni_section2 + _easycom_uni_datetime_picker2 + _easycom_uni_easyinput2)();
}
const _easycom_uni_section = () => "../../uni_modules/uni-section/components/uni-section/uni-section.js";
const _easycom_uni_datetime_picker = () => "../../uni_modules/uni-datetime-picker/components/uni-datetime-picker/uni-datetime-picker.js";
const _easycom_uni_easyinput = () => "../../uni_modules/uni-easyinput/components/uni-easyinput/uni-easyinput.js";
if (!Math) {
  (_easycom_uni_section + _easycom_uni_datetime_picker + _easycom_uni_easyinput)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.p({
      title: "课程表名称：" + $data.schedule.scheduleName,
      type: "line"
    }),
    b: common_vendor.p({
      title: "学期开始的第一天",
      type: "line"
    }),
    c: common_vendor.o($options.maskClick),
    d: common_vendor.o(($event) => $data.schedule.startDate = $event),
    e: common_vendor.p({
      type: "date",
      ["clear-icon"]: false,
      modelValue: $data.schedule.startDate
    }),
    f: common_vendor.p({
      title: "学期总周数"
    }),
    g: common_vendor.o(_ctx.input),
    h: common_vendor.o(($event) => $data.schedule.totalWeeks = $event),
    i: common_vendor.p({
      trim: "all",
      placeholder: "请输入内容",
      modelValue: $data.schedule.totalWeeks
    }),
    j: common_vendor.o((...args) => $options.openSettingsPopup && $options.openSettingsPopup(...args)),
    k: common_vendor.o((...args) => $options.openAddCoursePopup && $options.openAddCoursePopup(...args)),
    l: $data.scheduleSettingsPopupVisible
  }, $data.scheduleSettingsPopupVisible ? {
    m: common_vendor.p({
      title: "一天课程节数:"
    }),
    n: common_vendor.o(_ctx.input),
    o: common_vendor.o(($event) => $data.schedule.numPerDay = $event),
    p: common_vendor.p({
      trim: "all",
      placeholder: "请输入内容",
      modelValue: $data.schedule.numPerDay
    }),
    q: common_vendor.p({
      title: "一节课持续的时间:(分钟)"
    }),
    r: common_vendor.o(_ctx.input),
    s: common_vendor.o(($event) => $data.schedule.classDuration = $event),
    t: common_vendor.p({
      trim: "all",
      placeholder: "请输入内容",
      modelValue: $data.schedule.classDuration
    }),
    v: common_vendor.p({
      title: "上课时间设置:(24小时制)"
    }),
    w: common_vendor.f(Array.from({
      length: $data.schedule.numPerDay
    }, (_, i) => ({
      inputTime: "",
      endTime: ""
    })), (time, index, i0) => {
      return {
        a: common_vendor.t(index + 1),
        b: common_vendor.o(($event) => $options.calculateEndTime(index), index),
        c: $data.schedule.classTimes[index].inputTime,
        d: common_vendor.o(($event) => $data.schedule.classTimes[index].inputTime = $event.detail.value, index),
        e: common_vendor.t($data.schedule.classTimes[index].endTime),
        f: index
      };
    }),
    x: common_vendor.o((...args) => $options.handleScheduleSettingsSubmit && $options.handleScheduleSettingsSubmit(...args)),
    y: common_vendor.o((...args) => $options.closeSettingsPopup && $options.closeSettingsPopup(...args))
  } : {}, {
    z: $data.addCoursePopupVisible
  }, $data.addCoursePopupVisible ? {
    A: $data.schedule.courseName,
    B: common_vendor.o(($event) => $data.schedule.courseName = $event.detail.value),
    C: common_vendor.t(_ctx.weekDays[_ctx.courseDayIndex]),
    D: $data.schedule.courseDayIndex,
    E: _ctx.weekDays,
    F: common_vendor.o((...args) => $options.onCourseDayChange && $options.onCourseDayChange(...args)),
    G: $data.schedule.coursePeriod,
    H: common_vendor.o(($event) => $data.schedule.coursePeriod = $event.detail.value),
    I: common_vendor.t(_ctx.selectedWeeks.join(", ")),
    J: $data.schedule.selectedWeeksIndex,
    K: $data.schedule.weekRange,
    L: common_vendor.o((...args) => $options.onWeekChange && $options.onWeekChange(...args)),
    M: common_vendor.o((...args) => _ctx.handleAddCourse && _ctx.handleAddCourse(...args)),
    N: common_vendor.o((...args) => $options.closeAddCoursePopup && $options.closeAddCoursePopup(...args))
  } : {}, {
    O: common_vendor.f(_ctx.weekDays, (day, index, i0) => {
      return {
        a: common_vendor.t(day),
        b: common_vendor.f(_ctx.sortedCourses[day], (course, idx, i1) => {
          return {
            a: common_vendor.t(course.name),
            b: common_vendor.t(course.period),
            c: idx
          };
        }),
        c: index
      };
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-bb6e3cb4"]]);
wx.createPage(MiniProgramPage);
