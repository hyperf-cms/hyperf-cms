<template>
  <div class="app-container" style="margin-top: -35px">
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
    </el-card>
    <div class="table-container">
      <el-table ref="demandTable" :data="operateLog.list" style="width: 100%;" size="small">
        <el-table-column label="ID" width="60" align="center">
          <template slot-scope="scope">{{ scope.row.id}}</template>
        </el-table-column>
        <el-table-column label="用户名" width="180">
          <template slot-scope="scope">{{scope.row.username}}</template>
        </el-table-column>
        <el-table-column label="操作昵称" width="180">
          <template slot-scope="scope">{{scope.row.operator}}</template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">{{scope.row.action}}</template>
        </el-table-column>
        <el-table-column label="结果" width="150" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{scope.row.response_result}}</template>
        </el-table-column>
        <el-table-column label="请求参数" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{scope.row.data}}</template>
        </el-table-column>
        <el-table-column label="操作时间" width="180">
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
        :page-size.sync="listQuery.page_size"
        :page-sizes="[10,20,30,50,80,100]"
        :total="operateLog.total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OperateLog',
  props: {
    operateLog: {
      type: Array,
      default: [],
    },
    listQuery: {
      type: Object,
      default: {},
    },
  },
  methods: {
    handleSizeChange(val) {
      this.listQuery.cur_page = 1
      this.listQuery.page_size = val
      this.$parent().getHomeData()
    },
    handleCurrentChange(val) {
      this.listQuery.cur_page = val
      this.$parent().getHomeData()
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
