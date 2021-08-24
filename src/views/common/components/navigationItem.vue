<template>
  <div>
    <div class="flex-wrap">
      <div
        v-for="(sub, key) in menu"
        :key="`sub${key}`"
        class="cs-navi__block"
        :style="{'width': (sub.child && sub.child.length > 0  ? '100%' : '')}"
      >
        <div v-if="sub.child && sub.child.length > 0">
          <el-collapse-item :name="sub.name">
            <template slot="title">
              <svg-icon v-if="sub.icon" :icon-class="sub.icon"></svg-icon>
              <span>{{sub.display_name}}</span>
            </template>
            <navigation-item :activeNames.sync="activeNames" :menu="sub.child" :index="0"></navigation-item>
          </el-collapse-item>
        </div>
        <div class="cs-navi__content" @click="handleMenuClick(sub.url)" v-else>
          <div class="cs-navi__icon">
            <svg-icon v-if="sub.icon" :icon-class="sub.icon"></svg-icon>
          </div>
          <div class="cs-navi__info">
            <p class="cs-navi__sub_title">
              <i class="el-icon-link cs-pr-5" />
              <span>{{sub.display_name}}</span>
            </p>
            <p class="cs-navi__desc" :title="sub.display_desc">{{sub.display_desc}}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NavigationItem',
  props: {
    menu: {
      type: Array,
      default: [],
    },
    activeNames: {
      type: Array,
      default: [],
    },
  },
  watch: {
    //监听左侧菜单变化情况
    '$store.getters.menuLeft': function () {
      this.getMenuList()
    },
  },
  created() {
    this.getMenuList()
  },
  methods: {
    handleMenuClick(path) {
      this.$router.push(path)
    },
    getMenuList() {
      // if (this.menu.length == 0) this.$router.push('/')
      for (var i = 0; i < this.menu.length; i++) {
        if (this.menu[i].child && this.menu[i].child.length > 0) {
          this.activeNames.push(this.menu[i].name)
        }
      }
    },
  },
  mounted() {},
}
</script>
<style lang="scss" scoped>
.flex-wrap {
  display: flex;
  flex-wrap: wrap;
  margin: -15px auto -10px;
}

.cs-navi {
  padding: 40px;
  background-color: #fff;

  .cs-navi__title {
    width: 20px;
    color: #909399;
    font-size: 16px;
    padding-left: 3px;
  }

  .iconfont__mini {
    width: 22px;
    font-size: 20px;
    padding-left: 0;
  }

  .iconfont__medium {
    font-size: 40px;
  }

  .cs-navi__block {
    width: 20%;
    box-sizing: border-box;
    padding: 0 7.5px;
    margin-top: 15px;
  }

  .cs-navi__content {
    display: flex;
    cursor: pointer;
    color: #909399;
    border-radius: 4px;
    background-color: #f5f7fa;
    padding: 10px;
    overflow: hidden;
  }

  .cs-navi__icon {
    // @extend %flex-center-row;
    min-width: 60px;
    font-size: 32px;
  }

  .cs-navi__info {
    p {
      margin: 0;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .cs-navi__sub_title {
      color: #303133;
      height: 24px;
      font-size: 17px;
      font-weight: bold;
    }

    .cs-navi__desc {
      font-size: 12px;
      height: 23px;
    }
  }
}
</style>