<template>
  <el-dialog
    title="设置"
    :visible.sync="settingDialogData.visible"
    width="650px"
    :close-on-click-modal="true"
    :append-to-body="true"
    class="field-dialog"
  >
    <el-tabs tab-position="left" style="height:350px">
      <el-tab-pane label="通用设置">
        <div style="margin-bottom:20px">
          <span style="margin-left:20px; font-size:14px">发送信息：</span>
          <el-radio-group v-model="settingDialogData.sendText" size="medium">
            <el-radio-button label="Enter">Enter</el-radio-button>
            <el-radio-button label="Enter+Ctrl">Enter + Ctrl</el-radio-button>
          </el-radio-group>
        </div>
        <div style="margin-bottom:20px">
          <span style="margin-left:20px; font-size:14px">主题选择：</span>
          <el-radio-group v-model="settingDialogData.theme" size="medium">
            <el-radio-button label="default"></el-radio-button>
            <el-radio-button label="blue"></el-radio-button>
          </el-radio-group>
        </div>
        <div style="margin-bottom:20px">
          <span style="margin-left:30px; font-size:14px"></span>
          <el-switch v-model="settingDialogData.avatarCricle" active-text="开启聊天圆形头像(需要刷新)"></el-switch>
        </div>
        <div style="margin-bottom:20px">
          <span style="margin-left:30px; font-size:14px"></span>
          <el-switch v-model="settingDialogData.hideMessageName" active-text="是否隐藏聊天窗口内的联系人名字"></el-switch>
        </div>
        <div style="margin-bottom:20px">
          <span style="margin-left:30px; font-size:14px"></span>
          <el-switch v-model="settingDialogData.hideMessageTime" active-text="是否隐藏聊天窗口内的消息发送时间"></el-switch>
        </div>
      </el-tab-pane>
      <el-tab-pane label="消息提醒">
        <div style="margin-bottom:20px">
          <span style="margin-left:30px; font-size:14px"></span>
          <el-switch v-model="settingDialogData.friendOnlineNotice" active-text="开启用户上线通知"></el-switch>
        </div>
        <div style="margin-bottom:20px">
          <span style="margin-left:30px; font-size:14px"></span>
          <el-switch v-model="settingDialogData.friendOnlineNoticeTone" active-text="开启用户上线通知提示音"></el-switch>
        </div>
        <div style="margin-bottom:20px">
          <span style="margin-left:30px; font-size:14px"></span>
          <el-switch v-model="settingDialogData.messagePagePrompt" active-text="开启新消息页面提示"></el-switch>
        </div>
        <div style="margin-bottom:20px">
          <span style="margin-left:30px; font-size:14px"></span>
          <el-switch v-model="settingDialogData.messageTone" active-text="开启新消息提示音"></el-switch>
        </div>
        <div style="margin-bottom:20px">
          <span style="margin-left:20px; font-size:14px">声音选择：</span>
          <el-select
            v-model="settingDialogData.messageToneType"
            placeholder="请选择消息提示音"
            @change="playAudio(settingDialogData.messageToneType)"
          >
            <el-option
              v-for="item in messageToneTypeOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
      </el-tab-pane>
      <el-tab-pane label="关于IM">
        <div style="margin-bottom:20px">
          <span style="margin-left:20px; margin-right:20px;font-size:14px">版本信息：</span>
          <span>1.0.0</span>
        </div>
        <div style="margin-bottom:20px">
          <span style="margin-left:20px; margin-right:20px;font-size:14px">使用手册：</span>
          <el-button size="medium" @click="clickHelp()">查看手册</el-button>
        </div>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>
<script>
export default {
  name: 'Setting',
  props: {
    settingDialogData: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      messageToneTypeOption: [
        { label: '提示音1', value: 'messageTone1.mp3' },
        { label: '提示音2', value: 'messageTone2.mp3' },
        { label: '提示音3', value: 'messageTone3.mp3' },
        { label: '提示音4', value: 'messageTone4.mp3' },
        { label: '提示音5', value: 'messageTone5.mp3' },
        { label: '提示音6', value: 'messageTone6.mp3' },
        { label: '提示音7', value: 'messageTone7.mp3' },
        { label: '提示音8', value: 'messageTone8.mp3' },
        { label: '提示音9', value: 'messageTone9.mp3' },
        { label: '提示音10', value: 'messageTone10.mp3' },
      ],
    }
  },
  mounted() {},
  watch: {
    'settingDialogData.sendText'(val) {
      this.$store.commit('SET_SEND_TEXT', val)
    },
    'settingDialogData.theme'(val) {
      this.$store.commit('SET_LEMON_THEME', val)
    },
    'settingDialogData.avatarCricle'(val) {
      this.$store.commit('SET_AVATAR_CRICLE', val)
    },
    'settingDialogData.hideMessageName'(val) {
      this.$store.commit('SET_HIDE_MESSAGE_NAME', val)
    },
    'settingDialogData.hideMessageTime'(val) {
      this.$store.commit('SET_HIDE_MESSAGE_TIME', val)
    },
    'settingDialogData.friendOnlineNotice'(val) {
      this.$store.commit('SET_FRIEND_ONLINE_NOTICE', val)
    },
    'settingDialogData.friendOnlineNoticeTone'(val) {
      this.$store.commit('SET_FRIEND_ONLINE_NOTICE_TONE', val)
    },
    'settingDialogData.messagePagePrompt'(val) {
      this.$store.commit('SET_MESSAGE_PAGE_PROMPT', val)
    },
    'settingDialogData.messageTone'(val) {
      this.$store.commit('SET_MESSAGE_TONE', val)
    },
    'settingDialogData.messageToneType'(val) {
      this.$store.commit('SET_MESSAGE_TONE_TYPE', val)
    },
  },
  created() {},
  methods: {
    init() {},
    clickHelp() {
      location.href = 'http://june000.gitee.io/lemon-im/'
    },
  },
}
</script>


<style lang="scss" scoped>
</style>
