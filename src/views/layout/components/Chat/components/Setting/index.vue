<template>
  <el-dialog
    title="设置"
    :visible.sync="settingDialogData.visible"
    width="600px"
    :close-on-click-modal="true"
    :append-to-body="true"
    class="field-dialog"
  >
    <el-tabs tab-position="left">
      <el-tab-pane label="通用设置">
        <span style="margin-left:20px; font-size:14px">发送信息：</span>
        <el-radio-group v-model="settingDialogData.sendKey" size="medium">
          <el-radio-button :label="(e) => e.keyCode == 13">Enter</el-radio-button>
          <el-radio-button :label="(e) => e.keyCode == 13 && e.ctrlKey">Enter + Ctrl</el-radio-button>
        </el-radio-group>
        <br />
        <br />
        <span style="margin-left:20px; font-size:14px">主题选择：</span>
        <el-radio-group v-model="settingDialogData.theme" size="medium">
          <el-radio-button label="default"></el-radio-button>
          <el-radio-button label="blue"></el-radio-button>
        </el-radio-group>
        <br />
        <br />
        <span style="margin-left:30px; font-size:14px"></span>
        <el-switch v-model="settingDialogData.avatarCricle" active-text="开启聊天圆形头像(需要刷新)"></el-switch>
        <br />
        <br />
        <span style="margin-left:30px; font-size:14px"></span>
        <el-switch v-model="settingDialogData.hideMessageName" active-text="是否隐藏聊天窗口内的联系人名字"></el-switch>
        <br />
        <br />
        <span style="margin-left:30px; font-size:14px"></span>
        <el-switch v-model="settingDialogData.hideMessageTime" active-text="是否隐藏聊天窗口内的消息发送时间"></el-switch>
      </el-tab-pane>
      <el-tab-pane label="关于IM">
        <span style="margin-left:20px; margin-right:20px;font-size:14px">版本信息：</span>
        <span>1.0.0</span>
        <br />
        <br />
        <span style="margin-left:20px; margin-right:20px;font-size:14px">使用手册：</span>
        <el-button size="medium" @click="clickHelp()">查看手册</el-button>
        <br />
        <br />
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
    return {}
  },
  mounted() {},
  watch: {
    'settingDialogData.sendKey'(val) {
      this.$store.commit('SET_SEND_KEY', val)
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
