<template>
	<view class="container">
	  <text>选择时间：</text>
	  <picker mode="time" value="{{time}}" bindchange="onTimeChange">
	    <view class="picker">
	      {{time || '请选择时间'}}
	    </view>
	  </picker>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				time: "",
			}
		},
		methods: {
			onTimeChange(e) {
			    this.setData({
			      time: e.detail.value, // 获取选中的时间
			    });
			    console.log("选中的时间是：", e.detail.value);
			  },
		}
	}
</script>

<style>

.container {
  padding: 20px;
}

.picker {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  text-align: center;
}

</style>
