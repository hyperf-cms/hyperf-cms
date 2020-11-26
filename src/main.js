import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n
import '../static/js/particles.min.js'
import VCharts from 'v-charts'

import '@/styles/index.scss' // global css

import App from './App'
import router from './router'
import store from './store'

import '@/icons' // icon
import '@/permission' // permission control

Vue.use(ElementUI, { locale })

import VideoPlayer from 'vue-video-player'
import 'vue-video-player/src/custom-theme.css'
import 'video.js/dist/video-js.css'

import clipboard from 'clipboard';

Vue.use(VideoPlayer)

Vue.use(VCharts)
Vue.config.productionTip = false
Vue.config.devtools = true

//注册到vue原型上
Vue.prototype.clipboard = clipboard;
window.vue = new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
