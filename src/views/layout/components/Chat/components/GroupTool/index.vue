<template>
  <group-file ref="groupFileRef" :groupTool="groupTool"></group-file>
</template>
<script>
import GroupFile from './components/GroupFile'
export default {
  name: 'GroupTool',
  components: { GroupFile },
  props: {
    groupTool: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {}
  },
  mounted() {},
  watch: {},
  created() {},
  methods: {
    init() {
      switch (this.groupTool.type) {
        case 'group_file':
          this.$refs['groupFileRef'].init()
          break
        case 'group_notice':
          this.$refs['group_notice'].init()
          break
        case 'group_album':
          this.$refs['groupToolRef'].init()
          break
        case 'group_invite':
          this.$refs['groupFileRef'].init()
          break
        case 'group_setting':
          this.$refs['groupFileRef'].init()
          break
      }
      console.log(this.groupTool)
    },
  },
}
</script>
<style lang="scss" scoped>
</style>
 