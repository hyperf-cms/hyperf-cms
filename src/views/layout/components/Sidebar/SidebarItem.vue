<template>
  <div class="menu-wrapper">
    <template v-for="item in routes">
      <router-link v-if="!hasOneShowingChildren(item.child)" :to="item.url" :key="item.name">
        <el-menu-item :index="item.url" :class="{'submenu-title-noDropdown':!isNest}">
          <svg-icon v-if="item.icon" :icon-class="item.icon"></svg-icon>
          <span v-if="item.display_name" slot="title">{{ item.display_name }}</span>
        </el-menu-item>
      </router-link>

      <el-submenu v-else :index="item.name" :key="item.name">
        <template slot="title">
          <svg-icon v-if="item.icon" :icon-class="item.icon"></svg-icon>
          <span v-if="item.display_name" slot="title">{{ item.display_name }}</span>
        </template>

        <template v-for="child in item.child">
          <sidebar-item
            :is-nest="true"
            class="nest-menu"
            v-if="child.child&&child.child.length>0"
            :routes="[child]"
            :key="child.url"
          ></sidebar-item>
          <router-link :to="child.url" :key="child.name" v-else>
            <el-menu-item :index="child.url">
              <svg-icon v-if="child.icon" :icon-class="child.icon"></svg-icon>
              <span v-if="child.display_name" slot="title">{{ child.display_name }}</span>
            </el-menu-item>
          </router-link>
        </template>
      </el-submenu>
    </template>
  </div>
</template>

<script>
export default {
  name: 'SidebarItem',
  props: {
    routes: {
      type: Array,
    },
    isNest: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    /**
     * 检查是否有子菜单
     * @param  {[string]}  child [子菜单]
     * @return {Boolean}
     */
    hasOneShowingChildren(child) {
      if (child == undefined) return false
      const showingChildren = child.filter((item) => {
        return !item.hidden
      })
      if (showingChildren.length >= 1) {
        return true
      }
      return false
    },
  },
  mounted() {},
}
</script>
