<template>
  <el-card class="box-card" shadow="never">
    <div slot="header" class="clearfix">
      <span>最新通知</span>
    </div>
    <div class="notice_box" style="max-height: 830px;overflow-y:scroll;">
      <div class="loadingBox"></div>
      <el-timeline class="notice_line" v-if="noticeList.length > 0">
        <el-timeline-item
          v-for="(item, index) in noticeList"
          :key="index"
          :timestamp="item.created_at"
          placement="top"
        >
          <el-card>
            <h4 v-html="item.title"></h4>
            <p v-html="item.content"></p>
          </el-card>
        </el-timeline-item>
      </el-timeline>
      <span v-else>暂无通知</span>
    </div>
  </el-card>
</template>

<script>
// import { getNoticeList } from '@/api/system/notice';
import { formatDate } from '@/utils/date'

export default {
  name: 'NoticePanel',
  props: {
    noticeList: {
      type: Array,
      default: [],
    },
  },
  watch: {
    noticeList: function (newVal, oldVal) {
      this.noticeList = newVal
    },
  },
  filters: {
    formatTime(time) {
      let date = new Date(time * 1000)
      return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
    },
  },
}
</script>

<style lang="scss" scoped>
.notice_box {
  position: relative;
}

.notice_line {
  padding: 0 30px 0 10px;
}

.loadingBox {
  position: absolute;
  top: 0;
  width: 100%;
  height: 200px;
}
</style>
