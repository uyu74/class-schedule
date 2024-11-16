<template>
  <view class="container">
    <!-- 页面内容 -->
    <view class="content">
      <!-- 课程表内容 --> <!-- 待完成 -->
    </view>
    
    <!-- 底部按钮 -->
    <view class="bottom-btn-container">
      <view class="bottom-btn-add-course" @click="goToNextPage">添加课程</view>
      <view class="bottom-btn-schedule-setting">设置日程</view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    // 跳转到课程表页面
    goToNextPage() {
      uni.navigateTo({
        url: '/pages/obtain_class_information/obtain_class_information'  // 目标页面路径
      });
    }
  }
};
</script>

<style>
.container {
  padding: 20px;
}

.content {
  margin-bottom: 100px; /* 留出底部按钮的空间 */
}

.bottom-btn-container {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  justify-content: space-between;
  width: 200px;
  z-index: 10;
}

.bottom-btn-add-course, .bottom-btn-schedule-setting {
  background-color: #1c97f7;
  color: white;
  padding: 10px 20px;
  border-radius: 20px;
  font-size: 16px;
  text-align: center;
}

.bottom-btn-add-course {
  margin-right: 10px; /* 按钮间距 */
}

.bottom-btn-schedule-setting {
  background-color: #1873b0;
}

/* 按钮点击样式 */
.bottom-btn-add-course:hover, .bottom-btn-schedule-setting:hover {
  background-color: #1873b0;
}
</style>
