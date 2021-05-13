<template>
  <el-dialog
    :title="groupTool.contact.displayName"
    :visible.sync="groupTool.groupNoticeDialogVisible"
    width="30%"
    append-to-body
  >
    <div style="font-size:18px" v-html="groupTool.contact.introduction"></div>
  </el-dialog>
</template>
<script>
export default {
  name: 'GroupNotice',
  components: {},
  props: {
    groupTool: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {}
  },
  mounted() {},
  watch: {
    'listQuery.date'(val) {
      this.getList()
    },
    'listQuery.file_name'(val) {
      this.getList()
    },
  },
  created() {},
  methods: {
    init() {},
  },
}
</script>
<style lang="scss" scoped>
.icon {
  width: 1.8em;
  height: 1.8em;
  cursor: pointer;
  &:hover {
    color: #000;
    border-color: #333;
  }
}
</style>
 