<template>
  <el-menu :default-active="activeIndex2" class="el-menu-demo" mode="horizontal" @select="handleSelect" background-color="#fff" text-color="#606266" active-text-color="#303133" style="margin-left: 10px;line-height: 55px;font-size: 15px" >
     <el-menu-item  v-for="(item, index) in menuHeader" :key="index" :index="item.sort">
       <svg-icon :icon-class="item.icon" ></svg-icon>
      <span slot="title" style="line-height: 55px">{{ item.title }}</span>
    </el-menu-item>
  </el-menu>
</template>
<script>
export default {
  created() {
    this.getMenuHeader()
  },
  data() {
    return {
      menuHeader: []
    }
  },
  watch: {
    $route() {
      this.getMenuHeader()
    }
  },
  methods: {
    getMenuHeader() {
      this.menuHeader = this.$store.getters.menuHeader;
      console.log(this.menuHeader)
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
