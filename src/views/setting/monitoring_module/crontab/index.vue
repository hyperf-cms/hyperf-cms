<template>
  <div class="app-container">
    <conditional-filter
      :listQuery.sync="listQuery"
      :defaultListQuery="defaultListQuery"
      @getList="getList"
    >
      <template slot="extraForm">
        <el-form-item label="任务名称搜索：">
          <el-input
            v-model="listQuery.name"
            class="input-width"
            placeholder="任务名称搜索："
            style="width:300px;"
            @keyup.enter.native="getList"
          ></el-input>
        </el-form-item>
        <el-form-item label="Task名称搜索：">
          <el-input
            v-model="listQuery.task"
            class="input-width"
            placeholder="Task名称搜索："
            style="width:300px;"
            @keyup.enter.native="getList"
          ></el-input>
        </el-form-item>
        <el-form-item label="状态选择">
          <el-select v-model="listQuery.status" clearable class="input-width" placeholder="状态选择：">
            <el-option
              v-for="dict in statusOptions"
              :key="dict.dict_value"
              :label="dict.dict_label"
              :value="dict.dict_value"
            ></el-option>
          </el-select>
        </el-form-item>
      </template>
    </conditional-filter>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-button
        style="float: right;"
        icon="el-icon-plus"
        type="primary"
        size="mini"
        @click="handleAddTimedTask"
      >添加定时任务</el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="timedTaskTable" :data="list" style="width: 100%;" size="mini">
        <el-table-column label="ID" align="center" width="120" prop="id"></el-table-column>
        <el-table-column label="任务名称" align="center" prop="name"></el-table-column>
        <el-table-column label="Task名称" prop="task" align="center"></el-table-column>
        <el-table-column label="crontab表达式" prop="execute_time" align="center"></el-table-column>
        <el-table-column label="下次执行时间" prop="next_execute_time" align="center"></el-table-column>
        <el-table-column label="执行次数" align="center" prop="times"></el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              :active-value="1"
              :inactive-value="0"
              @change="changeStatus(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="描述" prop="desc" align="center"></el-table-column>

        <el-table-column label="创建时间" width="180" prop="created_at" align="center"></el-table-column>
        <el-table-column label="操作" align="center" width="220">
          <template slot-scope="scope">
            <el-button
              icon="el-icon-edit"
              type="primary"
              size="mini"
              @click="handleEditTimedTask(scope.row)"
            >编辑</el-button>
            <el-button
              icon="el-icon-delete"
              type="danger"
              size="mini"
              @click="handleDeleteTimedTask(scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
      <Pagination
        v-show="total > 0"
        :total="total"
        :page.sync="listQuery.cur_page"
        :limit.sync="listQuery.page_size"
        @pagination="getList"
      ></Pagination>
    </div>

    <!-- 添加/修改定时任务 -->
    <timed-task-detail ref="timedTaskDetail" :timedTaskDetailDialogData="timedTaskDetailDialogData"></timed-task-detail>
  </div>
</template>
<script>
import {
  timedTaskList,
  deleteTimedTask,
  changeStatus,
} from '@/api/setting/monitoring_module/timedTask'
import TimedTaskDetail from './components/detail'
const defaultListQuery = {
  cur_page: 1,
  page_size: 20,
  status: '',
  name: '',
  task: '',
}
export default {
  name: 'Api:setting/monitoring_module/timed_task/list-index',
  components: {
    TimedTaskDetail,
  },
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      defaultListQuery: Object.assign({}, defaultListQuery),
      list: [],
      total: 0,
      multipleSelection: [],
      statusOptions: [],
      timedTaskDetailDialogData: {
        timedTaskDetailDialogVisible: false,
        statusOptions: [],
        timedTaskDetailTitle: '',
        isEdit: false,
        id: '',
      },
    }
  },
  created() {
    this.getDicts('sys_timed_task_status').then((response) => {
      this.statusOptions = response.data.list
    })
    this.getList()
  },
  filters: {},
  methods: {
    handleAddTimedTask() {
      this.timedTaskDetailDialogData.timedTaskDetailDialogVisible = true
      this.timedTaskDetailDialogData.statusOptions = this.statusOptions
      this.timedTaskDetailDialogData.timedTaskDetailTitle = '添加定时任务'
      this.timedTaskDetailDialogData.isEdit = false
      this.$refs['timedTaskDetail'].getTimedTaskInfo()
    },
    handleEditTimedTask(row) {
      this.timedTaskDetailDialogData.timedTaskDetailDialogVisible = true
      this.timedTaskDetailDialogData.statusOptions = this.statusOptions
      this.timedTaskDetailDialogData.timedTaskDetailTitle =
        '修改 "' + row.title + '" 定时任务'
      this.timedTaskDetailDialogData.isEdit = true
      this.timedTaskDetailDialogData.id = row.id
      this.$refs['timedTaskDetail'].getTimedTaskInfo()
    },
    handleDeleteTimedTask(row) {
      this.deleteTimedTask(row.id)
    },
    getList() {
      timedTaskList(this.listQuery).then((response) => {
        this.total = response.data.total
        this.list = response.data.list
      })
    },
    deleteTimedTask(id) {
      this.$confirm('是否要进行该删除操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        deleteTimedTask(id).then((response) => {
          this.getList()
        })
      })
    },
    changeStatus(row) {
      let text = row.status === 0 ? '停用' : '启用'
      this.$confirm(
        '确认要"' + text + '""' + row.name + '"监控任务吗?',
        '警告',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      )
        .then(function () {
          return changeStatus(row.id, {
            status: row.status,
          })
          this.getList()
        })
        .catch(function () {
          row.status = row.status === 0 ? 1 : 0
        })
    },
    // 状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status)
    },
  },
}
</script>
<style scoped>
.input-width {
  width: 203px;
}
</style>
