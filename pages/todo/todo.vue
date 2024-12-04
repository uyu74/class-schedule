<template>
	<view class="contenter">
		<div v-for="(todo,index) in todos" :key="index">
			<view :class="{
				'goodtodo-item':true,
				'badtodo-item':todo.time<=currentTime}"
				@longpress="onlongPressTodo(index)"
				@click="onclickTodo(index)">
				<view class="todo-time">
					<text>{{todo.time}}</text>
				</view>
				<view class="todo-content">
					<text>{{todo.content}}</text>
				</view>
				<view class="todo-remark">
					<text>{{todo.remark}}</text>
				</view>
			</view>
		</div>
	</view>
	<view class="addItemIcon" @click="moveToAddTodo()">
		<image src="../../static/todoAdd.png"></image>
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
			//console.log("出现了");
			const todo_list = uni.getStorageSync("todo-list");
			if(todo_list){
				//console.log(todo_list);
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
			onclickTodo(i){
				uni.navigateTo({
					url:"/pages/todo_settings/todo_settings?id="+i
				})
			},
			moveToAddTodo(){
				//console.log("点了");
				uni.navigateTo({
					url:"/pages/obtain_todo_infromation/obtain_todo_infromation"
				})
			},
			deleteTodo(i){
				let todo_list = uni.getStorageSync("todo-list");
				//console.log(todo_list);
				todo_list.splice(i,1);
				this.todos = todo_list;
				uni.setStorageSync("todo-list",todo_list);
				return;
			},
			onlongPressTodo(i){
				uni.showModal({
					title:"提示",
					content:"确定要删除该事项吗",
					success:(res)=>{
						if(res.confirm)
						this.deleteTodo(i);
					},
					fail:(err)=>{
						uni.showToast({
							title:"运行失败",
							icon:"err"
						})
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
page {
	background-color: #fdfdec;
}
.contenter {
	padding: 30rpx 50rpx;
	height: 100vh;
	background-color: #f3f3f3;
	.goodtodo-item,.badtodo-item {
		height:200rpx;
		padding: 30rpx 25rpx;
		background-color: white;
		box-shadow: 0 4rpx 8rpx rgba(83, 83, 83, 0.1);
		border-radius: 20rpx;
		margin-bottom: 30rpx;
		.todo-content {
			display: flex;
			margin-bottom: 30rpx;
			align-items: baseline;
			font-size: 34rpx;
		}
		.todo-time {
			display: flex;
			margin-bottom: 30rpx;
			align-items: baseline;
			font-size: 20rpx;
		}
		.todo-remark {
			display: flex;
			height: 60rpx;
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
.addItemIcon {
	position: fixed;
	bottom:30rpx;
	right:325rpx;
	width:100rpx;
	height: 100rpx;
	border-radius: 50rpx;
	image {
		width: 100%;
		height: 100%;
	}
}
</style>
