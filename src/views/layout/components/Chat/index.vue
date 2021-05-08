<template>
  <div class="chatMain">
    <el-dialog
      style="display:none"
      class="text"
      :visible.sync="chatDialogData.dialogVisible"
      width="1000px"
      :center="true"
      :show-close="false"
      :close-on-press-escape="false"
      :close-on-click-modal="true"
      :modal-append-to-body="true"
    >
      <lemon-imui
        ref="IMUI"
        class="lemon"
        width="1000px"
        height="700px"
        loadendText="只显示最近30条信息"
        :avatarCricle="settingDialogData.avatarCricle"
        :hideMessageName="settingDialogData.hideMessageName"
        :hideMessageTime="settingDialogData.hideMessageTime"
        :theme="settingDialogData.theme"
        :sendKey="settingDialogData.sendText == 'Enter' ? ((e) => !e.ctrlKey && e.keyCode == 13) : ((e) => e.keyCode == 13 && e.ctrlKey)"
        :user="user"
        @pull-messages="handlePullMessages"
        @send="handleSend"
        @change-contact="handleChangeContact"
        @message-click="handleMessageClick"
        :contextmenu="contextmenu"
      >
        <template #message-title="contact">
          <span style="font-size:16px">{{ contact.displayName }}</span>
          <el-badge is-dot class="item" type="success" v-if="contact.status == 1">(在线)</el-badge>
          <el-badge is-dot class="item" v-else>(离线)</el-badge>
        </template>
        <template #editor-footer>
          <div>
            <span>使用 {{ settingDialogData.sendText }} 快捷发送消息</span>
          </div>
        </template>
        <template #cover>
          <div
            class="cover"
            style="width:690px;height:790px;text-align: center;position: relative;"
          >
            <img
              src="https://hyperf-cms.oss-cn-guangzhou.aliyuncs.com/[object Object]/c8b37c310d1418f738cde12e50581d3b.png"
              alt
              style="width: auto;height: auto;max-width: 100%;max-height: 100%;position: absolute;left: 50%;top: 50%;transform: translate(-50%,-50%);opacity: 0.3;"
            />
          </div>
        </template>
        <template #sidebar-message-fixedtop="instance">
          <div style="margin-bottom:10px">
            <p style="margin-top:10px;margin-left:10px;">
              <el-input size="small" style="width:190px;margin-right:10px" placeholder="请输入搜索联系人">
                <i slot="prefix" class="el-input__icon el-icon-search"></i>
              </el-input>
              <el-dropdown trigger="click" size="small">
                <span class="el-dropdown-link" style="cursor: pointer;">
                  <i
                    class="el-icon-plus"
                    style="font-size:20px;vertical-align: middle; font-weight:bold"
                  ></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>
                    <span @click="test(instance)" style="display: block">查找群</span>
                  </el-dropdown-item>
                  <el-dropdown-item divided>
                    <span @click="handleCreateGroup(instance)" style="display: block">创建群聊</span>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </p>
          </div>
        </template>
        <template #sidebar-contact-fixedtop="instance">
          <div style="margin-bottom:10px">
            <p style="margin-top:10px;margin-left:10px;">
              <el-input size="small" style="width:190px;margin-right:10px" placeholder="请输入搜索联系人">
                <i slot="prefix" class="el-input__icon el-icon-search"></i>
              </el-input>
              <el-dropdown trigger="click" size="small">
                <span class="el-dropdown-link" style="cursor: pointer;">
                  <i
                    class="el-icon-plus"
                    style="font-size:20px;vertical-align: middle; font-weight:bold"
                  ></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>
                    <span @click="test(instance)" style="display: block">查找群</span>
                  </el-dropdown-item>
                  <el-dropdown-item divided>
                    <span @click="handleCreateGroup(instance)" style="display: block">创建群聊</span>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </p>
          </div>
        </template>
      </lemon-imui>
      <history-message ref="historyMessageRef" :historyMessageDialogData="historyMessageDialogData"></history-message>
      <setting ref="settingRef" :settingDialogData="settingDialogData"></setting>
      <create-group ref="createGroupRef" :createGroupDialogData="createGroupDialogData"></create-group>
      <file-upload ref="fileUploadCom" savePath="/chat/file"></file-upload>
      <pic-upload ref="picUploadCom" savePath="/chat/pic"></pic-upload>
      <el-image
        ref="preview"
        style="display:none"
        :src="imageSrc"
        :fit="fill"
        :preview-src-list="srcList"
        z-index="2050"
      ></el-image>
    </el-dialog>
  </div>
</template>
<script>
import './js/init'
import EmojiData from './database/emoji'
import HistoryMessage from './components/HistoryMessage'
import FileUpload from './components/FileUpload'
import PicUpload from './components/PicUpload'
import Setting from './components/Setting'
import CreateGroup from './components/CreateGroup'
import { download } from '@/utils/file'
import { uploadPicByBase64 } from '@/api/laboratory/chat_module/upload'
import { setStore, getStore, removeStore } from '@/utils/store'

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
    PicUpload,
    Setting,
    CreateGroup,
  },
  props: {
    chatDialogData: {
      type: Object,
      default: {},
    },
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
      settingDialogData: {
        visible: false,
        sendText: this.$store.state.chat.sendText,
        theme: this.$store.state.chat.theme,
        avatarCricle: this.$store.state.chat.avatarCricle,
        hideMessageName: this.$store.state.chat.hideMessageName,
        hideMessageTime: this.$store.state.chat.hideMessageTime,
        messagePagePrompt: this.$store.state.chat.messagePagePrompt,
        messageTone: this.$store.state.chat.messageTone,
        messageToneType: this.$store.state.chat.messageToneType,
      },
      createGroupDialogData: {
        visible: false,
        contacts: [],
        creator: [],
        checkedContacts: [],
      },
      imageSrc: '',
      srcList: [],
      imageDialogVisible: false,
      contextmenu: [
        {
          click: (e, instance, hide) => {
            const { IMUI, message } = instance
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
    this.$nextTick(() => {
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
          click: () => {
            this.$refs['picUploadCom'].$refs[
              'fileUpload'
            ].$children[0].$refs.input.click()
          },
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
      IMUI.initMenus([
        {
          name: 'messages',
        },
        {
          name: 'contacts',
        },
        {
          name: 'setting',
          title: '设置',
          unread: 0,
          click: () => {
            this.settingDialogData.visible = true
          },
          render: (menu) => {
            return <i class="el-icon-setting"></i>
          },
          isBottom: true,
        },
      ])
    })
  },
  methods: {
    init: function (socket) {
      // 实例化socket
      this.socket = socket
      // 监听socket连接
      this.socket.onopen = this.open
      // 监听socket错误信息
      this.socket.onerror = this.error
      // 监听socket消息
      this.socket.onmessage = this.getMessage
      this.socket.onclose = this.close
    },
    open: function () {},
    error: function () {
      console.log('连接错误')
    },
    getMessage: function (msg) {
      const { IMUI } = this.$refs

      let data = JSON.parse(msg.data)
      console.log(data)
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
      } else if (data.type == 'create_group') {
        let contact = {
          id: data.message.groupId,
          displayName: data.message.groupName,
          avatar: data.message.avatar,
          index: data.message.groupName,
        }
        console.log(contact)
        IMUI.appendContact(contact)
      } else {
        IMUI.appendMessage(data, true)
        //判断是否显示消息通知
        if (this.settingDialogData.messagePagePrompt) {
          this.$notify.warning({
            title: '你有一条新的消息',
            duration: 2000,
            position: 'bottom-right',
            offset: 100,
            message: '来自："' + data.fromUser.displayName + '"',
          })
        }
        //播放收到信息音频
        if (this.settingDialogData.messageTone) {
          this.playAudio(this.settingDialogData.messageToneType)
        }
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
      this.send(message, '/friend/send_message')
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
    handleCreateGroup(instance) {
      this.createGroupDialogData.visible = true
      this.createGroupDialogData.contacts = instance.contacts
      this.createGroupDialogData.creator = instance.user
    },
    sendCreateGroup(group) {
      group.creator = this.createGroupDialogData.creator
      this.send(group, '/group/create_group')
    },
    beforeFileUpload(file, dataObj, type) {
      const { IMUI } = this.$refs
      const message = {
        id: dataObj.messageId,
        status: 'going',
        type: type,
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
      delete this.messagesToBeSend[res.data.messageId]
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
.text >>> .el-dialog__header {
  display: none;
}
.text >>> .el-dialog__body {
  padding: 0;
}
</style>