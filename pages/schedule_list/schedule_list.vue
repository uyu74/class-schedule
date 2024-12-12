<template>
  <view class="container">
    <!-- 显示已创建的课程表 -->
    <view class="schedule-list">
      <text>已创建的课程表:</text>
      <view v-for="(schedule, index) in schedules" :key="index">
        <text>{{ schedule }}</text>
      </view>
    </view>

    <!-- 新建课程表按钮 -->
    <button class="create-btn" @click="createNewSchedule">新建课程表</button>
  </view>
</template>

<script>
export default {
  data() {
    return {
      schedules: []  // 存储已创建的课程表名称
    };
  },
  onLoad() {
    // 读取本地存储的课程表数据
    const storedSchedules = uni.getStorageSync('schedules');
    if (storedSchedules) {
      this.schedules = JSON.parse(storedSchedules);  // 将数据解析为数组
    }
  },
  methods: {
    // 新建课程表
    createNewSchedule() {
      console.log('新建课程表按钮被点击了');
      uni.showModal({
        title: '新建课程表',
        editable: true,  // 允许用户输入
        placeholderText: '请输入课程表名称',  // 输入框提示文本
        success: (res) => {
          console.log('弹窗回调结果:', res);
          if (res.confirm) {
            const scheduleName = res.content;  // 获取用户输入的课程表名称
            if (scheduleName.trim()) {
              this.schedules.push(scheduleName);  // 将课程表名称添加到列表
              // 保存到本地存储
              uni.setStorageSync('schedules', JSON.stringify(this.schedules));
			  // 跳转到课程表页面
        console.log(scheduleName); // 输出课程表名称
			  uni.navigateTo({
			    url: '/pages/obtain_class_information/obtain_class_information?scheduleName=' + encodeURIComponent(scheduleName) // 传递课程表名称
			  });
            } else {
              uni.showToast({
                title: '课程表名称不能为空',
                icon: 'none'
              });
            }
          } else if (res.cancel) {
            console.log('用户点击取消');
          }
        }
      });
    }
  }
};
</script>

<style scoped>
/* 页面容器，使用flex布局 */
.container {
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-between;  /* 保证按钮在底部 */
  padding: 20px;
}

/* 课程表列表 */
.schedule-list {
  flex: 1;  /* 占据剩余空间 */
}

/* 按钮样式 */
.create-btn {
  width: 120px;
  height: 40px;
  background-color: #007aff;
  color: white;
  border-radius: 5px;
  font-size: 14px;
  align-self: center;  /* 让按钮居中对齐 */
  position: fixed;
  bottom: 20px;  /* 距离底部 20px */
}
</style>
