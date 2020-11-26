<template>
  <el-dialog
    :title="this.messageType[this.messageView.messageType]"
    :visible.sync="messageDialogVisible"
    width="40%"
    :close-on-click-modal="false"
    :show-close="false"
    class="message-dialog"
  >
    <el-card class="box-card" shadow="never" v-if="this.messageView.messageType == 'notice'">
      <h3 v-html="messageView.title"></h3>
      <p style="color: #999;font-style: italic" v-html="messageView.created_at"></p>
      <div v-html="messageView.content"></div>
    </el-card>
    <el-card class="box-card" shadow="never" v-else-if="this.messageView.messageType == 'advice'">
      <div class="text item">
        <h3 v-html="messageView.title"></h3>
        <div class="content" v-html="messageView.content"></div>
        <div class="devide-line"></div>
        <p style="font-size: 14px;font-weight: bold;">反馈：</p>
        <div class="reply" v-html="messageView.reply"></div>
      </div>
    </el-card>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="showPrevMessage" v-if="messageInfo.prevBtn">上一条</el-button>
      <el-button type="primary" @click="showNextMessage" v-if="messageInfo.nextBtn">下一条</el-button>
      <el-button type="primary" @click="messageDialogVisible=false" v-if="this.messageInfo.closeBtn">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'MessageDialog',
  props: {
    messageList: {
      type: Array,
      default: []
    },
  },
  data() {
    return {
      messageDialogVisible: false,
      messageView: [],
      messageInfo: {
        nextList: [],
        prevList: [],
        nextBtn: false,
        prevBtn: false,
        closeBtn: true,
      },
      messageType: {
        notice: '最新通知',
        advice: '建议反馈',
      }
    }
  },
  watch: {
    messageList (val) {
      // 如果列表中有消息则弹窗显示
      if (this.messageList.length > 0) {
        this.showSystemMessage();
      }
    }
  },
  methods: {
    showSystemMessage() { // 显示消息弹窗
      let len = this.messageList.length;
      for (let i = 0; i < len; i++) {
        this.messageInfo.nextList.push(this.messageList[i]);
      }

      this.messageDialogVisible = true;
      this.messageView = this.messageInfo.nextList.shift();
      if (this.messageInfo.nextList.length > 0) {
        this.messageInfo.nextBtn = true;
        this.messageInfo.closeBtn = false;
      }
    },
    showNextMessage() { // 显示下一条消息
      this.messageInfo.prevList.push(this.messageView); // 把当前消息放到已阅消息的队列中
      this.messageInfo.prevBtn = true;
      this.messageView = this.messageInfo.nextList.shift(); // 获取下一条消息
      if (this.messageInfo.nextList.length == 0) {
        this.messageInfo.nextBtn = false;
        this.messageInfo.closeBtn = true;
      }
    },
    showPrevMessage() { // 显示上一条消息
      this.messageInfo.nextList.unshift(this.messageView); // 把当前消息放回到下一条消息队列
      this.messageInfo.nextBtn = true;
      this.messageView = this.messageInfo.prevList.pop(); // 获取上一条消息
      if (this.messageInfo.prevList.length == 0) {
        this.messageInfo.prevBtn = false;
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.devide-line {
  width: 100%;
  height: 2px;
  background-color: #ddd;
}

.message-dialog >>> .content img,
.message-dialog >>> .reply img {
  max-width: 100%;
  height: auto;
}
</style>