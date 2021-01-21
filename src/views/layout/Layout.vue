<template>
  <div class="app-wrapper" :class="classObj">
    <el-backtop></el-backtop>
    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
    <sidebar class="sidebar-container"></sidebar>
    <div class="main-container">
      <navbar></navbar>
      <menu-tag></menu-tag>
      <app-main style=" clear:both;"></app-main>
    </div>
  </div>
</template>
<script>
import { Navbar, Sidebar, AppMain, MenuTag } from './components'
import ResizeMixin from './mixin/ResizeHandler'
import { arrayLookup } from '@/utils/functions'

export default {
  name: 'layout',
  components: {
    Navbar,
    Sidebar,
    AppMain,
    MenuTag,
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
  },
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
@import 'src/styles/mixin.scss';

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
  background-color: #409eff;
  border-radius: 10px;
  transition: all 0.3s ease;
}

::-webkit-scrollbar-thumb:hover {
  background-color: #1e80da;
  border-radius: 10px;
  cursor: pointer;
}
</style>
