<template>
  <div class="app-container">
    <conditional-filter
      :listQuery.sync="listQuery"
      :defaultListQuery="defaultListQuery"
      @getList="getList"
    >
      <template slot="extraForm">
        <el-form-item label="字典名称：">
          <el-input
            v-model="listQuery.dict_name"
            class="input-width"
            placeholder="请输入字典名称："
            @keyup.enter.native="getList"
          ></el-input>
        </el-form-item>
        <el-form-item label="字典类型">
          <el-input
            v-model="listQuery.dict_type"
            class="input-width"
            placeholder="请输入字典标签"
            @keyup.enter.native="getList"
          ></el-input>
        </el-form-item>
        <el-form-item label="状态选择：">
          <el-select v-model="listQuery.status" clearable class="input-width" placeholder="状态选择：">
            <el-option value="1" label="正常"></el-option>
            <el-option value="0" label="停用"></el-option>
          </el-select>
        </el-form-item>
      </template>
    </conditional-filter>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
    </el-card>
    <div class="table-container">
      <el-table ref="dictTypeTable" :data="list" style="width: 100%;" size="mini">
        <el-table-column label="日志编号" width="100" align="center" prop="id"></el-table-column>
        <el-table-column label="用户名" width="150" align="center" prop="username"></el-table-column>
        <el-table-column label="操作昵称" width="180" align="center" prop="operator"></el-table-column>
        <el-table-column label="操作行为" width="220" align="center" prop="action"></el-table-column>
        <el-table-column
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
        <el-table-column label="响应状态码" prop="response_code" align="center" width="120"></el-table-column>
        <el-table-column label="响应结果" prop="response_result" align="center"></el-table-column>
        <el-table-column label="操作时间" prop="created_at" align="center" width="180"></el-table-column>
        <el-table-column label="操作" align="center" width="150">
          <template slot-scope="scope">
            <el-button
              icon="el-icon-view"
              type="info"
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
import { formatDate } from '@/utils/date'
import Clipboard from 'clipboard'
import LogDetail from './components/logDetail'
const defaultListQuery = {
  cur_page: 1,
  page_size: 20,
  dict_name: '',
  dict_type: '',
  status: '',
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
  filters: {
    formatLoginTime(time) {
      let date = new Date(time * 1000)
      return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
    },
    status(status) {
      if (status == 0) return '禁用'
      if (status == 1) return '启用'
    },
  },
  methods: {
    handleSizeChange(val) {
      this.listQuery.cur_page = 1
      this.listQuery.page_size = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.cur_page = val
      this.getList()
    },
    getList() {
      operateLogList(this.listQuery).then((response) => {
        this.total = response.data.total
        this.list = response.data.list
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
