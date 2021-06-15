<template>
  <div>
    <el-tooltip
      class="item"
      effect="dark"
      content="项目链接"
      placement="top-start"
      style="margin-right:15px"
    >
      <svg-icon icon-class="github" @click="clickGithub" />
    </el-tooltip>
    <el-tooltip class="item" effect="dark" content="文档地址" placement="top-start">
      <svg-icon icon-class="link" @click="clickDoc" />
    </el-tooltip>
  </div>
</template>
<script>
export default {
  name: 'ProjectLink',
  data() {
    return {
      githubUrl: 'https://github.com/hyperf-cms',
      docUrl: 'http://hyperfwiki.linyiyuan.top/#/',
    }
  },
  methods: {
    clickGithub() {
      window.open(this.githubUrl)
    },
    clickDoc() {
      window.open(this.docUrl)
    },
  },
}
</script>
<style scoped>
.item {
  cursor: pointer;
}
</style>
