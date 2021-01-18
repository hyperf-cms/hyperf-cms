<template>
  <div class="app-wrapper" :class="classObj">
    <el-backtop></el-backtop>
    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
    <sidebar class="sidebar-container"></sidebar>
    <div class="main-container">
      <navbar></navbar>
      <el-tabs type="card" v-model="activeRoute" @tab-click="changeTags" closable @tab-remove="removeTags">
        <el-tab-pane v-for="(item, index) in allViews" :label="item.name" :name="item.path" :key="item.path">
        </el-tab-pane>
      </el-tabs>
      <app-main></app-main>
    </div>
  </div>
</template>
<script>
import { Navbar, Sidebar, AppMain } from './components'
import ResizeMixin from './mixin/ResizeHandler'
import { arrayLookup } from '@/utils/functions'

export default {
  name: 'layout',
  components: {
    Navbar,
    Sidebar,
    AppMain
  },
  data() {
    return {
      menuList: []
    }
  },
  methods: {
    getMenuList() {
      this.menuList = this.$store.getters.menuList;
    },
    changeTags(tab, event) {
      this.getMenuList();

      //更改导航标签时，循环遍历去获取菜单头部标识 用来渲染左侧菜单
      this.$store.commit('SET_CURRENT_MODULE', 'Api:home');
      for (var i = 0; i < this.menuList.length; i++) {
        //循环头部菜单栏中的左侧子菜单栏      
        if (this.menuList[i].child != undefined) {
          for (var j = 0; j < this.menuList[i].child.length; j++) {
            for (var k = 0; k < this.menuList[i].child[j].child.length; k++) {
              if (tab.name == this.menuList[i].child[j].child[k].url) {
                this.$store.commit('SET_CURRENT_MODULE', this.menuList[i].name);
              }
            }
          }
        }
      }
      if (tab.name != this.$route.path) this.$router.push(tab.name)
    },
    removeTags(name) {
      let routeName = arrayLookup(this.allViews, 'path', name, 'routeName')
      name = { 'name': name, 'nowPath': this.$route.path, 'routeName': routeName }
      this.$store.dispatch('removeView', name).then(res => { // 移除tags
      }).catch((err) => {})
    },
    handleClickOutside() {
      this.$store.dispatch('CloseSideBar', { withoutAnimation: false })
    }
  },
  mixins: [ResizeMixin],
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar
    },
    device() {
      return this.$store.state.app.device
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile',
      }
    },
    activeRoute: {
      get() {
        return this.$route.path
      },
      set(val) {

      }
    },
    allViews: {
      get() {
        return this.$store.getters.allViews
      }
    }
  }
}

</script>
<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";

.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;

  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}

.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

</style>
<style>
::-webkit-scrollbar {
  width: 7px;
  height: 7px;
}

::-webkit-scrollbar-thumb {
  background-color: #409EFF;
  border-radius: 10px;
  transition: all .3s ease;
}

::-webkit-scrollbar-thumb:hover {
  background-color: #1E80DA;
  border-radius: 10px;
  cursor: pointer;
}

</style>
