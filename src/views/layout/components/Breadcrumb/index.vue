<template>
  <el-menu :default-active="currentModule" class="el-menu-demo" mode="horizontal" background-color="#fff" text-color="#606266" active-text-color="#303133" style="margin-left: 5px;line-height: 55px;font-size: 15px">
    <el-menu-item v-for="(item, index) in menuHeader" :key="index" :index="item.name" @click="clickMenu(item.name)">
      <svg-icon :icon-class="item.icon"></svg-icon>
      <span slot="title" style="line-height: 55px">{{ item.title }}</span>
    </el-menu-item>
  </el-menu>
</template>
<script>
export default {
  created() {
    this.getMenu()
    this.initCurrentModule()
  },
  data() {
    return {
      menuHeader: [],
      menuList: [],
      currentModule: '',
    }
  },
  watch: {
    '$route' (to, from) {
        this.currentModule = this.$store.state.permission.currentModule
        this.clickMenu(this.$store.state.permission.currentModule)
        this.getMenu()
      },
    currentModule(newValue, oldValue) {
      //TODO 监听store值的变化
      this.clickMenu(newValue);
    },
  },
  methods: {
    getMenu() {
      this.menuHeader = this.$store.state.permission.menuHeader;
      this.menuList = this.$store.state.permission.menuList;
    },
    initCurrentModule() {
      this.currentModule = this.$store.state.permission.currentModule
    },
    clickMenu(item) {
      this.$store.commit('SET_CURRENT_MODULE', item);              
      for (var i = 0; i < this.menuList.length; i++) {
        if (item == this.menuList[i].name) {
          if (this.menuList[i].child == undefined) {
            this.$store.state.permission.menuLeft  = []
            // this.$router.push({ path: this.menuList[i].url });
          } else {
            this.$store.state.permission.menuLeft  = this.menuList[i].child
          }
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
