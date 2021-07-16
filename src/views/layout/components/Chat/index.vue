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
        @change-menu="handleChangeMenu"
        :contextmenu="contextmenu"
        :contact-contextmenu="contactContextmenu"
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

                <span @click="handleOpenGroupTool('group_setting', contact)">
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
                          v-if="contact.level != 0"
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
                <span style="margin-right:10px" @click="changeDrawer(contact, $refs.IMUI)">
                  <el-tooltip class="item" effect="dark" content="群抽屉" placement="top">
                    <svg-icon icon-class="hamburger" style="width:1.8em;height:1.8em"></svg-icon>
                  </el-tooltip>
                </span>
              </span>
            </div>
            <div
              style="display: block;height: 1px;width: 100%;;background-color: #DCDFE6;position: relative;margin-top:5px"
            ></div>
          </div>
        </template>
        <template #editor-footer>
          <div>
            <span>使用 {{ settingDialogData.sendText }} 快捷发送消息</span>
          </div>
        </template>
        <template #message-after="Message">
          <div v-if="multi" class="multiContact">
            <el-checkbox
              v-if="Message.fromUser.id != user.id"
              :label="Message"
              v-model="multiMessage"
              style="position: absolute; left:-70px"
            ></el-checkbox>
            <el-checkbox
              v-else
              :label="Message"
              v-model="multiMessage"
              style="position: absolute; right:636px"
            ></el-checkbox>
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
              <el-autocomplete
                size="small"
                popper-class="my-autocomplete"
                v-model="filterContact"
                :fetch-suggestions="querySearch"
                placeholder="请输入搜索联系人"
                :popper-append-to-body="false"
                @select="handleSelect"
              >
                <i class="el-input__icon el-icon-search" slot="prefix"></i>
                <template slot-scope="{ item }">
                  <div :title="item.displayName" class="lemon-contact">
                    <span class="lemon-contact__avatar">
                      <span
                        class="lemon-avatar"
                        style="width: 40px; height: 40px; line-height: 40px; font-size: 20px;"
                      >
                        <img :src="item.avatar" />
                      </span>
                    </span>
                    <div class="lemon-contact__inner">
                      <p class="lemon-contact__label">
                        <span class="lemon-contact__name">{{ item.displayName}}</span>
                      </p>
                    </div>
                  </div>
                </template>
              </el-autocomplete>
              <el-dropdown trigger="click" size="small" style="margin-left:10px">
                <span class="el-dropdown-link" style="cursor: pointer;">
                  <i
                    class="el-icon-plus"
                    style="font-size:20px;vertical-align: middle; font-weight:bold"
                  ></i>
                </span>
                <el-dropdown-menu slot="dropdown">
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
              <el-autocomplete
                size="small"
                popper-class="my-autocomplete"
                v-model="filterContact"
                :fetch-suggestions="querySearch"
                placeholder="请输入搜索联系人"
                :popper-append-to-body="false"
                @select="handleSelect"
              >
                <i class="el-input__icon el-icon-search" slot="prefix"></i>
                <template slot-scope="{ item }">
                  <div :title="item.displayName" class="lemon-contact">
                    <span class="lemon-contact__avatar">
                      <span
                        class="lemon-avatar"
                        style="width: 40px; height: 40px; line-height: 40px; font-size: 20px;"
                      >
                        <img :src="item.avatar" />
                      </span>
                    </span>
                    <div class="lemon-contact__inner">
                      <p class="lemon-contact__label">
                        <span class="lemon-contact__name">{{ item.displayName}}</span>
                      </p>
                    </div>
                  </div>
                </template>
              </el-autocomplete>
              <el-dropdown trigger="click" size="small" style="margin-left:10px">
                <span class="el-dropdown-link" style="cursor: pointer;">
                  <i
                    class="el-icon-plus"
                    style="font-size:20px;vertical-align: middle; font-weight:bold"
                  ></i>
                </span>
                <el-dropdown-menu slot="dropdown">
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
      <file-upload ref="fileUploadCom" savePath="chat/file"></file-upload>
      <video-upload ref="videoUploadCom" savePath="chat/video"></video-upload>
      <pic-upload ref="picUploadCom" savePath="chat/pic"></pic-upload>
      <group-tool ref="groupToolRef" :groupTool="groupTool"></group-tool>
      <forward-tool ref="forwardToolRef" :forwardTool="forwardTool"></forward-tool>
      <el-image
        ref="preview"
        :src="imageSrc"
        :fit="fill"
        :preview-src-list="srcList"
        z-index="2050"
      ></el-image>
    </el-dialog>
  </div>
</template>
<script>
import HistoryMessage from './components/HistoryMessage'
import GroupDrawer from './components/GroupDrawer'
import FileUpload from './components/FileUpload'
import VideoUpload from './components/VideoUpload'
import PicUpload from './components/PicUpload'
import Setting from './components/Setting'
import GroupTool from './components/GroupTool'
import CreateGroup from './components/CreateGroup'
import ForwardTool from './components/ForwardTool'
import { download } from '@/utils/file'
import init from './mixin/init'
import message from './mixin/message'
import mounted from './mixin/mounted'

const generateRandId = () => {
  return Math.random().toString(36).substr(-8)
}
const getTime = () => {
  return new Date().getTime()
}
export default {
  name: 'Chat',
  mixins: [init, message, mounted],
  components: {
    HistoryMessage,
    GroupDrawer,
    FileUpload,
    PicUpload,
    VideoUpload,
    Setting,
    CreateGroup,
    GroupTool,
    ForwardTool,
  },
  props: {
    chatDialogData: {
      type: Object,
      default: {},
    },
  },
  watch: {
    multiMessage(val) {
      $('#checkMessage').html('<span>' + val.length + '</span>')
    },
  },
  data() {
    return {
      path: process.env.WS_API,
      IMUI: '',
      filterContact: '',
      user: {},
      messages: [],
      messagesToBeSend: {},
      fileIdToMessageId: {},
      timeer: '',
      next: '',
      imgUrl: '',
      multiMessage: [],
      multi: false,
      historyMessageDialogData: {
        visible: false,
        contact_id: null,
      },
      mulite: false,
      drawerOpen: false,
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
      searchGroupDialogData: {
        visible: false,
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
      forwardTool: {
        dialogVisible: false,
        contact: [],
        contactsSource: [],
        user: [],
        type: '',
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
            return (
              instance.message.fromUser.id == this.user.id &&
              instance.message.sendTime >=
                Date.parse(new Date()) - 2 * 60 * 1000
            )
          },
          text: "<i class='el-icon-s-flag' style='margin-right:10px'></i><span>撤回消息</span>",
        },
        {
          visible: (instance) => {
            return instance.message.type == 'image'
          },
          text: "<i class='el-icon-picture-outline' style='margin-right:10px'></i><span>下载图片</span>",
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
          text: "<i class='el-icon-download' style='margin-right:10px'></i><span>下载文件</span>",
        },
        {
          click: (e, instance, hide) => {
            const { IMUI, message } = instance
            IMUI.removeMessage(message.id)
            hide()
          },
          color: '#606266',
          text: "<i class='el-icon-delete' style='margin-right:10px'></i><span>删除</span>",
        },
        {
          click: (e, instance, hide) => {
            const { IMUI, message } = instance
            this.oneByoneForward(message)
            hide()
          },
          color: '#606266',
          text: "<i class='el-icon-s-promotion' style='margin-right:10px'></i><span>转发</span>",
        },
        {
          click: (e, instance, hide) => {
            const { IMUI, message } = instance
            hide()
          },
          color: '#606266',
          text: "<i class='el-icon-connection' style='margin-right:10px'></i><span>引用</span>",
        },
        {
          click: (e, instance, hide) => {
            const { IMUI, message } = instance
            $('.lemon-editor')
              .find('*')
              .each(function (i, o) {
                if ($(o).hasClass('lemon-editor__tool')) $(this).hide()
                if ($(o).hasClass('lemon-editor__inner')) $(this).hide()
                if ($(o).hasClass('lemon-editor__footer')) $(this).hide()
                if ($(o).hasClass('multi')) $(this).show()
              })

            $('.lemon-container')
              .find('*')
              .each(function (i, o) {
                if (
                  $(o).hasClass('lemon-message-text') ||
                  $(o).hasClass('lemon-message-file') ||
                  $(o).hasClass('lemon-message-image') ||
                  $(o).hasClass('lemon-message-forward') ||
                  $(o).hasClass('lemon-message-video')
                ) {
                  $(this).css('border', '1px dashed #409EFF')
                  $(this).css('margin-top', '5px')
                }
              })
            $('.lemon-container')
              .find('*')
              .each(function (i, o) {
                if (
                  ($(o).hasClass('lemon-message-text') ||
                    $(o).hasClass('lemon-message-file') ||
                    $(o).hasClass('lemon-message-image') ||
                    $(o).hasClass('lemon-message-forward') ||
                    $(o).hasClass('lemon-message-video')) &&
                  !$(o).hasClass('lemon-message--reverse')
                ) {
                  $(this).css('padding-left', '30px')
                }
              })
            this.multi = true
            hide()
          },
          color: '#606266',
          text: "<i class='el-icon-finished' style='margin-right:10px'></i><span>多选</span>",
        },
      ],
      contactContextmenu: [
        {
          text: "<i class='el-icon-chat-line-round' style='margin-right:10px'></i><span>好友信息</span>",
          click: (e, instance, hide) => {
            const { IMUI, contact } = instance
            IMUI.updateContact({
              id: contact.id,
              lastContent: null,
            })
            hide()
          },
          visible: (instance) => {
            return instance.contact.is_group == 0
          },
        },
        {
          text: "<i class='el-icon-edit' style='margin-right:10px'></i><span>修改备注</span>",
          click: (e, instance, hide) => {
            const { IMUI, contact } = instance
            IMUI.updateContact({
              id: contact.id,
              lastContent: null,
            })
            hide()
          },
          visible: (instance) => {
            return instance.contact.is_group == 0
          },
        },
        {
          text: "<i class='el-icon-upload2' style='margin-right:10px'></i><span>会话置顶</span>",
          click: (e, instance, hide) => {
            const { IMUI, contact } = instance
            IMUI.updateContact({
              id: contact.id,
              lastContent: null,
            })
            hide()
          },
        },
        {
          text: "<i class='el-icon-close-notification' style='margin-right:10px'></i><span>消息免打扰</span>",
          click: (e, instance, hide) => {
            const { IMUI, contact } = instance
            IMUI.updateContact({
              id: contact.id,
              lastContent: null,
            })
            hide()
          },
        },
        {
          text: " <el-divider></el-divider><i class='el-icon-circle-close' style='color:#F56C6C' ><span style='padding-left:10px;'>退出群聊</span></i>",
          click: (e, instance, hide) => {
            const { IMUI, contact } = instance
            IMUI.updateContact({
              id: contact.id,
              lastContent: null,
            })
            hide()
          },
          visible: (instance) => {
            return (
              instance.contact.is_group == 1 &&
              instance.contact.uid != this.user.id
            )
          },
        },
      ],
      friend_group: [],
    }
  },
  created() {},
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.chatMain
  ::v-deep
  .el-autocomplete-suggestion
  .el-autocomplete-suggestion__list
  li {
  padding: 0px;
}
.chatMain
  ::v-deep
  .el-autocomplete-suggestion
  .el-autocomplete-suggestion__wrap {
  margin-right: 0px;
}
.chatMain ::v-deep .lemon-editor__emoji-item {
  cursor: pointer;
  width: 30px;
  padding: 4px;
  border-radius: 4px;
}
.chatMain ::v-deep .lemon-message-text .lemon-message__content img {
  width: 22px;
  height: 18px;
  display: inline-block;
  background: transparent;
  position: relative;
  top: -1px;
  padding: 0 2px;
  vertical-align: middle;
}
.chatMain ::v-deep .lemon-wrapper--theme-blue .lemon-menu {
  background-color: #409eff;
}
.chatMain ::v-deep .search-icon {
  cursor: pointer;
  font-size: 17px;
  vertical-align: middle;
}
.text ::v-deep .el-dialog__header {
  display: none;
}
.text ::v-deep .el-dialog__body {
  padding: 0;
  height: 0;
}
.chatMain ::v-deep .multi-select {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  border-top: 1px solid #f5f5f5;
}
.chatMain ::v-deep .multi-select .multi-main {
  margin-top: 10px;
}
.chatMain ::v-deep .multi-select .multi-title {
  width: 100%;
  height: 50px;
  line-height: 50px;
  text-align: center;
  color: #878484;
  font-weight: 300;
  font-size: 14px;
  margin-bottom: 10px;
}
.chatMain ::v-deep .multi-select .multi-main .btn-group {
  display: inline-block;
  width: 70px;
  height: 70px;
  margin-right: 15px;
}

.chatMain ::v-deep .multi-select .multi-main .btn-group .multi-icon {
  width: 60px;
  height: 60px;
  font-size: 19px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
  border-radius: 50%;
  margin: 0 auto;
  border: 1px solid transparent;
  cursor: pointer;
}
.chatMain ::v-deep .multi-select .multi-main .btn-group .multi-icon:hover {
  color: red;
  border: 1px solid red;
  font-size: 20px;
}
.chatMain ::v-deep .multi-select .multi-main .btn-group p {
  font-size: 12px;
  margin-top: 8px;
  text-align: center;
}

.chatMain .multiContact ::v-deep .el-checkbox__label {
  display: none;
}

.chatMain .multiContact ::v-deep .el-checkbox__label {
  display: none;
}

.chatMain ::v-deep .el-image__preview {
  display: none;
}

.chatMain ::v-deep .el-image__error {
  display: none;
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
  line-height: 15px;
}

.slot-group-title {
  font-size: 14px;
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