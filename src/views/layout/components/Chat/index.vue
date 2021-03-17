<template>
  <div class="chatMain">
    <lemon-imui
      ref="IMUI"
      class="lemon"
      width="1000px"
      height="750px"
      theme="blue"
      avatarCricle="true"
      loadendText="只显示最近30条信息"
      :user="user"
      @pull-messages="handlePullMessages"
      @send="handleSend"
      @change-contact="handleChangeContact"
      @message-click="handleMessageClick"
    ></lemon-imui>
    <history-message ref="historyMessageRef" :historyMessageDialogData="historyMessageDialogData"></history-message>
    <el-image
      ref="preview"
      style="display:none"
      :src="imageSrc"
      :fit="fill"
      :preview-src-list="srcList"
      z-index="2050"
    ></el-image>
  </div>
</template>
<script>
import './js/init'
import { pullMessage } from '@/api/laboratory/chat_module/chat'
import EmojiData from './database/emoji'
import { uploadPicByBase64 } from '@/api/common/upload'
import { fileByBase64 } from '@/utils/functions'
import HistoryMessage from './components/HistoryMessage'
export default {
  name: 'Api:laboratory/chat_module/chat_online-chatOnline',
  components: {
    HistoryMessage,
  },
  data() {
    return {
      path: process.env.WS_API,
      user: {},
      messages: [],
      timeer: '',
      next: '',
      imgUrl: '',
      historyMessageDialogData: {
        visible: false,
        contact_id: null,
      },
      imageSrc: '',
      srcList: [],
      imageDialogVisible: false,
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
      // {
      //   name: 'uploadFile',
      // },
      {
        name: 'uploadImage',
      },
      {
        name: 'history_message',
        isRight: true,
        title: '历史记录',
        click: () => {
          this.historyMessageDialogData.visible = true
          this.$refs['historyMessageRef'].init()
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
      //执行到next消息会停止转圈，如果接口调用失败，可以修改消息的状态 next({status:'failed'});
      //调用你的消息发送业务接口
      if (message.type == 'image') {
        fileByBase64(file, (base64) => {
          uploadPicByBase64({ file: base64, savePath: 'chat' }).then(
            (response) => {
              if (response.code == 200) message.content = response.data.url
              this.send(message, '/friend/send_message')
            }
          )
        })
      } else {
        this.send(message, '/friend/send_message')
      }
      next()
    },
    handleChangeContact(contact, instance) {
      instance.updateContact({
        id: contact.id,
        unread: 0,
      })
      this.historyMessageDialogData.contact_id = contact.id
      instance.closeDrawer()
      instance.messageViewToBottom()
    },
    handleMessageClick(event, key, Message, instance) {
      if (Message.type == 'image') {
        this.imageSrc = Message.content
        while (this.srcList.length > 0) {
          this.srcList.pop()
        }
        for (let i = 0; i < instance.getCurrentMessages().length; i++) {
          if (instance.getCurrentMessages()[i].type == 'image')
            this.srcList.push(instance.getCurrentMessages()[i].content)
        }
        this.$refs.preview.clickHandler()
      }
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