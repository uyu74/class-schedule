<template>
  <view class="container">
    <!-- 显示传递过来的课程表名称 -->
    <uni-section title="学期开始的第一天" type="line"></uni-section>
	<uni-datetime-picker type="date" :clear-icon="false" v-model="single" @maskClick="maskClick" />
  </view>
</template>

<script>
import uniSection from '@/uni_modules/uni-section/components/uni-section/uni-section.vue';  // 引入组件
export default {
  data() {
    return {
		single: '',  // 存储选择的时间
      scheduleName: ''  // 存储传递过来的课程表名称
    };
  },
  onLoad(options) {
    // 获取传递的课程表名称
    if (options.scheduleName) {
      this.scheduleName = options.scheduleName;  // 将课程表名称赋值给 data
    }
  }
};
</script>

<style lang="scss" scoped>
$uni-success: #18bc37 !default;
/* 样式根据需要自行修改 */
.container {
  padding: 20px;
}
.mb-10 {
		margin-bottom: 10px;
	}
</style>
