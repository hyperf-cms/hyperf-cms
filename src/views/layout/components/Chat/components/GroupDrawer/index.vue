<template>
  <div class="drawer-content">
    <div class="slot-group">
      <div @click="handleOpenGroupTool('group_notice', contact)" style="cursor: pointer;">
        <div class="slot-group-title">群公告</div>
        <i class="el-icon-arrow-right" style="float:right"></i>
        <el-tooltip class="item" effect="light" placement="right-start" offset="10">
          <div
            slot="content"
            class="group-notice"
            style="font-size:14px"
            v-html="contact.introduction"
          ></div>
          <div class="slot-group-notice" v-html="contact.introduction"></div>
        </el-tooltip>
      </div>
      <div
        class="slot-group-title"
        style="border-top: 1px solid #999;padding-top:10px;margin-bottom:10px"
      >群成员({{contact.member_total}})</div>
      <div class="slot-group-panel" style="height: 449px;overflow: auto;">
        <div class="slot-group-member" v-for="(item, index) in contact.group_member" :key="index">
          <img
            :src="item.avatar"
            alt
            style="width:30px;height:30px;border-radius:20%;margin-right:3px;ver"
          />
          <span>{{ item.desc}}</span>
          <svg-icon
            icon-class="lord"
            style="width:1.8em;height:1.8em;float:right;margin-top:5px"
            v-if="item.level == 0"
          ></svg-icon>
          <svg-icon
            icon-class="manager"
            style="width:1.8em;height:1.8em;float:right;margin-top:5px"
            v-if="item.level == 1"
          ></svg-icon>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'GroupDrawer',
  computed: {
    contact() {
      return this.$store.state.chat.contact
    },
  },
  methods: {
    handleOpenGroupTool() {
      console.log(this.$store.state.chat.contact)
    },
  },
}
</script>
<style>
</style>


