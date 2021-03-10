<template>
  <div class="chatMain">
    <lemon-imui
      ref="IMUI"
      class="lemon"
      width="1000px"
      height="750px"
      :user="user"
      @pull-messages="handlePullMessages"
      @send="handleSend"
    />
  </div>
</template>
<script>
import { pullMessage } from '@/api/laboratory/chat_module/chat'
export default {
  name: 'Api:laboratory/chat_module/chat_online-chatOnline',
  data() {
    return {
      path: 'ws://192.168.6.84:9502',
      user: {},
      messages: [],
    }
  },
  created() {},
  mounted() {
    this.init()
    const { IMUI } = this.$refs
    //初始化表情包。
    // IMUI.initEmoji(...);
  },
  methods: {
    init: function () {
      if (typeof WebSocket === 'undefined') {
        alert('您的浏览器不支持socket')
      } else {
        // 实例化socket
        this.socket = new WebSocket(this.path, [this.$store.getters.token])
        // 监听socket连接
        this.socket.onopen = this.open
        // 监听socket错误信息
        this.socket.onerror = this.error
        // 监听socket消息
        this.socket.onmessage = this.getMessage
      }
    },
    open: function () {
      console.log('socket连接成功')
    },
    error: function () {
      console.log('连接错误')
    },
    getMessage: function (msg) {
      const { IMUI } = this.$refs

      let data = JSON.parse(msg.data)
      if (data.type == 'init') {
        //初始化用户
        this.user = data.user_info
        //初始化联系人
        IMUI.initContacts(data.user_contact)
      } else {
        IMUI.appendMessage(data)

        // IMUI.appendMessage(data)
      }
    },
    send: function (message) {
      this.socket.send(message)
    },
    close: function () {
      console.log('socket已经关闭')
    },
    handlePullMessages(contact, next) {
      //从后端请求消息数据
      pullMessage().then((response) => {
        this.messages = response.data.list
        console.log(this.messages)
        //将第二个参数设为true，表示已到末尾，聊天窗口顶部会显示“暂无更多消息”，不然会一直转圈。
        next(this.messages, true)
      })
    },
    handleSend(message, next, file) {
      //调用你的消息发送业务接口
      this.send(JSON.stringify(message))
      //执行到next消息会停止转圈，如果接口调用失败，可以修改消息的状态 next({status:'failed'});
      next()
    },
  },
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.lemon {
  position: relative;
  left: 22%;
}
</style>  