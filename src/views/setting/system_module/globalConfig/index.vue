<template>
  <div class="app-container">
    <conditional-filter
      :listQuery.sync="listQuery"
      :defaultListQuery="defaultListQuery"
      @getList="getList"
    >
      <template slot="extraForm">
        <el-form-item label="名称搜索：">
          <el-input
            v-model="listQuery.name"
            class="input-width"
            placeholder="名称搜索："
            style="width:400px;"
            @keyup.enter.native="getList"
          ></el-input>
        </el-form-item>
        <el-form-item label="KeyName搜索：">
          <el-input
            v-model="listQuery.name"
            class="input-width"
            placeholder="KeyName搜索："
            style="width:400px;"
            @keyup.enter.native="getList"
          ></el-input>
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
        @click="handleAddGlobalConfig"
      >添加全局配置</el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="globalConfigTable" :data="list" style="width: 100%;" size="mini">
        <el-table-column label="ID" align="center" width="120" prop="id"></el-table-column>
        <el-table-column label="名称" align="center" prop="name" width="200"></el-table-column>
        <el-table-column label="KeyName" align="center" prop="key_name" width="150"></el-table-column>
        <el-table-column label="数据" align="center" prop="data" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="备注" align="center" prop="remark"></el-table-column>
        <el-table-column label="创建时间" width="180" align="center" prop="created_at"></el-table-column>
        <el-table-column label="操作" align="center" width="300">
          <template slot-scope="scope">
            <el-button
              icon="el-icon-edit"
              type="primary"
              size="mini"
              @click="handleEditGlobalConfig(scope.row)"
            >编辑</el-button>
            <el-button
              icon="el-icon-delete"
              type="danger"
              size="mini"
              @click="handleDeleteGlobalConfig(scope.row)"
            >删除</el-button>
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

    <!-- 添加/修改全局配置 -->
    <global-config-detail
      ref="globalConfigDetail"
      :globalConfigDetailDialogData="globalConfigDetailDialogData"
    ></global-config-detail>
  </div>
</template>
<script>
import {
  globalConfigList,
  deleteGlobalConfig,
} from '@/api/setting/system_module/globalConfig'
import GlobalConfigDetail from './components/GlobalConfigDetail'
const defaultListQuery = {
  cur_page: 1,
  page_size: 20,
  name: '',
  key_name: '',
}
export default {
  name: 'Api:setting/system_module/globalConfig/list-index',
  components: {
    GlobalConfigDetail,
  },
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      defaultListQuery: Object.assign({}, defaultListQuery),
      list: [],
      total: 0,
      multipleSelection: [],
      globalConfigDetailDialogData: {
        globalConfigDetailDialogVisible: false,
        statusOptions: [],
        globalConfigDetailTitle: '',
        isEdit: false,
        id: '',
      },
    }
  },
  created() {
    this.getList()
  },
  filters: {},
  methods: {
    handleAddGlobalConfig() {
      this.globalConfigDetailDialogData.globalConfigDetailDialogVisible = true
      this.globalConfigDetailDialogData.statusOptions = this.statusOptions
      this.globalConfigDetailDialogData.globalConfigDetailTitle = '添加全局配置'
      this.globalConfigDetailDialogData.isEdit = false
      this.$refs['globalConfigDetail'].getGlobalConfigInfo()
    },
    handleEditGlobalConfig(row) {
      this.globalConfigDetailDialogData.globalConfigDetailDialogVisible = true
      this.globalConfigDetailDialogData.statusOptions = this.statusOptions
      this.globalConfigDetailDialogData.globalConfigDetailTitle =
        '修改 "' + row.title + '" 全局配置'
      this.globalConfigDetailDialogData.isEdit = true
      this.globalConfigDetailDialogData.id = row.id
      this.$refs['globalConfigDetail'].getGlobalConfigInfo()
    },
    handleDeleteGlobalConfig(row) {
      this.deleteGlobalConfig(row.id)
    },
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
      globalConfigList(this.listQuery).then((response) => {
        this.total = response.data.total
        this.list = response.data.list
      })
    },

    deleteGlobalConfig(id) {
      this.$confirm('是否要进行该删除操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        deleteGlobalConfig(id).then((response) => {
          this.getList()
        })
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
