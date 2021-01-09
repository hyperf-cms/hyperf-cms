<template>
  <div class="navbar">
    <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container" :toggleClick="toggleSideBar" />
    <breadcrumb class="breadcrumb-container" />
    <div class="right-menu">
      <template v-if="device!=='mobile'">
        <screenfull id="screenfull" class="right-menu-item hover-effect" style="height: 55px" />
        <search id="header-search" class="right-menu-item" />
        <theme class="right-menu-item hover-effect" style="height: 42px" />
      </template>
      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
        <div class="avatar-wrapper">
          <img class="user-avatar" :src="avatar">
          <i class="el-icon-caret-bottom"></i>
        </div>
        <el-dropdown-menu class="user-dropdown" slot="dropdown">
          <el-dropdown-item>
            <span @click="personal" style="display:block;">个人中心</span>
          </el-dropdown-item>
          <el-dropdown-item divided>
            <span @click="advice" style="display:block;">系统建议</span>
          </el-dropdown-item>
          <el-dropdown-item divided>
            <span @click="logout" style="display:block;">退出登录</span>
          </el-dropdown-item>
          <el-dropdown-item divided v-if="device==='mobile'">
            <game-select class="right-menu-item hover-effect" style="height: 52px" />
          </el-dropdown-item>
          <el-dropdown-item divided v-if="device==='mobile'">
            <config-create type="update" class="right-menu-item hover-effect" style="height: 47px" />
          </el-dropdown-item>
          <el-dropdown-item divided v-if="device==='mobile'">
            <screenfull id="screenfull" class="right-menu-item hover-effect" style="height: 47px" />
          </el-dropdown-item>
          <el-dropdown-item divided v-if="device==='mobile'">
            <theme class="right-menu-item hover-effect" style="height: 42px" />
          </el-dropdown-item>
          <el-dropdown-item divided v-if="device==='mobile'">
            <search id="header-search" class="right-menu-item" />
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div class="notice-text">{{this.noticeText}}</div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import Breadcrumb from './Breadcrumb'
import Hamburger from './Hamburger'
import Search from './HeaderSearch'
import Screenfull from './Screenfull'
import Theme from './Theme'

export default {
  components: {
    Breadcrumb,
    Hamburger,
    Search,
    Screenfull,
    Theme,
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
    ]),
    device() {
      return this.$store.state.app.device
    },
  },
  data() {
    return {
      personalDialogVisible: false,
      noticeText: '',
    }
  },
  created() {
    
  },
  methods: {
    toggleSideBar() { // 侧边栏的展开与收起
      this.$store.dispatch('ToggleSideBar')

      if (this.device == 'mobile') {
        let isOpen = this.sidebar.opened;
        if (isOpen) {
          document.body.style.overflow = 'hidden';
        } else {
          document.body.style.overflow = '';
        }
      }
    },
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        location.reload() // 为了重新实例化vue-router对象 避免bug
      })
    },
    getDownloadUrl() {
      this.$alert(this.$store.getters.downLoadUrl, '下载地址', {
        confirmButtonText: '确定',
      });
    },
    handleCopy(text, event) {
      clip(text, event)
    },
    isMobile() { // 判断是否移动端
      let flag = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)
      return flag;
    },
    personal() {
      this.$router.push({ path: '/setting/auth/user/personal_update', query: { id: this.$store.state.user.userId } });
    },
    advice() {
      this.$router.push({ path: '/setting/system/advice' });
    },
  }
}

</script>
<style lang="scss" scoped>
.navbar {
  height: 60px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, .08);

  .hamburger-container {
    line-height: 60px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 60px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 10px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}

</style>
