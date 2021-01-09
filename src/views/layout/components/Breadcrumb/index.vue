<template>
  <el-menu :default-active="currentModule" class="el-menu-demo" mode="horizontal"  background-color="#fff" text-color="#606266" active-text-color="#303133" style="margin-left: 5px;line-height: 55px;font-size: 15px" >
     <el-menu-item  v-for="(item, index) in menuHeader" :key="index" :index="item.name" @click="clickMenu(item.name)">
       <svg-icon :icon-class="item.icon" ></svg-icon>
      <span slot="title" style="line-height: 55px">{{ item.title }}</span>
    </el-menu-item>
  </el-menu>
</template>
<script>
export default {
  created() {
    this.getMenuHeader()
    this.initCurrentModule()
  },
  data() {
    return {
      menuHeader: [],
      currentModule: '',
    }
  },
  watch: {
    $route() {
      this.getMenuHeader()
    },
    currentModule(newVal, oldVal) {
      this.clickMenu(newVal)
    },
  },
  methods: {
    initCurrentModule() {
      this.currentModule = this.$store.state.permission.currentModule;
    },
    getMenuHeader() {
      this.menuHeader = this.$store.getters.menuHeader;
    },
    clickMenu(item) {
      const menuList = this.$store.state.user.menuList
       for (var i = 0; i < menuList.length; i++) {
          if (item == menuList[i].name) {
            this.$store.state.permission.routers = menuList[i].child
          }
        }
    }
  }
}

</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.el-menu-demo {
  display: inline-block;
  font-size: 14px;
  line-height: 60px;
  margin-left: 10px;

  .no-redirect {
    color: #97a8be;
    cursor: text;
  }
}

</style>
