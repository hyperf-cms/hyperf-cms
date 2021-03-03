<template>
  <el-dialog title="详细内容" :visible.sync="noticeShowDialogData.noticeShowDialogVisible">
    <el-card class="box-card" shadow="never">
      <h3 v-html="noticeShowDialogData.noticeShowData.title"></h3>
      <div v-html="noticeShowDialogData.noticeShowData.content" class="box-content"></div>
    </el-card>
  </el-dialog>
</template>
<script>
export default {
  name: 'NoticeShow',
  components: {},
  props: {
    noticeShowDialogData: {
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
