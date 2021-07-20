<template>
  <el-card class="operate-container" shadow="never">
    <i class="el-icon-tickets"></i>
    <span>{{ title }}</span>
    <slot name="extraButton"></slot>
  </el-card>
</template>
<script>
import { setStore, getStore, removeStore } from '@/utils/store'

export default {
  name: 'tableHeader',
  props: {
    // 默认条件
    title: {
      type: String,
      default: '数据列表',
    },
    excel: {
      type: Object,
      default: {},
    },
  },
  mixins: [],
  data() {
    return {
      lists: [],
    }
  },
  watch: {},
  created() {},
  methods: {},
}
</script>
