<template>
  <view class="container">
    <!-- 显示传递过来的课程表名称 -->
    <uni-section :title="'课程表名称：' + schedule.scheduleName" type="line"></uni-section>

    <!-- 学期开始日期选择器 -->
    <uni-section title="学期开始的第一天" type="line"></uni-section>
    <view class="datePicker">
      <uni-datetime-picker type="date" :clear-icon="false" v-model="schedule.startDate" @maskClick="maskClick" />
    </view>

    <!-- 输入总周数 -->
    <input v-model="schedule.totalWeeks" type="number" placeholder="请输入总周数" />

    <!-- 设置课程表按钮 -->
    <button @click="openSettingsPopup">设置课程表</button>

    <!-- 添加课程按钮 -->
    <button @click="openAddCoursePopup">添加新课程</button>

    <!-- 设置课程表的弹窗 -->
    <view v-if="scheduleSettingsPopupVisible" class="popup">
      <view class="popup-content">
        <text>请输入一天的节数：</text>
        <input v-model="schedule.daysPerWeek" type="number" placeholder="请输入一天的节数" />

        <text>请输入每节课的时长（分钟）：</text>
        <input v-model="schedule.classDuration" type="number" placeholder="默认100分钟" />

        <!-- 生成课程时间输入框 -->
        <view>
          <text>选择课程时间：</text>
          <view v-for="(day, index) in daysPerWeek" :key="index">
            <input type="time" v-model="schedule.classTimes[index]" />
          </view>
        </view>

        <button @click="handleScheduleSettingsSubmit">提交</button>
        <button @click="closeSettingsPopup">取消</button>
      </view>
    </view>

    <!-- 添加课程的弹窗 -->
    <view v-if="addCoursePopupVisible" class="popup">
      <view class="popup-content">
        <text>课程名称：</text>
        <input v-model="schedule.courseName" type="text" placeholder="请输入课程名称" />

        <text>星期几：</text>
        <picker :value="schedule.courseDayIndex" :range="weekDays" @change="onCourseDayChange">
          <view class="picker">{{ weekDays[courseDayIndex] }}</view>
        </picker>

        <text>第几节课：</text>
        <input v-model="schedule.coursePeriod" type="number" placeholder="请输入第几节课" />

        <text>上课周数：</text>
        <picker mode="multiSelector" :value="schedule.selectedWeeksIndex" :range="schedule.weekRange" @change="onWeekChange">
          <view class="picker">{{ selectedWeeks.join(', ') }}</view>
        </picker>

        <button @click="handleAddCourse">添加课程</button>
        <button @click="closeAddCoursePopup">取消</button>
      </view>
    </view>

    <!-- 显示课程表 -->
    <view class="schedule-table">
      <view v-for="(day, index) in weekDays" :key="index">
        <text>{{ day }}</text>
        <view v-for="(course, idx) in sortedCourses[day]" :key="idx">
          <text>{{ course.name }} - 第{{ course.period }}节</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      // 课程表数据
      schedule: {
            scheduleName: '', // 课程表名称
            startDate: this.getDateTime(new Date()), // 学期开始日期
            totalWeeks: '', // 总周数
            daysPerWeek: 5, // 每周有几天课程
            classDuration: 100, // 每节课时长（默认100分钟）
            scheduleSettingsPopupVisible: false, // 控制设置课程表弹窗显示
            addCoursePopupVisible: false, // 控制添加课程弹窗显示
            classTimes: [], // 存储一天的课程时间
            courseName: '', // 课程名称
            courseDayIndex: 0, // 星期几，0表示周一
            coursePeriod: 1, // 第几节课
            weekRange: Array.from({ length: 17 }, (_, i) => i + 1), // 假设最大17周
            selectedWeeks: [], // 用户选择的上课周数
            selectedWeeksIndex: [], // 用户选择的上课周数索引
            courses: [], // 存储所有课程
            weekDays: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'], // 一周七天
            sortedCourses: {
                '周一': [],
                '周二': [],
                '周三': [],
                '周四': [],
                '周五': [],
                '周六': [],
                '周日': []
            } // 存储按照排序的课程
        }
    };
  },
  onLoad(options) {
    // 获取传递的课程表名称
    this.schedule.scheduleName = decodeURIComponent(options.scheduleName);
    // 加载课程表
    if (this.schedule.scheduleName) {
        this.loadSchedule(this.schedule.scheduleName);
    } else {
        console.error('未传递课程表名称');
    }
  },
  methods: {
    maskClick() {
      console.log('----maskClick事件');
    },
    // 获取日期时间
    getDateTime(date, addZero = true){
      return `${this.getDate(date, addZero)} ${this.getTime(date, addZero)}`
    },
    // 获取日期
    getDate(date, addZero = true){
      date = new Date(date)
      const year = date.getFullYear()
      const month = date.getMonth()+1
      const day = date.getDate()
      return `${year}-${addZero ? this.addZero(month) : month}-${addZero ? this.addZero(day) : day}`
    },
    // 获取时间
    getTime(date, addZero = true){
      date = new Date(date)
      const hour = date.getHours()
      const minute = date.getMinutes()
      const second = date.getSeconds()
      return this.hideSecond ?
      `${addZero ? this.addZero(hour) : hour}:${addZero ? this.addZero(minute) : minute}` :
      `${addZero ? this.addZero(hour) : hour}:${addZero ? this.addZero(minute) : minute}:${addZero ? this.addZero(second) : second}`
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
      this.scheduleSettingsPopupVisible = true;
    },
    // 关闭设置课程表弹窗
    closeSettingsPopup() {
      this.scheduleSettingsPopupVisible = false;
    },
    // 打开添加课程的弹窗
    openAddCoursePopup() {
      this.addCoursePopupVisible = true;
    },
    // 关闭添加课程弹窗
    closeAddCoursePopup() {
      this.addCoursePopupVisible = false;
    },

    // 提交设置课程表的数据
    handleScheduleSettingsSubmit() {
      console.log('学期开始日期:', this.startDate);
      console.log('总周数:', this.totalWeeks);
      console.log('每周课程天数:', this.daysPerWeek);
      console.log('每节课时长:', this.classDuration);
      console.log('课程时间:', this.classTimes);
      this.closeSettingsPopup(); // 提交后关闭弹窗
    },

    //加载课程表
    loadSchedule(scheduleName) {
        let that = this;
        uni.getStorage({
            key: 'schedules',
            success(res) {
                const schedules = JSON.parse(res.data);
                const schedule = schedules.find(s => s.scheduleName === scheduleName);
                if (schedule) {
                    that.schedule = schedule;
                    console.log('课程表已加载', that.schedule);
                } else {
                    console.log('未找到对应的课程表');
                    // 保持 this.schedule 为空，等待用户输入
                }
            },
            fail(err) {
                console.error('加载课程表失败', err);
                // 保持 this.schedule 为空，等待用户输入
            }
        });
    },

    // 保存课程表
    saveSchedule() {
        uni.setStorage({
            key: 'schedule',
            data: JSON.stringify(this.schedule),
            success() {
                console.log('课程表已保存');
            },
            fail(err) {
                console.error('保存课程表失败', err);
            }
        });
    },

    // 处理星期几选择的变化
    onCourseDayChange(e) {
      this.courseDayIndex = e.detail.value;
      console.log('选择的星期:', this.weekDays[this.courseDayIndex]);
    },

    // 处理上课周数的选择
    onWeekChange(e) {
      this.selectedWeeksIndex = e.detail.value;
      this.selectedWeeks = this.selectedWeeksIndex.map(i => this.weekRange[i]);
    },

    // 按照周一到周天、节次排序课程
    sortCourses() {
      // 清空已排序的课程
      this.sortedCourses = {
        '周一': [],
        '周二': [],
        '周三': [],
        '周四': [],
        '周五': [],
        '周六': [],
        '周日': []
      };
      
      // 将课程添加到对应的日期并按照节次排序
      this.courses.forEach(course => {
        this.sortedCourses[course.day].push(course);
      });

      // 对每一天的课程进行排序，按节次排序
      Object.keys(this.sortedCourses).forEach(day => {
        this.sortedCourses[day].sort((a, b) => a.period - b.period);
      });
    }
  }
};
</script>

<style scoped>
/* 样式根据需要自行修改 */
.container {
  padding: 20px;
}

.popup {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
  max-width: 400px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.picker {
  padding: 10px;
  background-color: #f0f0f0;
}

.schedule-table {
  margin-top: 20px;
}

button {
  margin-top: 10px;
  background-color: #007BFF;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 5px;
}

button:hover {
  background-color: #0056b3;
}

.datePicker {
		background-color: #fff;
		padding: 10px;
	}
</style>