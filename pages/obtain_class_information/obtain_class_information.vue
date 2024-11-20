<template>
  <view class="container">
    <view class="header">
      <text class="title">课程信息录入</text>
    </view>

    <!-- 课程信息输入表单 -->
    <view class="form-section">
      <form @submit="addCourse">
        <view class="input-group">
          <text>课程名称</text>
          <input v-model="courseName" type="text" placeholder="请输入课程名称" required />
        </view>
        <view class="input-group">
          <text>上课时间</text>
          <input v-model="courseTime" type="text" placeholder="请输入上课时间" required />
        </view>
        <view class="input-group">
          <text>上课地点</text>
          <input v-model="courseLocation" type="text" placeholder="请输入上课地点" required />
        </view>
        <button class="submit-btn" type="button" @click="addCourse">添加课程</button>
      </form>
    </view>
 </view>
    <!-- 课程列表 -->
<!--    <view class="course-list">
      <view class="course-item" v-for="(course, index) in courses" :key="index">
        <view class="course-name">{{ course.name }}</view>
        <view class="course-time">时间: {{ course.time }}</view>
        <view class="course-location">地点: {{ course.location }}</view>
      </view>
    </view>
  </view> -->
</template>

<script>
export default {
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
        // 添加课程到课程列表
        this.courses.push({
          name: this.courseName,
          time: this.courseTime,
          location: this.courseLocation
        });

        // 清空输入框
        this.courseName = "";
        this.courseTime = "";
        this.courseLocation = "";
		
		uni.setStorageSync("courses", this.courses);

        // 提示添加成功
        uni.showToast({
          title: "课程已添加",
          icon: "success"
        });
      } else {
        uni.showToast({
          title: "请填写完整的课程信息",
          icon: "none"
        });
      }
    }
  }
};
</script>

<style scoped>
.container {
  padding: 20px;
}

.header {
  text-align: center;
  margin-bottom: 20px;
}

.title {
  font-size: 24px;
  font-weight: bold;
}

.form-section {
  margin-bottom: 30px;
}

.input-group {
  margin-bottom: 15px;
}

input {
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.submit-btn {
  width: 100%;
  padding: 12px;
  background-color: #1c97f7;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 18px;
  cursor: pointer;
}

.submit-btn:hover {
  background-color: #1873b0;
}

.course-list {
  margin-top: 20px;
}

.course-item {
  background-color: #f8f8f8;
  padding: 15px;
  margin-bottom: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.course-name {
  font-size: 18px;
  font-weight: bold;
}

.course-time,
.course-location {
  font-size: 16px;
  color: #666;
  margin-top: 5px;
}
</style>