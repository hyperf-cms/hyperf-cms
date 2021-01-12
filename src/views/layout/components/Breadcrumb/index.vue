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
    this.getMenuHeader()
    this.initCurrentModule()
  },
  data() {
    return {
      menuHeader: [],
      currentModule: '',
    }
  },
  // computed: {
  //   currentModule() {
  //     return this.$store.state.permission.currentModule; //需要监听的数据
  //   }
  // },
  watch: {
    $route() {
      this.getMenuHeader()
    },
    '$store.state.permission': {
      deep:true,//深度监听设置为 true
      handler:function(newVal){
        console.log(123)
        this.currentModule = newVal.currentModule
      }
    },
    currentModule(newValue, oldValue) {
      //TODO 监听store值的变化
      this.clickMenu(newValue);
    },
  },
  methods: {
    getMenuHeader() {
      this.menuHeader = this.$store.getters.menuHeader;
    },
    initCurrentModule() {
      this.currentModule = this.$store.getters.currentModule
    },
    clickMenu(item) {
      this.$store.commit('SET_CURRENT_MODULE', item);                    
      const menuList = this.$store.state.user.menuList
      for (var i = 0; i < menuList.length; i++) {
        if (item == menuList[i].name) {
          if (menuList[i].child == undefined) {
            this.$store.state.permission.routers = [];
            this.$router.push({ path: menuList[i].url });
          } else {
            this.$store.state.permission.routers = menuList[i].child
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
