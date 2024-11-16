<template>
  <view class="container">
    <!-- 页面内容 -->
    <view class="content">
      <text>这里是页面内容</text>
    </view>

    <!-- 底部按钮 -->
    <view class="bottom-btn">
      <button @click="goToNextPage">跳转到课程表</button>
    </view>
  </view>
</template>

<script>
export default {
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

<style scoped>
.container {
  padding: 20px;
}

.content {
  margin-bottom: 100px; /* 留出底部按钮的空间 */
}

.bottom-btn {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
}

button {
  padding: 10px 20px;
  background-color: #1c97f7;
  color: white;
  border: none;
  border-radius: 20px;
  font-size: 16px;
}

button:hover {
  background-color: #1873b0;
}
</style>
