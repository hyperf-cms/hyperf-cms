<template>
  <div>
    <div>
      <el-tabs
        v-if="tagsView"
        type="card"
        v-model="activeRoute"
        @tab-click="changeTags"
        closable
        @tab-remove="removeTags"
      >
        <el-tab-pane
          v-for="(item, index) in allViews"
          :label="item.name"
          :name="item.path"
          :key="index"
        ></el-tab-pane>
      </el-tabs>
    </div>
    <div style="float:right;margin-top:-55px;" v-if="tagsView">
      <el-dropdown split-button type @click="removeAllTags()" size>
        <i class="el-icon-circle-close"></i>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>
            <span @click="freshPage()">
              <i class="el-icon-refresh"></i>刷新页面
            </span>
          </el-dropdown-item>
          <el-dropdown-item>
            <i class="el-icon-d-arrow-left"></i>关闭左侧
          </el-dropdown-item>
          <el-dropdown-item>
            <i class="el-icon-d-arrow-right"></i>关闭右侧
          </el-dropdown-item>
          <el-dropdown-item>
            <i class="el-icon-close"></i>关闭其他
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>
<script>
import { arrayLookup } from '@/utils/functions'
export default {
  name: 'MenuTag',
  inject: ['reload'], //注入reload方法
  data() {
    return {
      menuList: [],
    }
  },
  computed: {
    activeRoute: {
      get() {
        return this.$route.path
      },
      set(val) {},
    },
    allViews: {
      get() {
        return this.$store.getters.allViews
      },
    },
    tagsView: {
      get() {
        return this.$store.state.setting.tagsView
      },
    },
  },
  methods: {
    getMenuList() {
      this.menuList = this.$store.getters.menuList
    },
    changeTags(tab, event) {
      this.getMenuList()

      //更改导航标签时，循环遍历去获取菜单头部标识 用来渲染左侧菜单
      this.$store.commit('SET_CURRENT_MODULE', 'home')
      for (var i = 0; i < this.menuList.length; i++) {
        //循环头部菜单栏中的左侧子菜单栏
        if (this.menuList[i].child != undefined) {
          for (var j = 0; j < this.menuList[i].child.length; j++) {
            for (var k = 0; k < this.menuList[i].child[j].child.length; k++) {
              if (tab.name == this.menuList[i].child[j].child[k].url) {
                this.$store.commit('SET_CURRENT_MODULE', this.menuList[i].name)
              }
            }
          }
        }
      }
      if (tab.name != this.$route.path) this.$router.push(tab.name)
    },
    removeTags(name) {
      let routeName = arrayLookup(this.allViews, 'path', name, 'routeName')
      name = { name: name, nowPath: this.$route.path, routeName: routeName }
      this.$store
        .dispatch('removeView', name)
        .then((res) => {
          // 移除tags
        })
        .catch((err) => {})
    },

    removeAllTags() {
      this.$store.dispatch('delAllViews')
    },
    freshPage() {
      this.reload()
    },
  },
}
</script>