<template>
  <div>
    <el-tooltip
      class="item"
      effect="dark"
      content="后台维护中 （禁用除超级管理员外所有用户的增删改权限）"
      placement="top-start"
    >
      <svg-icon icon-class="maintain" style="width:4.0em" />
    </el-tooltip>
  </div>
</template>
<script>
export default {
  name: 'Maintain',
  data() {
    return {}
  },
  methods: {},
}
</script>
<style scoped>
.item {
  cursor: pointer;
}
</style>
