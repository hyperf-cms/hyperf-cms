<template>
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button style="float:right" type="primary" @click="handleSearchList()" size="small">查询搜索</el-button>
        <el-button style="float:right;margin-right: 15px" @click="handleResetSearch()" size="small">重置</el-button>
      </div>
      <div style="margin-top: 30px">
        <el-form :inline="true" :model="this.listQuery" size="small">
          <el-form-item label="项目：">
            <el-select v-model="listQuery.log_type" prop="log_type">
              <el-option label="Tracking" value="log"></el-option>
              <el-option label="Crontab Tracking" value="crontab_log"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <div class="table-container">
      <el-table
        ref="logTable"
        :data="list"
        style="width: 100%;"
        size="normal"
        border
        row-key="path"
        :tree-props="{children: 'children'}"
        @row-click="clickRowHandle"
      >
        <el-table-column label="日志路径">
          <template slot-scope="scope">{{scope.row.path}}</template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <div v-if="scope.row.type == 'file'">
              <el-button type="primary" size="mini" @click="handleViewDetail(scope.row)">详情</el-button>
              <el-button type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
            </div>
            <span v-else>-</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          layout="total,sizes,prev,pager,next,jumper"
          :current-page.sync="listQuery.cur_page"
          :page-size="listQuery.page_size"
          :page-sizes="[10,20,50,100,150,200]"
          :total="total"
        />
      </div>
    </div>
    <el-dialog class="log-dialog" title="日志内容" :visible.sync="logDialogVisible" :close-on-click-modal="false" width="80%">
      <el-table
        ref="logContentTable"
        :data="logList"
        size="normal"
        border
        height="650"
      >
        <el-table-column label="时间" prop="datetime" width="160"></el-table-column>
        <el-table-column label="环境" prop="env" width="100"></el-table-column>
        <el-table-column label="错误等级" prop="level" width="100"></el-table-column>
        <el-table-column label="内容" prop="message"></el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination
          background
          @size-change="handleFileSizeChange"
          @current-change="handleFileCurrentChange"
          layout="total,sizes,prev,pager,next,jumper"
          :current-page.sync="fileQuery.cur_page"
          :page-size="fileQuery.page_size"
          :page-sizes="[10,20,50,100,150,200]"
          :total="logTotal"
        />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getLogList,getLogFile,deleteLog } from '@/api/system/log';

const defaultListQuery = {
  cur_page: 1,
  page_size: 20,
  log_type: 'log',
};

const defaultFileQuery = {
  cur_page: 1,
  page_size: 20,
  file_type: '',
  file_path: '',
};

export default {
  name: "SystemLog",
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      fileQuery: Object.assign({}, defaultFileQuery),
      list: [],
      total: 0,
      logDialogVisible: false,
      logList: [],
      logTotal: 0,
    }
  },
  created() {
    this.getList();
  },
  methods: {
    clickRowHandle(row) {
      this.$refs.logTable.toggleRowExpansion(row);
    },
    handleResetSearch() {
      this.listQuery = Object.assign({}, defaultListQuery);
      this.getList();
    },
    handleSearchList() {
      this.listQuery.cur_page = 1;
      this.getList();
    },
    handleSizeChange(val) {
      this.listQuery.cur_page = 1;
      this.listQuery.page_size = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.cur_page = val;
      this.getList();
    },
    getList() {
      getLogList(this.listQuery).then(response => {
        this.list = response.data.list;
        this.total = response.data.total;
      });
    },
    handleFileSizeChange(val) {
      this.fileQuery.cur_page = 1;
      this.fileQuery.page_size = val;
      this.getLogFile();
    },
    handleFileCurrentChange(val) {
      this.fileQuery.cur_page = val;
      this.getLogFile();
    },
    handleViewDetail(row) {
      this.logDialogVisible = true;
      this.fileQuery.file_path = row.path;

      this.getLogFile();
    },
    getLogFile() {
      this.fileQuery.file_type = this.listQuery.log_type;
      getLogFile(this.fileQuery).then(response => {
        if (response.errorCode == 200) {
          this.logList = response.data.list;
          this.logTotal = response.data.total;
        }
      })
    },
    handleDelete(row) {
      this.$confirm('确认删除吗', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteLog({path: encodeURIComponent(row.path)}).then(response => {
          if (response.errorCode == 200) {
            this.getList();
          }
        })
      }).catch(err => {});
    }
  }
}
</script>

<style lang="scss" scoped>
.log-dialog >>> .el-dialog {
  margin-top: 10vh!important;
}

.log-dialog >>> .el-dialog__body::after {
  content: "";
  display: block;
  clear: both;
}
</style>