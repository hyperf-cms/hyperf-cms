<template>
  <scroll-bar>
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu mode="vertical" :show-timeout="200" :default-active="$route.path" :collapse="isCollapse" background-color="#304156" text-color="#bfcbd9" active-text-color="#409EFF" :unique-opened=true>
        <sidebar-item :routes="routes"></sidebar-item>
      </el-menu>
    </el-scrollbar>
  </scroll-bar>
</template>
<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
import ScrollBar from '@/components/ScrollBar'

export default {
  components: { SidebarItem, ScrollBar },
  computed: {
    ...mapGetters([
      'sidebar'
      
    ]),
    routes() {
      return this.$store.getters.menuLeft
    },
    isCollapse() {
      return !this.sidebar.opened
    },
  },

  mounted() {},
}

</script>
