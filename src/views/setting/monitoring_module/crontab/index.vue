<template>
  <div class="app-container">
    <conditional-filter
      :listQuery.sync="listQuery"
      :defaultListQuery="defaultListQuery"
      :columns.sync="columns"
      :list="list"
      :multipleSelection="multipleSelection"
      @getList="getList"
      @handleAdd="handleAdd"
      @handleBatchDelete="handleBatchDelete"
      excelTitle="定时任务"
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
    <div class="table-container">
      <el-table
        ref="timedTaskTable"
        :data="list"
        style="width: 100%;"
        size="mini"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="ID" align="center" width="120" prop="id" v-if="columns[0].visible"></el-table-column>
        <el-table-column label="任务名称" align="center" prop="name" v-if="columns[1].visible"></el-table-column>
        <el-table-column label="Task名称" prop="task" align="center" v-if="columns[2].visible"></el-table-column>
        <el-table-column
          label="crontab表达式"
          prop="execute_time"
          align="center"
          v-if="columns[3].visible"
        ></el-table-column>
        <el-table-column
          label="下次执行时间"
          prop="next_execute_time"
          align="center"
          v-if="columns[4].visible"
        ></el-table-column>
        <el-table-column label="执行次数" align="center" prop="times" v-if="columns[5].visible"></el-table-column>
        <el-table-column label="状态" align="center" v-if="columns[6].visible">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              :active-value="1"
              :inactive-value="0"
              @change="changeStatus(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="描述" prop="desc" align="center" v-if="columns[7].visible"></el-table-column>

        <el-table-column
          label="创建时间"
          width="180"
          prop="created_at"
          align="center"
          v-if="columns[8].visible"
        ></el-table-column>
        <el-table-column label="操作" align="center" width="300">
          <template slot-scope="scope">
            <el-button
              icon="el-icon-view"
              type="primary"
              size="mini"
              class="button-color-green"
              @click="handleViewTaskLog(scope.row)"
            >查看日志</el-button>
            <el-button
              icon="el-icon-edit"
              type="primary"
              size="mini"
              @click="handleEdit(scope.row)"
            >编辑</el-button>
            <el-button
              icon="el-icon-delete"
              type="danger"
              size="mini"
              @click="handleDelete(scope.row)"
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
    <!-- 监控任务日志 -->
    <task-log ref="taskLog" :taskLogDrawerData="taskLogDrawerData"></task-log>
  </div>
</template>
<script>
import {
  timedTaskList,
  deleteTimedTask,
  changeStatus,
} from '@/api/setting/monitoring_module/timedTask'
import TimedTaskDetail from './components/detail'
import TaskLog from './components/taskLog'
const defaultListQuery = {
  cur_page: 1,
  page_size: 20,
  status: '',
  name: '',
  task: '',
}
export default {
  name: 'crontab',
  components: {
    TimedTaskDetail,
    TaskLog,
  },
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      defaultListQuery: Object.assign({}, defaultListQuery),
      list: [],
      total: 0,
      columns: [
        { key: 0, field: 'id', label: `ID`, visible: true },
        { key: 1, field: 'name', label: `任务名称`, visible: true },
        { key: 2, field: 'task', label: `Task名称`, visible: true },
        {
          key: 3,
          field: 'execute_time',
          label: `crontab表达式`,
          visible: true,
        },
        {
          key: 4,
          field: 'next_execute_time',
          label: `下次执行时间`,
          visible: true,
        },
        { key: 5, field: 'times', label: `执行次数`, visible: true },
        { key: 6, field: 'status', label: `状态`, visible: true },
        { key: 7, field: 'desc', label: `描述`, visible: true },
        { key: 8, field: 'created_at', label: `创建时间`, visible: true },
      ],
      multipleSelection: [],
      statusOptions: [],
      timedTaskDetailDialogData: {
        timedTaskDetailDialogVisible: false,
        statusOptions: [],
        timedTaskDetailTitle: '',
        isEdit: false,
        id: '',
      },
      taskLogDrawerData: {
        taskLogDrawerVisible: false,
        direction: 'rtl',
      },
    }
  },
  created() {
    this.getDicts('sys_timed_task_status').then((response) => {
      if (response.code == 200) {
        this.statusOptions = response.data.list
      }
    })
    this.getList()
  },
  filters: {},
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleAdd() {
      this.timedTaskDetailDialogData.timedTaskDetailDialogVisible = true
      this.timedTaskDetailDialogData.statusOptions = this.statusOptions
      this.timedTaskDetailDialogData.timedTaskDetailTitle = '添加定时任务'
      this.timedTaskDetailDialogData.isEdit = false
      this.$refs['timedTaskDetail'].getTimedTaskInfo()
    },
    handleEdit(row) {
      this.timedTaskDetailDialogData.timedTaskDetailDialogVisible = true
      this.timedTaskDetailDialogData.statusOptions = this.statusOptions
      this.timedTaskDetailDialogData.timedTaskDetailTitle =
        '修改 "' + row.title + '" 定时任务'
      this.timedTaskDetailDialogData.isEdit = true
      this.timedTaskDetailDialogData.id = row.id
      this.$refs['timedTaskDetail'].getTimedTaskInfo()
    },
    handleDelete(row) {
      this.deleteTimedTask(row.id)
    },
    handleBatchDelete() {
      let id_arr = []
      for (let i = 0; i < this.multipleSelection.length; i++) {
        id_arr.push(this.multipleSelection[i].id)
      }
      this.deleteTimedTask(id_arr, true)
    },
    handleViewTaskLog(row) {
      this.taskLogDrawerData.taskLogDrawerVisible = true
    },
    getList() {
      timedTaskList(this.listQuery).then((response) => {
        if (response.code == 200) {
          this.total = response.data.total
          this.list = response.data.list
        }
      })
    },
    deleteTimedTask(id, isBatch = false) {
      this.$confirm('是否要进行该删除操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        if (isBatch) {
          deleteTimedTask(0, { id: id }).then((response) => {
            if (response.code == 200) {
              this.multipleSelection = []
              this.getList()
            }
          })
        } else {
          deleteTimedTask(id).then((response) => {
            if (response.code == 200) {
              this.multipleSelection = []
              this.getList()
            }
          })
        }
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
