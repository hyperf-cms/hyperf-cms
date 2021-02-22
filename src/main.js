import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n
import '../static/js/particles.min.js'
import VCharts from 'v-charts'

import '@/styles/index.scss' // global css
import '@/styles/ruoyi.scss' // global css

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

import { getDicts } from "@/api/setting/system_module/dictData";
import { parseTime, resetForm, addDateRange, selectDictLabel, selectDictLabels, download, handleTree } from "@/utils/global";

// 全局方法挂载
Vue.prototype.getDicts = getDicts
Vue.prototype.parseTime = parseTime
Vue.prototype.resetForm = resetForm
Vue.prototype.addDateRange = addDateRange
Vue.prototype.selectDictLabel = selectDictLabel
Vue.prototype.selectDictLabels = selectDictLabels
Vue.prototype.download = download
Vue.prototype.handleTree = handleTree

import Pagination from "@/components/Pagination";
import ConditionalFilter from "@/components/ConditionalFilter";
// 全局组件挂载
Vue.component('Pagination', Pagination)
Vue.component('ConditionalFilter', ConditionalFilter)


//注册到vue原型上
Vue.prototype.clipboard = clipboard;
window.vue = new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
