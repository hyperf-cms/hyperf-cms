<template> 
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button
          style="float:right;"
          type="primary"
          @click="handleSearchList()"
          size="small">
          查询搜索
        </el-button>
        <el-button
          style="float:right;margin-right: 15px"
          @click="handleResetSearch()"
          size="small">
          重置
        </el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small">
          <el-form-item label="时间筛选：">
            <el-date-picker
              v-model="listQuery.time"
              type="daterange"
              :picker-options="pickerOptions"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              align="right">
            </el-date-picker>
          </el-form-item>
           <el-form-item label="精确查找">
            <el-input v-model="listQuery.uid" class="input-width" placeholder="请输入用户uid"></el-input>
          </el-form-item>
           <el-form-item label="操作查找">
            <el-input v-model="listQuery.action" class="input-width" placeholder="输入操作"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-button type="info" size="mini" @click="handleGetExport" style="float: right;">查看导出列表</el-button>
      <el-button type="warning" size="mini" @click="handleExport" style="float: right;margin-right: 10px;">导出所有记录</el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="orderTable"
                :data="list"
                style="width: 100%;"
                @selection-change="handleSelectionChange"
                v-loading="listLoading" border>
        <el-table-column label="用户Id"  width="90"  sortable prop="ID">
          <template slot-scope="scope">{{scope.row.uid}}</template>
        </el-table-column>
        <el-table-column label="用户名" width="180" >
          <template slot-scope="scope">{{scope.row.username}}</template>
        </el-table-column>
        <el-table-column label="操作昵称" width="180" >
          <template slot-scope="scope">{{scope.row.operator}}</template>
        </el-table-column>
        <el-table-column label="操作" width="150" >
          <template slot-scope="scope">{{scope.row.action}}</template>
        </el-table-column>
        <el-table-column label="结果" width="150" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{scope.row.dealResult}}</template>
        </el-table-column>
        <el-table-column label="请求参数" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span @click="copy(scope.row)" class="request_param">{{scope.row.data}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作时间"  width="180" >
          <template slot-scope="scope">{{scope.row.created_at | formatCreateTime }}</template>
        </el-table-column>
      </el-table>
    </div>
     <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes,prev, pager, next,jumper"
        :current-page.sync="listQuery.cur_page"
        :page-size="listQuery.page_size"
        :page-sizes="[10,20,30,50,80,100]"
        :total="total">
      </el-pagination>
    </div>
    <!-- 日志导出列表 -->
    <el-dialog
      title="日志导出列表"
      :visible.sync="exportLogDialog"
      width="60%"
      :close-on-click-modal="false"
    >
      <el-button type="danger" size="mini" @click="handleClearExport" style="margin-bottom: 15px;">清除所有文件</el-button>
      <el-table ref="backupLogTable" size="mini" :data="exportLogList" style="width: 100%;" border>
        <el-table-column label="文件名称">
          <template slot-scope="scope">{{scope.row.name}}</template>
        </el-table-column>
        <el-table-column label="操作" width="160">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="handleDownloadFile(scope.row.url)">下载</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>
<script>
  import { dateSelection } from "@/mixins/dateSelection";
  import {getOperateLog,exportOperateLog,getExportOperateLog,clearExportOperateLog} from '@/api/system/operateLog'
  import {formatDate} from '@/utils/date';
  import Clipboard from 'clipboard'
  const defaultListQuery = {
    cur_page:1,
    page_size:20,
    time: null,
    uid: null,
    action: null,
  };
  export default {
    name: "rechargeDailySum",
    mixins: [dateSelection],
    components:{},
    data() {
      return {
        listQuery: Object.assign({}, defaultListQuery),
        listLoading: true,
        list: null,
        total: null,
        multipleSelection: [],
        exportLogDialog: false,
        exportLogList: [],
      }
    },
    created() {
      this.getList();
    },
    filters: {
      formatCreateTime(time) {
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
      },
    },
    methods: {
      handleResetSearch() {
        this.listQuery = Object.assign({}, defaultListQuery);
        this.getList();
      },
      handleSearchList() {
        this.listQuery.cur_page = 1;
        this.getList();
      },
      handleSelectionChange(val){
        this.multipleSelection = val;
      },
      handleSizeChange(val){
        this.listQuery.cur_page = 1;
        this.listQuery.page_size = val;
        this.getList();
      },
      handleCurrentChange(val){
        this.listQuery.cur_page = val;
        this.getList();
      },
      copy(row) {
        let clipboard = new Clipboard('.request_param', {
          text: function() {
            return row.data
          }
        })
        clipboard.on('success', e => {
          this.$message({ message: '复制成功', showClose: true, type: 'success' })
          // 释放内存
          clipboard.destroy()
        })
        clipboard.on('error', e => {
          this.$message({ message: '复制失败,', showClose: true, type: 'error' })
          clipboard.destroy()
        })
      },
      getList() {
        this.listLoading = true;
        getOperateLog(this.listQuery).then(response => {
          this.listLoading = false;
          this.list = response.data.list;
          this.total = response.data.total;
        });
      },
      handleExport() {
        this.$confirm("确认导出记录吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          exportOperateLog();
        })
        .catch((err) => {});
      },
      handleGetExport() {
        this.exportLogDialog = true;
        getExportOperateLog().then(response => {
        if (response.errorCode == 200) {
          this.exportLogList = response.data.list;
        }
      });
      },
      handleClearExport() {
        this.$confirm("确认清理导出的日志文件吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          clearExportOperateLog().then(response => {
            if (response.errorCode == 200) {
              this.exportLogDialog = false;
            }
          });
        })
        .catch((err) => {});
      },
      handleDownloadFile(url) {
        window.open(url, '_blank');
      }
    }

  }
</script>
<style scoped>
  .input-width {
    width: 203px;
  }

  .operate-container >>> .el-card__body::before,
  .operate-container >>> .el-card__body::after {
    content: '';
    display: block;
    clear: both;
  }
</style>


