<template>
  <div class="app-container">
    <conditional-filter
      :listQuery.sync="listQuery"
      :defaultListQuery="defaultListQuery"
      :columns.sync="columns"
      :list="list"
      :multipleSelection="multipleSelection"
      @getList="getList"
      :batchDelete="false"
      :addButton="false"
      excelTitle="操作日志"
    >
      <template slot="extraForm">
        <el-form-item label="操作行为：">
          <el-input
            v-model="listQuery.action"
            class="input-width"
            placeholder="请填写操作行为："
            @keyup.enter.native="getList"
          ></el-input>
        </el-form-item>
        <el-form-item label="操作人员">
          <el-input
            v-model="listQuery.operator"
            class="input-width"
            placeholder="请填写操作人员"
            @keyup.enter.native="getList"
          ></el-input>
        </el-form-item>
        <el-form-item label="状态选择：">
          <el-select v-model="listQuery.status" clearable class="input-width" placeholder="状态选择：">
            <el-option value="1" label="成功"></el-option>
            <el-option value="0" label="异常"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="时间筛选：">
          <el-date-picker
            v-model="listQuery.created_at"
            type="daterange"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right"
            value-format="yyyy-MM-dd HH:mm:ss"
            :default-time="['00:00:00', '23:59:59']"
          ></el-date-picker>
        </el-form-item>
      </template>
    </conditional-filter>
    <div class="table-container">
      <el-table ref="dictTypeTable" :data="list" style="width: 100%;" size="mini" border>
        <el-table-column
          v-if="columns[0].visible"
          label="日志编号"
          width="100"
          align="center"
          prop="id"
        ></el-table-column>
        <el-table-column
          v-if="columns[1].visible"
          label="用户名"
          width="150"
          align="center"
          prop="username"
        ></el-table-column>
        <el-table-column
          v-if="columns[2].visible"
          label="操作昵称"
          width="180"
          align="center"
          prop="operator"
        ></el-table-column>
        <el-table-column
          v-if="columns[3].visible"
          label="操作行为"
          width="220"
          align="center"
          prop="action"
        ></el-table-column>
        <el-table-column
          v-if="columns[4].visible"
          label="请求参数"
          prop="data"
          align="center"
          :show-overflow-tooltip="true"
          width="500"
        >
          <template slot-scope="scope">
            <span @click="copy(scope.row)" class="request_param">{{scope.row.data}}</span>
          </template>
        </el-table-column>
        <el-table-column
          v-if="columns[5].visible"
          label="响应状态码"
          prop="response_code"
          align="center"
          width="120"
        ></el-table-column>
        <el-table-column
          v-if="columns[6].visible"
          label="响应结果"
          prop="response_result"
          align="center"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          v-if="columns[7].visible"
          label="操作时间"
          prop="created_at"
          align="center"
          width="180"
        ></el-table-column>
        <el-table-column label="操作" align="center" width="150">
          <template slot-scope="scope">
            <el-button
              icon="el-icon-view"
              type="primary"
              size="mini"
              @click="handleViewDetail(scope.$index, scope.row)"
            >详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
      <Pagination
        v-show="total>0"
        :total="total"
        :page.sync="listQuery.cur_page"
        :limit.sync="listQuery.page_size"
        @pagination="getList"
      ></Pagination>
    </div>

    <!-- 日志详情 -->
    <log-detail ref="logDetail" :logDetailDialogData="logDetailDialogData"></log-detail>
  </div>
</template>
<script>
import { operateLogList } from '@/api/setting/log_module/operateLog'
import Clipboard from 'clipboard'
import LogDetail from './components/logDetail'
const defaultListQuery = {
  cur_page: 1,
  page_size: 20,
  action: '',
  operator: '',
  status: '',
  created_at: '',
}
export default {
  name: 'Api:setting/system_module/operate_log/list-index',
  components: {
    LogDetail,
  },
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      defaultListQuery: Object.assign({}, defaultListQuery),
      list: [],
      total: 0,
      columns: [
        { key: 0, field: 'id', label: `日志编号`, visible: true },
        { key: 1, field: 'username', label: `用户名`, visible: true },
        { key: 2, field: 'operator', label: `操作昵称`, visible: true },
        { key: 3, field: 'action', label: `操作行为`, visible: true },
        { key: 4, field: 'data', label: `请求参数`, visible: true },
        { key: 5, field: 'response_code', label: `响应状态码`, visible: true },
        { key: 6, field: 'response_result', label: `响应结果`, visible: true },
        { key: 7, field: 'created_at', label: `操作时间`, visible: true },
      ],
      multipleSelection: [],
      logDetailDialogData: {
        logDetailDialogVisible: false,
        logDetailTitle: '操作日志详情',
        logDetailData: '',
      },
    }
  },
  created() {
    this.getList()
  },
  filters: {},
  methods: {
    getList() {
      operateLogList(this.listQuery).then((response) => {
        if (response.code == 200) {
          this.total = response.data.total
          this.list = response.data.list
        }
      })
    },
    handleViewDetail(index, row) {
      this.logDetailDialogData.logDetailData = row
      this.logDetailDialogData.logDetailDialogVisible = true
    },
    copy(row) {
      let clipboard = new Clipboard('.request_param', {
        text: function () {
          return row.data
        },
      })
      clipboard.on('success', (e) => {
        this.$message({ message: '复制成功', showClose: true, type: 'success' })
        // 释放内存
        clipboard.destroy()
      })
      clipboard.on('error', (e) => {
        this.$message({ message: '复制失败,', showClose: true, type: 'error' })
        clipboard.destroy()
      })
    },
  },
}
</script>
<style scoped>
.input-width {
  width: 203px;
}
</style>
