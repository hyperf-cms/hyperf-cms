<template>
  <div class="cs-navi">
    <el-collapse v-model="activeNames">
      <el-collapse-item v-for="(item, index) in menuList" :key="`parent${index}`" :name="item.name">
        <template slot="title">
          <svg-icon v-if="item.icon" :icon-class="item.icon"></svg-icon>
          <span>{{item.display_name}}</span>
        </template>
        <navigation-item :activeNames.sync="activeNames" :menu="item.child"></navigation-item>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<script>
import navigationItem from './components/navigationItem'
export default {
  components: { navigationItem },
  data() {
    return {
      menuList: [],
      activeNames: [],
    }
  },
  created() {
    this.getMenuList()
  },
  watch: {
    //监听左侧菜单变化情况
    '$store.getters.menuLeft': function () {
      this.getMenuList()
    },
  },
  methods: {
    getMenuList() {
      this.menuList = this.$store.getters.menuLeft
      if (this.menuList.length == 0) this.$router.push('/')

      for (var i = 0; i < this.menuList.length; i++) {
        this.activeNames.push(this.menuList[i].name)
      }
    },
    handleMenuClick(path) {
      this.$router.push(path)
    },
  },
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