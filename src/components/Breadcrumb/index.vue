<template>
  <el-menu :default-active="activeIndex2" class="el-menu-demo" mode="horizontal" @select="handleSelect" background-color="#fff" text-color="#606266" active-text-color="#303133" style="margin-left: 10px;line-height: 55px;font-size: 15px">
    <el-menu-item index="1">
    <svg-icon icon-class="home"></svg-icon>
      <span slot="title" style="line-height: 55px;font-size: 14px">仪表盘</span>
    </el-menu-item>
     <el-menu-item index="2">
       <svg-icon icon-class="set_up" ></svg-icon>
      <span slot="title" style="line-height: 55px">设置模块</span>
    </el-menu-item>
  </el-menu>
</template>
<script>
export default {
  created() {
    this.getBreadcrumb()
  },
  data() {
    return {
      levelList: null
    }
  },
  watch: {
    $route() {
      this.getBreadcrumb()
    }
  },
  methods: {
    getBreadcrumb() {
      let matched = this.$route.matched.filter(item => item.name)
      const first = matched[0]
      if (first && first.name !== 'home') {
        matched = [{ path: '/home', meta: { title: 'Ê×Ò³' } }].concat(matched)
      }
      this.levelList = matched
    }
  }
}

</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.el-menu-demo {
  display: inline-block;
  font-size: 14px;
  line-height: 55px;
  margin-left: 10px;

  .no-redirect {
    color: #97a8be;
    cursor: text;
  }
}

</style>
