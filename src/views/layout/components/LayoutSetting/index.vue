<template>
  <div>
    <el-tooltip class="item" effect="dark" content="布局" placement="top-start">
      <svg-icon icon-class="layout" @click="drawer = true" />
    </el-tooltip>

    <el-drawer :visible.sync="drawer" direction="rtl" size="15%" :with-header="false">
      <div class="drawer-container">
        <div>
          <div class="setting-drawer-content">
            <div class="setting-drawer-title">
              <h3 class="drawer-title">主题风格设置</h3>
            </div>
            <div class="setting-drawer-block-checbox">
              <div class="setting-drawer-block-checbox-item" @click="handleTheme('theme-dark')">
                <img src="@/assets/images/dark.svg" alt="dark" />
                <div
                  v-if="sideTheme === 'theme-dark'"
                  class="setting-drawer-block-checbox-selectIcon"
                  style="display: block;"
                >
                  <i aria-label="图标: check" class="anticon anticon-check">
                    <svg
                      viewBox="64 64 896 896"
                      data-icon="check"
                      width="1em"
                      height="1em"
                      :fill="theme"
                      aria-hidden="true"
                      focusable="false"
                      class
                    >
                      <path
                        d="M912 190h-69.9c-9.8 0-19.1 4.5-25.1 12.2L404.7 724.5 207 474a32 32 0 0 0-25.1-12.2H112c-6.7 0-10.4 7.7-6.3 12.9l273.9 347c12.8 16.2 37.4 16.2 50.3 0l488.4-618.9c4.1-5.1.4-12.8-6.3-12.8z"
                      />
                    </svg>
                  </i>
                </div>
              </div>
              <div class="setting-drawer-block-checbox-item" @click="handleTheme('theme-light')">
                <img src="@/assets/images/light.svg" alt="light" />
                <div
                  v-if="sideTheme === 'theme-light'"
                  class="setting-drawer-block-checbox-selectIcon"
                  style="display: block;"
                >
                  <i aria-label="图标: check" class="anticon anticon-check">
                    <svg
                      viewBox="64 64 896 896"
                      data-icon="check"
                      width="1em"
                      height="1em"
                      :fill="theme"
                      aria-hidden="true"
                      focusable="false"
                      class
                    >
                      <path
                        d="M912 190h-69.9c-9.8 0-19.1 4.5-25.1 12.2L404.7 724.5 207 474a32 32 0 0 0-25.1-12.2H112c-6.7 0-10.4 7.7-6.3 12.9l273.9 347c12.8 16.2 37.4 16.2 50.3 0l488.4-618.9c4.1-5.1.4-12.8-6.3-12.8z"
                      />
                    </svg>
                  </i>
                </div>
              </div>
            </div>

            <div class="drawer-item">
              <span>
                主题颜色
                <theme />
              </span>
            </div>
          </div>

          <el-divider />

          <h3 class="drawer-title">系统布局配置</h3>

          <div class="drawer-item">
            <span>开启 TopNav</span>
            <el-switch v-model="topNav" class="drawer-switch" />
          </div>

          <div class="drawer-item">
            <span>开启 Tags-Views</span>
            <el-switch v-model="tagsView" class="drawer-switch" />
          </div>

          <div class="drawer-item">
            <span>固定 Header</span>
            <el-switch v-model="fixedHeader" class="drawer-switch" />
          </div>

          <div class="drawer-item">
            <span>显示 Logo</span>
            <el-switch v-model="sidebarLogo" class="drawer-switch" />
          </div>

          <div class="drawer-item">
            <span>动态标题</span>
            <el-switch v-model="dynamicTitle" class="drawer-switch" />
          </div>

          <el-divider />

          <el-button
            size="small"
            type="primary"
            plain
            icon="el-icon-document-add"
            @click="saveSetting"
          >保存配置</el-button>
          <el-button size="small" plain icon="el-icon-refresh" @click="resetSetting">重置配置</el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>
<script>
import Theme from '../Theme'
export default {
  components: {
    Theme,
  },
  name: 'LayoutSetting',
  data() {
    return {
      drawer: false,
      sideTheme: this.$store.state.setting.menuColor,
    }
  },
  computed: {
    fixedHeader: {
      get() {
        return this.$store.state.setting.fixedHeader
      },
      set(val) {
        this.$store.commit('SET_FIXED_HEADER', val)
      },
    },
    topNav: {
      get() {
        return this.$store.state.setting.topNav
      },
      set(val) {
        this.$store.commit('SET_TOP_NAV', val)
        if (!val) {
          this.$store.commit(
            'SET_SIDEBAR_ROUTERS',
            this.$store.state.permission.defaultRoutes
          )
        }
      },
    },
    tagsView: {
      get() {
        return this.$store.state.setting.tagsView
      },
      set(val) {
        this.$store.commit('SET_TAGS_VIEW', val)
      },
    },
    sidebarLogo: {
      get() {
        return this.$store.state.setting.sidebarLogo
      },
      set(val) {
        this.$store.commit('SET_SIDEBAR_LOGO', val)
      },
    },
    dynamicTitle: {
      get() {
        return this.$store.state.setting.dynamicTitle
      },
      set(val) {
        this.$store.commit('SET_DYNAMIC_TITLE', val)
      },
    },
  },
  methods: {
    handleTheme(val) {
      this.$store.commit('SET_MENU_COLOR', val)
      this.sideTheme = val
    },
    saveSetting() {
      const loading = this.$loading({
        lock: true,
        fullscreen: false,
        text: '正在保存到本地，请稍后...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)',
      })
      localStorage.setItem(
        'layout-setting',
        `{
            "topNav":${this.topNav},
            "tagsView":${this.tagsView},
            "fixedHeader":${this.fixedHeader},
            "sidebarLogo":${this.sidebarLogo},
            "dynamicTitle":${this.dynamicTitle},
          }`
      )
      setTimeout(loading.close(), 1000)
    },
    resetSetting() {
      this.$loading({
        lock: true,
        fullscreen: false,
        text: '正在清除设置缓存并刷新，请稍后...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)',
      })
      localStorage.removeItem('layout-setting')
      setTimeout('window.location.reload()', 1000)
    },
  },
}
</script>
<style lang="scss" scoped>
.item {
  display: inline-block;
  cursor: pointer;
  fill: #5a5e66;
  width: 20px;
  height: 20px;
  vertical-align: 15px;
}
.setting-drawer-content {
  .setting-drawer-title {
    margin-bottom: 12px;
    color: rgba(0, 0, 0, 0.85);
    font-size: 14px;
    line-height: 22px;
    font-weight: bold;
  }

  .setting-drawer-block-checbox {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-top: 10px;
    margin-bottom: 20px;

    .setting-drawer-block-checbox-item {
      position: relative;
      margin-right: 16px;
      border-radius: 2px;
      cursor: pointer;

      img {
        width: 48px;
        height: 48px;
      }

      .setting-drawer-block-checbox-selectIcon {
        position: absolute;
        top: 0;
        right: 0;
        width: 100%;
        height: 100%;
        padding-top: 15px;
        padding-left: 24px;
        color: #1890ff;
        font-weight: 700;
        font-size: 14px;
      }
    }
  }
}

.drawer-container {
  padding: 24px;
  font-size: 14px;
  line-height: 1.5;
  word-wrap: break-word;

  .drawer-title {
    margin-bottom: 12px;
    color: rgba(0, 0, 0, 0.85);
    font-size: 14px;
    line-height: 22px;
  }

  .drawer-item {
    color: rgba(0, 0, 0, 0.65);
    font-size: 14px;
    padding: 12px 0;
  }

  .drawer-switch {
    float: right;
  }
}
</style>
