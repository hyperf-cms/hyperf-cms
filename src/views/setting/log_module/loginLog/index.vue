<template>
  <div class="app-container">
    <conditional-filter
      :listQuery.sync="listQuery"
      :defaultListQuery="defaultListQuery"
      @getList="getList"
    >
      <template slot="extraForm">
        <el-form-item label="登陆地址：">
          <el-input
            v-model="listQuery.login_ip"
            class="input-width"
            placeholder="请填写登陆地址："
            @keyup.enter.native="getList"
          ></el-input>
        </el-form-item>
        <el-form-item label="用户名称">
          <el-input
            v-model="listQuery.username"
            class="input-width"
            placeholder="请填写用户名称"
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
            v-model="listQuery.login_date"
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
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
    </el-card>
    <div class="table-container">
      <el-table ref="dictTypeTable" :data="list" style="width: 100%;" size="mini">
        <el-table-column label="日志编号" width="100" align="center" prop="id"></el-table-column>
        <el-table-column label="用户名" width="150" align="center" prop="username"></el-table-column>
        <el-table-column label="登陆地址" width="220" align="center" prop="login_ip"></el-table-column>
        <el-table-column label="登陆地点" width="220" align="center" prop="login_address"></el-table-column>
        <el-table-column label="浏览器" align="center" prop="login_browser"></el-table-column>
        <el-table-column label="操作系统" align="center" prop="os"></el-table-column>
        <el-table-column label="响应状态码" prop="response_code" align="center" width="120"></el-table-column>
        <el-table-column
          label="响应结果"
          prop="response_result"
          align="login_ip"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column label="登陆时间" prop="login_date" align="center" width="180"></el-table-column>
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
  </div>
</template>
<script>
import { loginLogList } from '@/api/setting/log_module/loginLog'
const defaultListQuery = {
  cur_page: 1,
  page_size: 20,
  login_ip: '',
  username: '',
  status: '',
  login_date: '',
}
export default {
  name: 'Api:setting/system_module/login_log/list-index',
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      defaultListQuery: Object.assign({}, defaultListQuery),
      list: [],
      total: 0,
      multipleSelection: [],
    }
  },
  created() {
    this.getList()
  },
  filters: {},
  methods: {
    getList() {
      loginLogList(this.listQuery).then((response) => {
        this.total = response.data.total
        this.list = response.data.list
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
