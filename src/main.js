import Vue from "vue";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import locale from "element-ui/lib/locale/lang/zh-CN"; // lang i18n
import "./styles/element-variables.scss";
import VCharts from "v-charts";
import App from "./App";
import store from "./store";
import router from "./router";
import VideoPlayer from "vue-video-player";
import clipboard from "clipboard";
import { getDicts } from "@/api/setting/system_module/dictData";
import LemonMessageForward from "@/views/layout/components/Chat/components/LemonMessageForward";
import LemonMessageVideo from "@/views/layout/components/Chat/components/LemonMessageVideo";
import {
  parseTime,
  resetForm,
  addDateRange,
  selectDictLabel,
  selectDictLabels,
  download,
  handleTree,
  getImages
} from "@/utils/global";
import { getfilesize } from "@/utils/file";
import Pagination from "@/components/Pagination";
import ConditionalFilter from "@/components/ConditionalFilter";
import { dateSelection } from "@/mixins/dateSelection";
import LemonIMUI from "lemon-imui";
import "normalize.css/normalize.css"; // A modern alternative to CSS resets
import "../public/static/js/particles.min.js";
import "element-ui/lib/theme-chalk/index.css";
import "@/styles/index.scss"; // global css
import "@/styles/ruoyi.scss"; // global css
import "@/icons"; // icon
import "@/permission"; // permission control
import "vue-video-player/src/custom-theme.css";
import "video.js/dist/video-js.css";
import "lemon-imui/dist/index.css";
import Clipboard from "clipboard";

Vue.use(ElementUI, { locale });
Vue.use(VideoPlayer);
Vue.use(VCharts);
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
Vue.prototype.getImages = getImages;

// 全局组件挂载
Vue.component("Pagination", Pagination);
Vue.component("ConditionalFilter", ConditionalFilter);
// 挂在全局的音频文件，播放音频
Vue.prototype.playAudio = messageToneType => {
  let buttonAudio = document.getElementById("eventAudio");
  buttonAudio.setAttribute("src", "../public/static/audio/" + messageToneType);
  buttonAudio.play();
};
Vue.prototype.msgSuccess = function(msg) {
  this.$message({ showClose: true, message: msg, type: "success" });
};
Vue.prototype.msgError = function(msg) {
  this.$message({ showClose: true, message: msg, type: "error" });
};
Vue.prototype.msgInfo = function(msg) {
  this.$message.info(msg);
};
Vue.prototype.clipboard = clipboard;
Vue.prototype.copy = function(data, className) {
  let clipboard = new Clipboard("." + className, {
    text: function() {
      return data;
    }
  });
  clipboard.on("success", e => {
    this.$message({ message: "复制成功", showClose: true, type: "success" });
    // 释放内存
    clipboard.destroy();
  });
  clipboard.on("error", e => {
    this.$message({ message: "复制失败,", showClose: true, type: "error" });
    clipboard.destroy();
  });
  this.$forceUpdate();
};

Vue.component(LemonMessageForward.name, LemonMessageForward);
Vue.component(LemonMessageVideo.name, LemonMessageVideo);
//引入时间筛选的快捷选项
Vue.mixin(dateSelection);

Vue.config.silent = true;
//注册到vue原型上
window.vue = new Vue({
  el: "#app",
  router,
  store,
  template: "<App/>",
  components: { App }
});
