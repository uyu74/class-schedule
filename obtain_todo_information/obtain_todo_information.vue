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
        <view class="input-group">
          <text>日程时间</text>
          <input v-model="todoTime" type="text" placeholder="请输入日程安排的时间" required />
        </view>
        <view class="input-group">
          <text>日程备注（可选）</text>
          <input v-model="todoRemark" type="text" placeholder="请输入日程的备注" />
        </view>
        <button class="submit-btn" type="button" @click="addTodo">添加日程</button>
      </form>
    </view>

    <!-- 日程列表 -->
    <view class="todo-list">
      <view class="todo-item" v-for="(todo, index) in todos" :key="index">
        <view class="todo-content">{{ todo.content }}</view>
        <view class="todo-time">时间: {{ todo.time }}</view>
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
      todoTime: "",
      todoRemark: "",
      todos: []
    };
  },
  methods: {
    // 添加日程
    addTodo() {
      if (this.todoContent && this.todoTime) {
        // 添加日程到日程列表
        this.todos.push({
		  content: this.todoContent,
		  time: this.todoTime,
		  remark: this.todoRemark
        });

        // 清空输入框
        this.todoContent = "";
        this.todoTime = "";
        this.todoRemark = "";

        // 提示添加成功
        uni.showToast({
          title: "日程已添加",
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

.todo-list {
  margin-top: 20px;
}

.todo-item {
  background-color: #f8f8f8;
  padding: 15px;
  margin-bottom: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

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
</style>