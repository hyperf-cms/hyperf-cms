import Vue from "vue";
import ElementUI from "element-ui";
import locale from "element-ui/lib/locale/lang/zh-CN"; // lang i18n
import VCharts from "v-charts";
import App from "./App";
import store from "./store";
import router from "./router";
import VideoPlayer from "vue-video-player";
import clipboard from "clipboard";
import { getDicts } from "@/api/setting/system_module/dictData";
import audio from "@/assets/audio/messageDefault.mp3"
import {
  parseTime,
  resetForm,
  addDateRange,
  selectDictLabel,
  selectDictLabels,
  download,
  handleTree
} from "@/utils/global";
import { getfilesize } from "@/utils/file";
import Pagination from "@/components/Pagination";
import ConditionalFilter from "@/components/ConditionalFilter";
import { dateSelection } from "@/mixins/dateSelection";
import Chat from "jwchat";
import LemonIMUI from "lemon-imui";
import "normalize.css/normalize.css"; // A modern alternative to CSS resets
import "../static/js/particles.min.js";
import "element-ui/lib/theme-chalk/index.css";
import "@/styles/index.scss"; // global css
import "@/styles/ruoyi.scss"; // global css
import "@/icons"; // icon
import "@/permission"; // permission control
import "vue-video-player/src/custom-theme.css";
import "video.js/dist/video-js.css";
import "lemon-imui/dist/index.css";

Vue.use(ElementUI, { locale });
Vue.use(VideoPlayer);
Vue.use(VCharts);
Vue.use(Chat);
Vue.use(LemonIMUI);

Vue.config.productionTip = false;
Vue.config.devtools = true;

// 全局方法挂载
Vue.prototype.getDicts = getDicts;
Vue.prototype.parseTime = parseTime;
Vue.prototype.resetForm = resetForm;
Vue.prototype.addDateRange = addDateRange;
Vue.prototype.selectDictLabel = selectDictLabel;
Vue.prototype.selectDictLabels = selectDictLabels;
Vue.prototype.download = download;
Vue.prototype.handleTree = handleTree;
Vue.prototype.getfilesize = getfilesize;

// 全局组件挂载
Vue.component("Pagination", Pagination);
Vue.component("ConditionalFilter", ConditionalFilter);
// 挂在全局的音频文件，播放音频
Vue.prototype.playAudio = (messageToneType) => {
  let buttonAudio = document.getElementById('eventAudio');
  let audio = require('./assets/audio/' + messageToneType)
  buttonAudio.setAttribute('src',audio)
  buttonAudio.play()
}


//引入时间筛选的快捷选项
Vue.mixin(dateSelection);

//注册到vue原型上
Vue.prototype.clipboard = clipboard;
window.vue = new Vue({
  el: "#app",
  router,
  store,
  template: "<App/>",
  components: { App }
});
