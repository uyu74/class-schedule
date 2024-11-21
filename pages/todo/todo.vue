<template>
	<view class="contenter">
		<div v-for="todo in todos" :key="todo._id">
			<view class="todo-item">
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
			const todo_len = uni.getStorageSync("todo-len");
			console.log(todo_len);
			for(let i=1;i<=todo_len;i = i+1)
			{	
				console.log(i);
				let todo_item = uni.getStorageSync("todo-"+i);
				if(todo_item){
					this.todos[i-1] = todo_item;
					console.log(todo_item);
				}else{
					console.log("错误");
				}
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
	.todo-item {
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
}
</style>
