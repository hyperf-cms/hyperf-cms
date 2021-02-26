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
        <el-table-column label="请求参数" prop="data" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span @click="copy(scope.row)" class="request_param">{{scope.row.data}}</span>
          </template>
        </el-table-column>
        <el-table-column label="请求结果" prop="dealResult" align="center">
          <template slot-scope="scope">{{scope.row.dealResult}}</template>
        </el-table-column>
        <el-table-column label="操作时间" prop="created_at" align="center" width="180"></el-table-column>
        <el-table-column label="操作" align="center" width="150">
          <template slot-scope="scope">
            <el-button
              icon="el-icon-edit"
              type="primary"
              size="mini"
              @click="handleEditDictType(scope.$index, scope.row)"
            >编辑</el-button>
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

    <!-- 添加/修改字典类型 -->
    <dictionary-detail
      ref="dictionaryDetail"
      :dictionaryDetailDialogData="dictionaryDetailDialogData"
    ></dictionary-detail>
  </div>
</template>
<script>
import { operateLogList } from '@/api/setting/log_module/operateLog'
import { formatDate } from '@/utils/date'
// import DictionaryDetail from './components/dictionaryDetail'
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
    // DictionaryDetail,
  },
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      defaultListQuery: Object.assign({}, defaultListQuery),
      list: [],
      total: 0,
      multipleSelection: [],
      dictionaryDetailDialogData: {
        dictionaryDetailDialogVisible: false,
        dictionaryDetailTitle: '',
        isEdit: false,
        dict_id: '',
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
    updateView(e) {
      this.$forceUpdate()
    },
    handleAddDictType() {
      this.dictionaryDetailDialogData.dictionaryDetailDialogVisible = true
      this.dictionaryDetailDialogData.dictionaryDetailTitle = '添加字典类型'
      this.dictionaryDetailDialogData.isEdit = false
      this.$refs['dictionaryDetail'].getDictTypeInfo()
    },
    handleEditDictType(index, row) {
      console.log(row)
      this.dictionaryDetailDialogData.dictionaryDetailDialogVisible = true
      this.dictionaryDetailDialogData.dictionaryDetailTitle =
        '修改 "' + row.dict_name + '" 字典类型'
      this.dictionaryDetailDialogData.isEdit = true
      this.dictionaryDetailDialogData.dict_id = row.dict_id
      this.$refs['dictionaryDetail'].getDictTypeInfo()
    },
    handleDeleteDictType(index, row) {
      this.deleteDictType(row.dict_id)
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
      operateLogList(this.listQuery).then((response) => {
        this.total = response.data.total
        this.list = response.data.list
      })
    },

    deleteDictType(id) {
      this.$confirm('是否要进行该删除操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        deleteDictType(id).then((response) => {
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
