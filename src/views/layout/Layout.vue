<template>
  <div class="app-wrapper" :class="classObj">
    <el-backtop></el-backtop>
    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
    <sidebar class="sidebar-container"></sidebar>
    <div class="main-container">
      <navbar></navbar>
      <menu-tag style="margin-left:2px"></menu-tag>
      <app-main style=" clear:both;"></app-main>
      <div class="chat">
        <el-badge :value="12" class="item">
          <el-button
            icon="el-icon-chat-dot-square"
            type="primary"
            size="medium"
            @click="dialogVisible = true"
          >我的聊天</el-button>
        </el-badge>
      </div>
    </div>
    <el-dialog
      class="text"
      :visible.sync="dialogVisible"
      width="1000px"
      :before-close="handleClose"
      :center="true"
      :close-on-press-escape="true"
      :show-close="false"
      :close-on-click-modal="false"
      :modal-append-to-body="true"
    >
      <chat></chat>
    </el-dialog>
  </div>
</template>
<script>
import { Navbar, Sidebar, AppMain, MenuTag, Chat } from './components'
import ResizeMixin from './mixin/ResizeHandler'

export default {
  name: 'layout',
  components: {
    Navbar,
    Sidebar,
    AppMain,
    MenuTag,
    Chat,
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
  data() {
    return {
      dialogVisible: false,
    }
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

.chat {
  position: fixed;
  right: 30px;
  bottom: 0px;
  background-color: #fff;
  cursor: pointer;
  z-index: 10;
}
.text >>> .el-dialog__header {
  display: none;
}
.text >>> .el-dialog__body {
  padding: 0;
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
