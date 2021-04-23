<template>
  <el-drawer
    :visible.sync="taskLogDrawerData.taskLogDrawerVisible"
    :direction="taskLogDrawerData.direction"
    title="监控日志"
    size="20%"
  >
    <el-card class="box-card" shadow="never">
      <div class="notice_box" style="max-height: 830px;overflow-y:scroll;">
        <div class="loadingBox"></div>
        <el-timeline class="notice_line" v-if="list.length > 0">
          <el-timeline-item
            v-for="(item, index) in list"
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
  </el-drawer>
</template>

<script>
import Crontab from '@/components/Crontab'
const defaultTimedTask = {
  name: '',
  params: [],
  task: '',
  status: 1,
  execute_time: '',
  desc: '',
}
export default {
  name: 'TaskLog',
  components: {
    Crontab,
  },
  props: {
    taskLogDrawerData: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      list: [],
      total: [],
    }
  },
  created() {},
  methods: {},
}
</script>

<style></style>
