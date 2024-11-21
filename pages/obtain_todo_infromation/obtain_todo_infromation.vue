<template>
  <view class="container">
    <view class="header">
      <text class="title">日程信息录入</text>
    </view>

    <!-- 日程信息输入表单 -->
    <view class="form-section">
      <form @submit="addTodo">
        <view class="input-group">
          <text>日程内容</text>
          <input v-model="todoContent" type="text" placeholder="请输入日程的内容" required />
        </view>
        <view class="input-time">
			<view class="input-date">
			   <view class="input-date-mark">
				  <text> 日期：</text>
			   </view>
			   <picker mode="date" :start="currentTime" :value="todoTimeDate" @change="changeDate">
					<view class="input-show-date">
						{{todoTimeDate}}
					</view>
				</picker>
			</view>
			<view class="input-clock">
				<view class="input-clock-mark">
					<text>时间：</text>
				</view>
				<picker mode="time" :value="todoTimeClock" @change="changeClock">
					<view class="input-show-clock">
						{{todoTimeClock}}
					</view>
				</picker>
			</view>
		</view>
        <view class="input-group">
          <text>日程备注（可选）</text>
          <input v-model="todoRemark" type="text" placeholder="请输入日程的备注" />
        </view>
        <button :class="{ 'disablesubmit-btn': disableButton, 'ablesubmit-btn': !disableButton }" type="button" :disabled="disableButton" @click="addTodo">添加日程</button>
      </form>
    </view>

    <!-- 日程列表 -->
    <view class="todo-list">
      <view class="todo-item" v-for="(todo, index) in todos" :key="index">
        <view class="todo-content">{{ todo.content }}</view>
		<view class="todo-time">{{todo.time}}</view>
        <view class="todo-remark">备注: {{ todo.remark }}</view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      todoContent: "",
	  todoTime:"",
      todoTimeDate: "",
	  todoTimeClock: "00:00",
      todoRemark: "",
      todos: []
    };
  },
  
  computed: {  
	  //当前时间，格式为y-m-d，类型为字符串
	  currentTime() {
		const date = new Date();
		let year = date.getFullYear();
		let month = date.getMonth() + 1;
		let day = date.getDate();
		month = month > 9 ? month : '0' + month;
		day = day > 9 ? day : '0' + day;
		
		this.todoTimeDate = `${year}-${month}-${day}`;
		return `${year}-${month}-${day}`;
	  },
	  disableButton(){
		 /* if(this.todoContent == null)
		  return false; */
	   return !this.todoContent.trim();
	  }
  } ,
  
  methods: {
		  //更新储存，按时间顺序
		  refreshStorage(e){
			let old_todolist = uni.getStorageSync("todo-list");
			let insertIndex = old_todolist.findIndex(item => item.time > e.time)
		   if (insertIndex == -1) {
				old_todolist.push(e);
			} else {
				console.log(insertIndex);
				old_todolist.splice(insertIndex, 0, e);
			}
			uni.setStorageSync("todo-list",old_todolist);
			return true;
		  },
		  //本页的显示的更新
		  refreshTodoShown(e){
			this.todos.push(e);
			return;
		  },
		  //检测初始化，若没有就初始为空
		  initTodoList(){
			let todo_list = uni.getStorageSync("todo-list");
			if(!todo_list)
			{
				uni.setStorageSync("todo-list",[/* {
					content:"",
					time:"",
					remark:""
				} */]);
			}
			return;
		  },
		// 添加日程
		addTodo() {
			this.initTodoList();
			const todo = {
				content:this.todoContent,
				time:this.todoTimeDate+" "+this.todoTimeClock,
				remark:this.todoRemark
			}
			const successStorage = this.refreshStorage(todo);
			if(successStorage == false)
			{
				uni.showToast({
					content:"内存操作异常",
					icon:"error"
				})
				return;
			}
			this.refreshTodoShown(todo);
			this.todoContent = "";
			this.todoRemark = "";
		  },
		changeDate(e){
			this.todoTimeDate = e.detail.value;
			//console.log(this.todoTimeDate);
		},
		
		changeClock(e) {
			this.todoTimeClock = e.detail.value;
			let parts = this.todoTimeClock.split(":");
			if(parts[0]=="0")parts[0].push("0");
			if(parts[1]=="0")parts[1].push("0");
			this.todoTimeClock = parts[0]+":"+parts[1];
			console.log(this.todoTimeClock);
		}
	  }
};
</script>

<style lang="scss" scoped>
.container {
  padding: 20px;
  
	.header {
	  text-align: center;
	  margin-bottom: 20px;
		.title {
		  font-size: 24px;
		  font-weight: bold;
		}
	}
	.form-section {
	  margin-bottom: 30px;
	  form {
		  .input-group {
		    margin-bottom: 15px;
			input {
			  width: 100%;
			  padding: 10px;
			  margin-top: 5px;
			  border: 1px solid #ddd;
			  border-radius: 4px;
			  font-size: 16px;
			}
		  }
		  .input-time {
			  .input-date {
				  display: flex;
				  height: 80rpx;
				  margin-bottom: 15px;
				  .input-date-mark {
					  display: flex;
					  width:150rpx;
					  justify-content: center;
					  align-items: center;
					  font-size: 20px;
				  }
				  .input-show-date {
					  width:400rpx;
					  padding: 10px;
					  margin-top: 5px;
					  border: 1px solid #ddd;
					  border-radius: 4px;
					  font-size: 16px;
				  }
			  }
			  .input-clock {
				  display: flex;
				  height: 120rpx;
				  margin-bottom: 15px;				  
				  .input-clock-mark {
					display: flex;
					width:150rpx;
					justify-content: center;
					align-items: center;
					font-size: 20px;
				  }
				  .input-show-clock {
					  width:400rpx;
					  padding: 10px;
					  margin-top: 5px;
					  border: 1px solid #ddd;
					  border-radius: 4px;
					  font-size: 16px;
				  }
			  }
		  }
		  .ablesubmit-btn {
		    width: 100%;
		    padding: 12px;
		    background-color: #1c97f7;
		    color: white;
		    border: none;
		    border-radius: 4px;
		    font-size: 18px;
		    cursor: pointer;
				.submit-btn:hover {
				  background-color: #1873b0;
				}
		  }
		  .disablesubmit-btn {
			  width: 100%;
			  padding: 12px;
			  background-color: #6ab1c4;
			  color: white;
			  border: none;
			  border-radius: 4px;
			  font-size: 18px;
			  cursor: pointer;
			  	.submit-btn:hover {
			  	  background-color: #1873b0;
			  	}
		  }
	  }
	}


	
	.todo-list {
	  margin-top: 20px;
	  .todo-item {
		background-color: #f8f8f8;
		padding: 15px;
		margin-bottom: 15px;
		border-radius: 8px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		.todo-content {
		  font-size: 18px;
		  font-weight: bold;
		}	
		.todo-time,
		.todo-remark {
		  font-size: 16px;
		  color: #666;
		  margin-top: 5px;
		}
	  }
	}
}
</style>