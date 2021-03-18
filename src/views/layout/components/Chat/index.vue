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
      :contextmenu="contextmenu"
    ></lemon-imui>
    <history-message ref="historyMessageRef" :historyMessageDialogData="historyMessageDialogData"></history-message>
    <file-upload ref="fileUploadCom" savePath="/chat/file"></file-upload>
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
import EmojiData from './database/emoji'
import HistoryMessage from './components/HistoryMessage'
import FileUpload from './components/FileUpload'
import { download } from '@/utils/file'
import { uploadPicByBase64 } from '@/api/laboratory/chat_module/upload'
import { fileByBase64, generateUUID } from '@/utils/functions'
import Clipboard from 'clipboard'
const generateRandId = () => {
  return Math.random().toString(36).substr(-8)
}
const getTime = () => {
  return new Date().getTime()
}
export default {
  name: 'Chat',
  components: {
    HistoryMessage,
    FileUpload,
    Clipboard,
  },
  data() {
    return {
      path: process.env.WS_API,
      user: {},
      messages: [],
      messagesToBeSend: {},
      fileIdToMessageId: {},
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
      contextmenu: [
        {
          click: (e, instance, hide) => {
            const { IMUI, message } = instance
            console.log(getTime())
            console.log(message.sendTime)
            if (getTime() - message.sendTime > 120000) {
              this.$message({
                message: '发送时间超出两分钟，不允许撤回',
                type: 'error',
              })
            } else {
              const data = {
                id: generateRandId(),
                type: 'event',
                //使用 jsx 时 click必须使用箭头函数（使上下文停留在vue内）
                content: (
                  <div>
                    <span>
                      你撤回了一条消息{' '}
                      <span
                        v-show={message.type == 'text'}
                        style="color:#333;cursor:pointer"
                        content={message.content}
                        on-click={(e) => {
                          IMUI.setEditorValue(e.target.getAttribute('content'))
                        }}
                      >
                        重新编辑
                      </span>
                    </span>
                  </div>
                ),

                toContactId: message.toContactId,
                sendTime: getTime(),
              }
              this.send(message, '/friend/withdraw_message')
              IMUI.removeMessage(message.id)
              IMUI.appendMessage(data, true)
            }

            hide()
          },
          visible: (instance) => {
            return instance.message.fromUser.id == this.user.id
          },
          text: '撤回消息',
        },
        // {
        //   visible: (instance) => {
        //     return instance.message.fromUser.id != this.user.id
        //   },
        //   text: '举报',
        // },
        // {
        //   text: '转发',
        // },
        {
          visible: (instance) => {
            return instance.message.type == 'text'
          },
          text: '复制文字',
          click: (e, instance, hide) => {
            const { IMUI, message } = instance
            this.copy(message.content)
            hide()
          },
        },
        {
          visible: (instance) => {
            return instance.message.type == 'image'
          },
          text: '下载图片',
          click: (e, instance, hide) => {
            const { IMUI, message } = instance
            const fileExtension = message.content.substring(
              message.content.lastIndexOf('.') + 1
            )
            download(message.content, message.content, fileExtension, false)
            hide()
          },
        },
        {
          visible: (instance) => {
            return instance.message.type == 'file'
          },
          click: (e, instance, hide) => {
            const { IMUI, message } = instance
            const fileExtension = message.content.substring(
              message.content.lastIndexOf('.') + 1
            )
            download(message.content, message.fileName, fileExtension, true)
            hide()
          },
          text: '下载文件',
        },
        {
          click: (e, instance, hide) => {
            const { IMUI, message } = instance
            IMUI.removeMessage(message.id)
            hide()
          },
          icon: 'lemon-icon-folder',
          color: 'red',
          text: '删除',
        },
      ],
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
        name: 'uploadImage',
      },
      {
        name: 'uploadFile',
        click: () => {
          this.$refs['fileUploadCom'].$refs[
            'fileUpload'
          ].$children[0].$refs.input.click()
        },
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
        //初始化联系人 (使用lastContentRender将图片 文件类型转换)
        for (let i = 0; i < data.user_contact.length; i++) {
          if (
            data.user_contact[i].lastContent != '' &&
            data.user_contact[i].lastContentType != ''
          ) {
            data.user_contact[i].lastContent = IMUI.lastContentRender({
              type: data.user_contact[i].lastContentType,
              content: data.user_contact[i].lastContent,
            })
          }
        }
        IMUI.initContacts(data.user_contact)
        IMUI.messageViewToBottom()
      } else if (data.type == 'friend_history_message') {
        this.messages = data
        this.next(this.messages.friend_history_message, true)
      } else if (data.type == 'withdraw_message') {
        let message = data.message
        console.log(message)
        const appendMessag = {
          id: generateRandId(),
          type: 'event',
          //使用 jsx 时 click必须使用箭头函数（使上下文停留在vue内）
          content: '"' + message.fromUser.displayName + '" 撤回了一条消息',
          toContactId: message.fromUser.id,
          sendTime: getTime(),
        }
        IMUI.removeMessage(message.id)
        IMUI.appendMessage(appendMessag, true)
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
              if (response.code == 200) {
                message.content = response.data.url
                message.fileName = response.data.fileName
              }
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
    beforeFileUpload(file, dataObj) {
      const { IMUI } = this.$refs
      const message = {
        id: dataObj.messageId,
        status: 'going',
        type: 'file',
        sendTime: Date.parse(new Date()),
        content: '',
        fileSize: file.size,
        fileName: file.name,
        toContactId: IMUI.getCurrentContact().id,
        fromUser: {
          id: this.user.id,
          displayName: this.user.displayName,
          avatar: this.user.avatar,
        },
      }
      this.$set(this.messagesToBeSend, message.id, message)
      this.$set(this.fileIdToMessageId, file.uid, message.id)
      IMUI.appendMessage(message, true)
    },
    afterFileUpload(res, file) {
      const { IMUI } = this.$refs
      if (res.code != 200) {
        this.$message({
          showClose: true,
          message: res.msg,
          type: 'error',
        })
        IMUI.updateMessage({
          id: this.fileIdToMessageId[file.uid],
          status: 'failed',
        })
      } else {
        IMUI.updateMessage({
          id: res.data.messageId,
          content: res.data.url,
          status: 'succeed',
        })
        let messageId = res.data.messageId
        this.send(this.messagesToBeSend[messageId], '/friend/send_message')
      }
      delete this.messagesToBeSend[messageId]
      delete this.fileIdToMessageId[file.uid]
    },
    copy(data) {
      let clipboard = new Clipboard('.lemon-message__content', {
        text: function () {
          return data
        },
      })
      clipboard.on('success', (e) => {
        this.$message({ message: '复制成功', showClose: true, type: 'success' })
        // 释放内存
        clipboard.destroy()
      })
      clipboard.on('error', (e) => {
        this.$message({ message: '复制失败,', showClose: true, type: 'error' })
        clipboard.destroy()
      })
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