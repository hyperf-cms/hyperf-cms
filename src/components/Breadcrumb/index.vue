<template>
  <el-menu :default-active="currentModule" class="el-menu-demo" mode="horizontal" @select="handleSelect" background-color="#fff" text-color="#606266" active-text-color="#303133" style="margin-left: 5px;line-height: 55px;font-size: 15px" >
     <el-menu-item  v-for="(item, index) in menuHeader" :key="index" :index="item.name" @click="clickMenu(item)">
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
      menuHeader: [],
    }
  },
  watch: {
    $route() {
      this.getMenuHeader()
    },
  },
  computed: {
    currentModule() {
      return this.$store.state.user.currentModule;
    }
  },
  methods: {
    getMenuHeader() {
      this.menuHeader = this.$store.getters.menuHeader;
    },
    clickMenu(item) {
      this.$store.state.user.currentModule = item.name
      const menuList = this.$store.state.user.menuList
       for (var i = 0; i < menuList.length; i++) {
          if (item.name == menuList[i].name) {
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
