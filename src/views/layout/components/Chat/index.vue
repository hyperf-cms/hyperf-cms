<template>
  <div class="chatMain">
    <lemon-imui
      ref="IMUI"
      class="lemon"
      width="1000px"
      height="750px"
      theme="blue"
      avatarCricle="true"
      :sendKey="(e)=> e.keyCode == 13 && e.ctrlKey "
      :user="user"
      @pull-messages="handlePullMessages"
      @send="handleSend"
      @change-contact="handleChangeContact"
    ></lemon-imui>
  </div>
</template>
<script>
import './js/init'
import { pullMessage } from '@/api/laboratory/chat_module/chat'
import EmojiData from './database/emoji'
export default {
  name: 'Api:laboratory/chat_module/chat_online-chatOnline',
  data() {
    return {
      path: process.env.WS_API,
      user: {},
      messages: [],
      timeer: '',
      next: '',
    }
  },
  created() {},
  mounted() {
    this.init()
    const { IMUI } = this.$refs

    //初始化表情包。
    IMUI.initEmoji(EmojiData)
    //初始化工具栏
    IMUI.initEditorTools([
      {
        name: 'emoji',
      },
      {
        name: 'uploadFile',
      },
      {
        name: 'uploadImage',
      },
      {
        name: 'history_message',
        isRight: true,
        title: '历史记录',
        click: () => {
          alert('点击了聊天记录')
        },
        render: () => {
          return (
            <svg-icon class-name="search-icon" icon-class="history_message" />
          )
        },
      },
    ])
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
        this.socket.onclose = this.close
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
        IMUI.messageViewToBottom()
      } else if (data.type == 'friend_history_message') {
        this.messages = data
        this.next(this.messages.friend_history_message, true)
      } else {
        IMUI.appendMessage(data, true)
        IMUI.messageViewToBottom()
      }
    },
    send: function (message, uri) {
      let data = {
        message: message,
        uri: uri,
      }
      this.socket.send(JSON.stringify(data))
    },
    close: function () {
      console.log('连接关闭')
    },
    handlePullMessages(contact, next) {
      const that = this
      let data = {
        message: {
          contact_id: contact.id,
          user_id: this.user.id,
        },
        uri: '/friend/pull_message',
      }
      this.socket.send(JSON.stringify(data))
      this.next = next
    },
    handleSend(message, next, file) {
      //调用你的消息发送业务接口
      this.send(message, '/friend/send_message')
      //执行到next消息会停止转圈，如果接口调用失败，可以修改消息的状态 next({status:'failed'});
      next()
    },
    handleChangeContact(contact, instance) {
      console.log('Event:change-contact')
      instance.updateContact({
        id: contact.id,
        unread: 0,
      })
      instance.closeDrawer()
      instance.messageViewToBottom()
    },
  },
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.chatMain >>> .lemon-editor__emoji-item {
  cursor: pointer;
  width: 30px;
  padding: 4px;
  border-radius: 4px;
}
.chatMain >>> .lemon-message-text .lemon-message__content img {
  width: 22px;
  height: 18px;
  display: inline-block;
  background: transparent;
  position: relative;
  top: -1px;
  padding: 0 2px;
  vertical-align: middle;
}
.chatMain >>> .lemon-wrapper--theme-blue .lemon-menu {
  background-color: #409eff;
}
.chatMain >>> .search-icon {
  cursor: pointer;
  font-size: 17px;
  vertical-align: middle;
}
</style>