<template>
  <div style="float:right">
    <el-tooltip class="item" effect="dark" content="更换主题颜色" placement="top-start">
      <el-color-picker
        size="small"
        class="theme-picker"
        popper-class="theme-picker-dropdown"
        v-model="themeVal"
      ></el-color-picker>
    </el-tooltip>
  </div>
</template>
<script>
import theme from '@/assets/js/theme'
export default {
  name: 'Theme',
  mixins: [theme()],
  data() {
    return {
      chalk: '',
    }
  },
}
</script>
<style scoped>
.theme-picker {
  cursor: pointer;
  width: 20px;
  height: 20px;
  vertical-align: 10px;
}
</style>
