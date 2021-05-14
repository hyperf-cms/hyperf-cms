<template>
  <div>
    <group-file ref="groupFileRef" :groupTool="groupTool"></group-file>
    <group-notice ref="groupNoticeRef" :groupTool="groupTool"></group-notice>
    <group-album ref="groupAlbumRef" :groupTool="groupTool"></group-album>
    <group-invite ref="groupInviteRef" :groupTool="groupTool"></group-invite>
  </div>
</template>
<script>
import GroupFile from './components/GroupFile'
import GroupNotice from './components/GroupNotice'
import GroupAlbum from './components/GroupAlbum'
import GroupInvite from './components/GroupInvite'
export default {
  name: 'GroupTool',
  components: { GroupFile, GroupNotice, GroupAlbum, GroupInvite },
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
          this.$refs['groupNoticeRef'].init()
          break
        case 'group_album':
          this.$refs['groupAlbumRef'].init()
          break
        case 'group_invite':
          this.$refs['groupInviteRef'].init()
          break
        case 'group_setting':
          this.$refs['groupFileRef'].init()
          break
      }
    },
  },
}
</script>
<style lang="scss" scoped>
</style>
 