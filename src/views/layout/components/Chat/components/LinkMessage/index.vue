<template>
  <el-dialog
    title="链接插入"
    :visible.sync="linkMessageDialogData.visible"
    width="600px"
    :close-on-click-modal="true"
    :append-to-body="true"
    :close-on-press-escape="false"
    class="field-dialog"
    @close="closeDialog"
  >
    <el-form :model="form" ref="linkForm">
      <el-form-item label="链接：" label-width="80px">
        <el-input v-model="linkMessageDialogData.content" placeholder="请填写发送链接" autofocus></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="linkMessageDialogData.visible = false">取 消</el-button>
      <el-button type="primary" @click="submit">发 送</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  name: 'linkMessage',
  props: {
    linkMessageDialogData: {
      type: Object,
      default: {},
    },
  },
  components: {},
  data() {
    return {
      form: {},
    }
  },
  mounted() {},

  created() {},
  methods: {
    closeDialog() {
      this.$refs.linkForm.resetFields()
      this.linkMessageDialogData.content = ''
    },
    submit() {
      this.$parent.$parent.sendLinkMessage(this.linkMessageDialogData.content)
    },
  },
}
</script>