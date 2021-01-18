<template>
  <div class="menu-wrapper">
    <template v-for="item in routes" v-if="item.child">

      <router-link v-if="hasOneShowingChildren(item.child) && !item.child[0].child" :to="item.child[0].url"
        :key="item.child[0].name">
        <el-menu-item :index="item.child[0].url" :class="{'submenu-title-noDropdown':!isNest}">
          <svg-icon v-if="item.child[0].icon" :icon-class="item.child[0].icon"></svg-icon>
          <span v-if="item.child[0].display_name" slot="title">{{ item.child[0].display_name }}</span>
        </el-menu-item>
      </router-link>

      <el-submenu v-else :index="item.name || item.url" :key="item.name">
        <template slot="title">
          <svg-icon v-if="item.icon" :icon-class="item.icon"></svg-icon>
          <span v-if="item.display_name" slot="title">{{ item.display_name }}</span>
        </template>

        <template v-for="child in item.child">
          <sidebar-item :is-nest="true" class="nest-menu" v-if="child.child && child.child.length>0" :routes="[child]" :key="child.url"></sidebar-item>

          <router-link v-else :to="child.url" :key="child.name">
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
      type: Array
    },
    isNest: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    /**
     * 检查是否有子菜单
     * @param  {[string]}  child [子菜单]
     * @return {Boolean}   
     */
    hasOneShowingChildren(child) {

      const showingChildren = child.filter(item => {
        return !item.hidden
      })
      if (showingChildren.length === 1) {
        return true
      }
      return false
    },
  },
  mounted() {
  },
}
</script>
