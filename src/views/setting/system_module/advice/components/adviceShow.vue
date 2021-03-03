<template>
  <el-dialog title="详细内容" :visible.sync="adviceShowDialogData.adviceShowDialogVisible">
    <el-card class="box-card" shadow="never">
      <h3 v-html="adviceShowDialogData.adviceShowData.title"></h3>
      <div v-html="adviceShowDialogData.adviceShowData.content" class="box-content"></div>
    </el-card>
    <el-card
      class="box-card reply-box"
      shadow="never"
      v-if="adviceShowDialogData.adviceShowData.reply"
    >
      <h3>管理员回复：</h3>
      <div v-html="adviceShowDialogData.adviceShowData.reply" class="box-content"></div>
    </el-card>
  </el-dialog>
</template>
<script>
export default {
  name: 'AdviceShow',
  components: {},
  props: {
    adviceShowDialogData: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {}
  },
  created() {},
  methods: {},
}
</script>

<style>
</style>
