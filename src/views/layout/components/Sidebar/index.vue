<template>
  <scroll-bar>
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <div style="margin-bottom:10px">
        <a target="blank" href="https://github.com/hyperf-cms">
          <img v-if="!isCollapse" :src="bgImage" alt style="width: 200px;height: 70px;" />
          <img v-else :src="bgImage2" alt style="width: 50px;height: 50px;" />
        </a>
      </div>
      <el-menu
        mode="vertical"
        :show-timeout="200"
        :default-openeds="$store.getters.permissions"
        :default-active="$route.path"
        :collapse="isCollapse"
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#409EFF"
        :unique-opened="false"
        v-if="routes.length !=0"
      >
        <sidebar-item :routes="routes"></sidebar-item>
      </el-menu>
      <div
        v-else
        v-show="!isCollapse"
        class="cs-layout-header-aside-menu-empty"
        flex="dir:top main:center cross:center"
      >
        <i class="el-icon-s-grid" />
        <br />
        <span>暂无侧栏菜单</span>
      </div>
    </el-scrollbar>
  </scroll-bar>
</template>
<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
import ScrollBar from '@/components/ScrollBar'
import bgImage from '@/assets/bgIMage/bgimage.png'
import bgImage2 from '@/assets/bgIMage/bgimage2.png'

export default {
  components: { SidebarItem, ScrollBar },
  data() {
    return {
      bgImage: bgImage,
      bgImage2: bgImage2,
    }
  },
  computed: {
    ...mapGetters(['sidebar']),
    routes() {
      console.log(this.$store.getters.menuLeft)
      return this.$store.getters.menuLeft
    },
    isCollapse() {
      return !this.sidebar.opened
    },
  },

  mounted() {},
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
// 菜单为空的时候显示的信息
.cs-layout-header-aside-menu-empty {
  height: 160px;
  margin: 0px 10px 10px;
  border-radius: 4px;
  background-color: #1f2d3d;
  cursor: pointer;
  &:hover {
    i {
      color: #fff;
    }
    span {
      color: #fff;
    }
  }

  i {
    margin-top: 50px;
    margin-left: 40%;
    font-size: 32px;
    color: #ccc;
    margin-bottom: 10px;
  }

  span {
    margin-left: 25%;
    font-size: 14px;
    color: #ccc;
  }
}
</style>
