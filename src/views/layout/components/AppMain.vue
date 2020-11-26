<template>
  <section class="app-main">
    <transition name="fade" mode="out-in">
      <!-- 暂时禁用路由缓存 -->
      <!-- <keep-alive>
        <router-view :key="key"></router-view>
      </keep-alive> -->
      <router-view :key="key"></router-view>
    </transition>
  </section>
</template>
<script>
export default {
  name: 'AppMain',
  data() {
    return {
      'isKeepAlive': process.env.NODE_ENV,
      'cacheName': [''],
    }
  },
  computed: {
    cachedViews() {
      return this.$store.state.tagsViews.cachedViews;
    },
    key() {
      if (this.$route.name == undefined && this.$route.path == '/home') {
        //页面第一次加载时 清空 tab 标签页上的所有标签 回到首页
        this.$store.dispatch('delAllViews')
      }
      let onlykey = ''
      let clicked = ''
      if (!this.$route.meta.clicked) {
        onlykey = this.$route.path + "0"
        clicked = '0'
      } else {
        //上一次的状态为0
        if (this.$route.meta.clicked == '0') {
          //这一次有参数
          if (Object.keys(this.$route.query).length != 0 || this.$route.hash == '#new') {
            onlykey = this.$route.path + "1"
            clicked = '1'
          }
          //这一次无参
          else {
            onlykey = this.$route.path + "0"
            clicked = '0'
          }
        }
        //上一次的状态不是0
        else {
          //这一次有参数
          //在创建新活动时  传入 hash  = new
          if (Object.keys(this.$route.query).length != 0 || this.$route.hash == '#new') {
            //这一次的状态     为上一次+1
            //获取上一次的状态
            clicked = (parseInt(this.$route.meta.clicked) + 1).toString();
            onlykey = this.$route.path + clicked

          }
          //这一次无参 这一次状态不变
          else {
            clicked = parseInt(this.$route.meta.clicked).toString();
            onlykey = this.$route.path + clicked;

          }
        }
      }
      this.$store.dispatch('addViews', this.$route)
      this.$route.meta.clicked = clicked;
      return onlykey
    },
    cacheName() {
      let allViews = this.$store.getters.allViews;
      let cacheNameArr = allViews.map((item) => { return item.routeName })
      return cacheNameArr
    }
  }
}

</script>
