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
        width="1050px"
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
        @sendClipboardImage="test"
        :contextmenu="contextmenu"
      >
        <template #message-title="contact">
          <div>
            <div style="line-height:32px">
              <span style="font-size:19px">{{ contact.displayName }}</span>
              <span>
                <el-badge
                  is-dot
                  class="item"
                  type="success"
                  v-if="contact.is_group != 1 && contact.status == 1"
                >(在线)</el-badge>
                <el-badge
                  is-dot
                  class="item"
                  v-if="contact.is_group != 1 && contact.status == 0"
                >(离线)</el-badge>
              </span>
              <span
                class="slot-group-menu"
                style="display:block;float:right"
                v-if="contact.is_group == 1"
              >
                <span @click="handleOpenGroupTool('group_file', contact)">
                  <el-tooltip class="item" effect="dark" content="群文件" placement="top">
                    <svg-icon icon-class="group_file" style="width:1.8em;height:1.8em"></svg-icon>
                  </el-tooltip>
                </span>
                <span @click="handleOpenGroupTool('group_notice', contact)">
                  <el-tooltip class="item" effect="dark" content="群公告" placement="top">
                    <svg-icon icon-class="group_notice" style="width:1.8em;height:1.8em"></svg-icon>
                  </el-tooltip>
                </span>
                <span @click="handleOpenGroupTool('group_album', contact)">
                  <el-tooltip class="item" effect="dark" content="群相册" placement="top">
                    <svg-icon icon-class="group_album" style="width:1.8em;height:1.8em"></svg-icon>
                  </el-tooltip>
                </span>
                <span
                  v-if="contact.level != 2"
                  @click="handleOpenGroupTool('group_invite', contact)"
                >
                  <el-tooltip class="item" effect="dark" content="群邀请" placement="top">
                    <svg-icon icon-class="group_invite" style="width:1.8em;height:1.8em"></svg-icon>
                  </el-tooltip>
                </span>
                <span
                  style="margin-right:10px"
                  @click="handleOpenGroupTool('group_setting', contact)"
                >
                  <el-tooltip class="item" effect="dark" content="群设置" placement="top">
                    <el-dropdown trigger="click" placement="bottom" @command="handleCommand">
                      <span class="el-dropdown-link" style="margin:0;border-bottom:0">
                        <svg-icon icon-class="group_setting" style="width:1.8em;height:1.8em"></svg-icon>
                      </span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item
                          v-if="contact.level == 0"
                          icon="el-icon-notebook-1"
                          :command="composeValue('group_member_manage', contact)"
                        >群成员管理</el-dropdown-item>
                        <el-dropdown-item
                          v-if="contact.level != 2"
                          icon="el-icon-edit"
                          :command="composeValue('group_edit', contact)"
                        >修改群配置</el-dropdown-item>
                        <el-dropdown-item
                          icon="el-icon-circle-close"
                          :command="composeValue('group_exit', contact)"
                        >退出该群</el-dropdown-item>
                        <el-dropdown-item
                          v-if="contact.level == 0"
                          icon="el-icon-delete"
                          :command="composeValue('group_delete', contact)"
                        >解散该群</el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </el-tooltip>
                </span>
              </span>
            </div>
            <div
              style="display: block;height: 1px;width: 100%;;background-color: #DCDFE6;position: relative;margin-top:-10px"
            ></div>
          </div>
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
              src="https://hyperf-cms.oss-cn-guangzhou.aliyuncs.com/chat_cover.png"
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
        <template #message-side="Contact">
          <div class="slot-group" v-if="Contact.is_group">
            <div @click="handleOpenGroupTool('group_notice', Contact)">
              <div class="slot-group-title">群公告</div>
              <el-tooltip class="item" effect="light" placement="right-start" offset="10">
                <div
                  slot="content"
                  class="group-notice"
                  style="font-size:14px"
                  v-html="Contact.introduction"
                ></div>
                <div class="slot-group-notice" v-html="Contact.introduction"></div>
              </el-tooltip>
            </div>
            <div
              class="slot-group-title"
              style="border-top: 1px solid #999;padding-top:10px"
            >群成员({{Contact.member_total}})</div>
            <div class="slot-group-panel" style="height: 449px;overflow: auto;">
              <div
                class="slot-group-member"
                v-for="(item, index) in Contact.group_member"
                :key="index"
              >
                <img
                  :src="item.avatar"
                  alt
                  style="width:30px;height:30px;border-radius:20%;margin-right:3px;ver"
                />
                <span>{{ item.desc}}</span>
                <svg-icon
                  icon-class="lord"
                  style="width:1.8em;height:1.8em;float:right;margin-top:5px"
                  v-if="item.level == 0"
                ></svg-icon>
                <svg-icon
                  icon-class="manager"
                  style="width:1.8em;height:1.8em;float:right;margin-top:5px"
                  v-if="item.level == 1"
                ></svg-icon>
              </div>
            </div>
          </div>
        </template>
      </lemon-imui>
      <history-message ref="historyMessageRef" :historyMessageDialogData="historyMessageDialogData"></history-message>
      <setting ref="settingRef" :settingDialogData="settingDialogData"></setting>
      <create-group ref="createGroupRef" :createGroupDialogData="createGroupDialogData"></create-group>
      <file-upload ref="fileUploadCom" savePath="/chat/file"></file-upload>
      <pic-upload ref="picUploadCom" savePath="/chat/pic"></pic-upload>
      <group-tool ref="groupToolRef" :groupTool="groupTool"></group-tool>
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
import GroupTool from './components/GroupTool'
import CreateGroup from './components/CreateGroup'
import { download, fileByBase64 } from '@/utils/file'
import { uploadPicByBase64 } from '@/api/laboratory/chat_module/upload'

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
    GroupTool,
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
        friendOnlineNotice: this.$store.state.chat.friendOnlineNotice,
        friendOnlineNoticeTone: this.$store.state.chat.friendOnlineNoticeTone,
      },
      createGroupDialogData: {
        visible: false,
        contacts: [],
        creator: [],
        checkedContacts: [],
      },
      groupTool: {
        type: '',
        groupFileDialogVisible: false,
        groupNoticeDialogVisible: false,
        groupAlbumDialogVisible: false,
        groupInviteDialogVisible: false,
        groupMemberManageDialogVisible: false,
        groupEditDialogVisible: false,
        contact: [],
        user: [],
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
      switch (data.event) {
        case 'init':
          this.messageInitEvent(data, IMUI)
          break
        case 'friend_history_message':
          this.messageFriendHistoryEvent(data, IMUI)
          break
        case 'group_history_message':
          this.messageGroupHistoryEvent(data, IMUI)
          break
        case 'friend_withdraw_message':
          this.friendWithdrawMessageEvent(data, IMUI)
          break
        case 'friend_online_message':
          this.friendOnlineMessageEvent(data, IMUI)
          break
        case 'friend_offline_message':
          this.friendOfflineMessageEvent(data, IMUI)
          break
        case 'group_withdraw_message':
          this.groupWithdrawMessageEvent(data, IMUI)
          break
        case 'create_group':
          this.createGroupEvent(data, IMUI)
          break
        case 'edit_group':
          this.editGroupEvent(data, IMUI)
          break
        case 'new_member_join_group':
          this.newMemberJoinGroupEvent(data, IMUI)
          break
        case 'group_member_exit':
          this.groupMemberExitEvent(data, IMUI)
          break
        case 'delete_group_member':
          this.deleteGroupMemberEvent(data, IMUI)
          break
        case 'change_group_member_level':
          this.changeGroupMemberLevel(data, IMUI)
          break
        default:
          this.getSendMessage(data, IMUI)
          break
      }
    },
    messageInitEvent(data, IMUI) {
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
      for (let i = 0; i < data.user_group.length; i++) {
        if (
          data.user_group[i].lastContent != '' &&
          data.user_group[i].lastContentType != ''
        ) {
          data.user_group[i].lastContent = IMUI.lastContentRender({
            type: data.user_group[i].lastContentType,
            content: data.user_group[i].lastContent,
          })
        }
      }
      let contact = data.user_contact.concat(data.user_group)
      //初始化用户
      IMUI.initContacts(contact)
      //自动定位到最新消息
      IMUI.messageViewToBottom()
    },
    messageFriendHistoryEvent(data, IMUI) {
      this.messages = data
      this.next(this.messages.friend_history_message, true)
    },
    messageGroupHistoryEvent(data, IMUI) {
      this.messages = data
      this.next(this.messages.group_history_message, true)
    },
    friendWithdrawMessageEvent(data, IMUI) {
      let message = data.message
      const appendMessag = {
        id: generateRandId(),
        type: 'event',
        content: '"' + message.fromUser.displayName + '" 撤回了一条消息',
        toContactId: message.fromUser.id,
        sendTime: getTime(),
      }
      IMUI.removeMessage(message.id)
      IMUI.appendMessage(appendMessag, true)
    },
    friendOnlineMessageEvent(data, IMUI) {
      //判断是否显示消息通知
      if (this.settingDialogData.friendOnlineNotice) {
        this.$notify.warning({
          title: '你的好友 "' + data.message.user_info.desc + '" 已上线',
          duration: 2000,
          position: 'bottom-right',
          offset: 100,
          message: '来自系统通知',
        })
      }
      //播放收到信息音频
      if (this.settingDialogData.friendOnlineNoticeTone) {
        this.playAudio('friendOnlineTone.mp3')
      }
      IMUI.updateContact({
        id: data.message.uid,
        status: data.message.online_status,
      })
    },
    friendOfflineMessageEvent(data, IMUI) {
      IMUI.updateContact({
        id: data.message.uid,
        status: data.message.online_status,
      })
    },
    createGroupEvent(data, IMUI) {
      let contact = data.message.group_info
      IMUI.appendContact(contact)
    },
    editGroupEvent(data, IMUI) {
      //判断是否是创建组
      let groupInfo = data.message.group_info
      IMUI.updateContact({
        id: data.message.toContactId,
        avatar: groupInfo.avatar,
        displayName: groupInfo.group_name,
        introduction: groupInfo.introduction,
        size: groupInfo.size,
        validation: groupInfo.validation,
      })
      IMUI.appendMessage(data.message, true)
    },
    newMemberJoinGroupEvent(data, IMUI) {
      let contact = data.message.group_info
      IMUI.appendContact(contact)
    },
    groupMemberExitEvent(data, IMUI) {
      IMUI.appendMessage(data.message, true)
      IMUI.updateContact({
        id: data.message.toContactId,
        group_member: data.message.group_member,
        member_total: data.message.member_total,
      })
      if (this.user.id == data.message.uid) {
        IMUI.removeContact(data.message.toContactId)
      }
    },
    deleteGroupMemberEvent(data, IMUI) {
      IMUI.appendMessage(data.message, true)
      IMUI.updateContact({
        id: data.message.toContactId,
        group_member: data.message.group_member,
        member_total: data.message.member_total,
      })
      if (this.user.id == data.message.uid) {
        IMUI.removeContact(data.message.toContactId)
        this.$confirm(
          '你已被移除 "' + data.message.displayName + '" 群聊',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }
        )
      }
    },
    changeGroupMemberLevel(data, IMUI) {
      IMUI.appendMessage(data.message, true)
      IMUI.updateContact({
        id: data.message.toContactId,
        level: data.message.level,
        group_member: data.message.group_member,
        member_total: data.message.member_total,
      })
    },
    getSendMessage(data, IMUI) {
      console.log(data)
      IMUI.appendMessage(data.message, true)
      //判断是否显示消息通知
      if (this.settingDialogData.messagePagePrompt) {
        this.$notify.warning({
          title: '你有一条新的消息',
          duration: 2000,
          position: 'bottom-right',
          offset: 100,
          message: '来自："' + data.message.fromUser.displayName + '"',
        })
      }
      //播放收到信息音频
      if (this.settingDialogData.messageTone) {
        this.playAudio(this.settingDialogData.messageToneType)
      }
      IMUI.messageViewToBottom()
    },
    send: function (message, uri, method = 'GET') {
      let data = {
        message: message,
        uri: uri,
        method: method,
      }
      this.socket.send(JSON.stringify(data))
    },
    close: function () {
      console.log('连接关闭, 正在重连...')
      setTimeout(() => {
        this.socket = new WebSocket(this.path, [this.$store.getters.token])
        this.init(this.socket)
      }, 2000)
    },
    handlePullMessages(contact, next) {
      const that = this
      let uri =
        contact.is_group == 0 ? '/friend/pull_message' : '/group/pull_message'
      let data = {
        message: {
          contact_id: contact.id,
          user_id: this.user.id,
        },
        uri: uri,
      }
      this.socket.send(JSON.stringify(data))
      this.next = next
    },
    handleSend(message, next, file) {
      //执行到next消息会停止转圈，如果接口调用失败，可以修改消息的状态 next({status:'failed'});
      //调用你的消息发送业务接口
      //先判断是否为图片上传，此处主要针对粘贴图片无法重写组件

      if (message.content.indexOf('blob:') != -1) {
        fileByBase64(file, (base64) => {
          let params = {
            savePath: 'chat/group',
            file: base64,
          }
          uploadPicByBase64(params)
            .then((response) => {
              message.content = response.data.url
              let uri =
                typeof message.toContactId == 'number'
                  ? '/friend/send_message'
                  : '/group/send_message'
              this.send(message, uri)
              next()
            })
            .catch(() => {
              next({ status: 'failed' })
            })
        })
      } else {
        let uri =
          typeof message.toContactId == 'number'
            ? '/friend/send_message'
            : '/group/send_message'
        this.send(message, uri)
        next()
      }
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
      this.createGroupDialogData.contacts = instance.contacts.filter(function (
        item
      ) {
        if (item.is_group != 1) return item
      })
      this.createGroupDialogData.creator = instance.user
    },
    handleOpenGroupTool(type, contact) {
      if (type == 'group_file') this.groupTool.groupFileDialogVisible = true
      if (type == 'group_notice') this.groupTool.groupNoticeDialogVisible = true
      if (type == 'group_album') this.groupTool.groupAlbumDialogVisible = true
      if (type == 'group_invite') this.groupTool.groupInviteDialogVisible = true
      if (type == 'group_member_manage')
        this.groupTool.groupMemberManageDialogVisible = true
      if (type == 'group_edit') this.groupTool.groupEditDialogVisible = true
      if (type == 'group_exit') {
        this.$confirm('确认退出该群，操作不可逆, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            let message = {
              group_id: contact.id,
              uid: this.user.id,
            }
            this.send(message, '/group/exit_group', 'POST')
          })
          .catch(() => {})
      }
      if (type == 'group_delete') {
        this.$confirm('确认解散该群，操作不可逆, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            // let message = {
            //   group_id: contact.id,
            //   uid: this.user.id,
            // }
            // this.send(message, '/group/exit_group', 'POST')
            this.msgError('该功能暂未开放，请敬请期待')
          })
          .catch(() => {})
      }
      this.groupTool.contact = contact
      this.groupTool.type = type
      this.groupTool.user = this.user
      this.$refs['groupToolRef'].init()
    },
    composeValue(type, row) {
      return {
        command: type,
        contact: row,
      }
    },
    handleCommand(command) {
      this.handleOpenGroupTool(command.command, command.contact)
    },
    sendEditGroup(group) {
      group.uid = this.user.id
      this.send(group, '/group/edit_group', 'POST')
      this.msgSuccess('修改群公告成功')
    },
    sendCreateGroup(group) {
      group.creator = this.createGroupDialogData.creator
      this.send(group, '/group/create_group', 'POST')
    },
    sendInviteGroupMember(group, newJoinGroupMember) {
      const { IMUI } = this.$refs
      let newGroup = JSON.parse(JSON.stringify(group))
      newGroup.newJoinGroupMember = newJoinGroupMember
      this.send(newGroup, '/group/invite_group_member', 'POST')
    },
    sendDeleteGroupMember(group) {
      this.send(group, '/group/delete_group_member', 'POST')
      this.msgSuccess('删除组员成功')
    },
    sendChangeGroupLevel(group) {
      this.send(group, '/group/change_group_member_level', 'POST')
      this.msgSuccess('更改组员等级成功')
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
        fileExt: '',
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
          fileExt: res.data.fileExt,
          status: 'succeed',
        })
        let messageId = res.data.messageId
        let uri =
          typeof this.messagesToBeSend[messageId].toContactId == 'number'
            ? '/friend/send_message'
            : '/group/send_message'
        this.send(this.messagesToBeSend[messageId], uri)
      }
      delete this.messagesToBeSend[res.data.messageId]
      delete this.fileIdToMessageId[file.uid]
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
<style lang="stylus">
.content a {
  pointer-events: none;
  cursor: pointer;
}

.slot-group {
  width: 200px;
  border-left: 1px solid #ddd;
  height: 100%;
  box-sizing: border-box;
  padding: 10px;

  .slot-search {
    margin: 5px 0;
  }
}

.slot-group-notice {
  color: #999;
  height: 100px;
  overflow: hidden;
  padding: 6px 0;
  font-size: 12px;
  margin-top: -25px;
  line-height: 15px;
}

.slot-group-title {
  font-size: 17px;
  color: #000;
}

.slot-group-member {
  font-size: 12px;
  line-height: 18px;
  margin-bottom: 10px;
}

.slot-group-menu span {
  display: inline-block;
  cursor: pointer;
  color: #888;
  margin: 4px 30px 0 0;
  border-bottom: 2px solid transparent;

  &:hover {
    color: #000;
    border-color: #333;
  }
}

.slot-contact-fixedtop {
  padding: 10px;
  border-bottom: 1px solid #ddd;
}

.slot-search {
  width: 100%;
  box-sizing: border-box;
  font-size: 14px;
  border: 1px solid #bbb;
  padding: 5px 10px;
}
</style>