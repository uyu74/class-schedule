<template>
	<view class="contenter">
		<div v-for="todo in todos">
			<view :class="{
				'goodtodo-item':true,
				'badtodo-item':todo.time<=currentTime}">
				<view class="todo-content">
					<text class="todo-label">内容：</text>
					<text>{{todo.content}}</text>
				</view>
				<view class="todo-time">
					<text class="todo-label">时间：</text>
					<text>{{todo.time}}</text>
				</view>
				<view class="todo-remark">
					<text class="todo-label">备注：</text>
					<text>{{todo.remark}}</text>
				</view>
			</view>
		</div>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				todos:[
				
				]
			}
		},
		onShow()
		{
			console.log("出现了");
			const todo_list = uni.getStorageSync("todo-list");
			if(todo_list){
				console.log(todo_list);
				this.todos = todo_list;
			}
			else
			{
				console.log("没有list");
			}
			
		},
		computed:{
			 currentTime() {
			    // 获取当前时间
			    const now = new Date();
			 
			    // 提取年份、月份、日期、小时和分钟
			    const year = now.getFullYear();
			    const month = String(now.getMonth() + 1).padStart(2, '0'); 
			    const day = String(now.getDate()).padStart(2, '0');
			    const hours = String(now.getHours()).padStart(2, '0'); 
			    const minutes = String(now.getMinutes()).padStart(2, '0');
			 
			    const formattedTime = `${year}-${month}-${day} ${hours}:${minutes}`;
			 
			    return formattedTime;
			}
			
		},
		methods: {
			
		}
	}
</script>

<style lang="scss" scoped>
.contenter {
	background-color: #fdfdec;
	padding: 30rpx 50rpx;
	height: 100vh;
	.goodtodo-item,.badtodo-item {
		height:300rpx;
		padding: 30rpx 25rpx;
		border: 1rpx solid black;
		border-radius: 20rpx;
		margin-bottom: 30rpx;
		.todo-label {
			font-size: 50rpx;
			width:150rpx;
		}
		.todo-content {
			display: flex;
			margin-bottom: 30rpx;
			align-items: baseline;
			font-size: 40rpx;
		}
		.todo-time {
			display: flex;
			margin-bottom: 30rpx;
			align-items: baseline;
			font-size: 30rpx;
		}
		.todo-remark {
			display: flex;
			margin-bottom: 30rpx;
			align-items: baseline;
			font-size: 25rpx;
			border-bottom: 1rpx solid #ccc;
		}
	}
	.badtodo-item {
		border: 1rpx solid red;
	}
}
</style>
