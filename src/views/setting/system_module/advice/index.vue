<template>
  <div class="app-container">
    <conditional-filter
      :listQuery.sync="listQuery"
      :defaultListQuery="defaultListQuery"
      @getList="getList"
    >
      <template slot="extraForm">
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
        <el-form-item label="类型选择">
          <el-select v-model="listQuery.type" clearable class="input-width" placeholder="类型选择">
            <el-option
              v-for="dict in typeOptions"
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
        @click="handleAddAdvice"
      >添加系统建议</el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="adviceTable" :data="list" style="width: 100%;" size="mini">
        <el-table-column label="ID" align="center" width="120" prop="id"></el-table-column>
        <el-table-column label="标题" prop="title"></el-table-column>
        <el-table-column label="发布者" width="140" align="center" prop="get_user_name.desc"></el-table-column>
        <el-table-column
          label="状态"
          align="center"
          prop="status"
          width="140"
          :formatter="statusFormat"
        ></el-table-column>
        <el-table-column label="类别" align="center" prop="type" width="140" :formatter="typeFormat"></el-table-column>
        <el-table-column label="创建时间" width="180" prop="created_at"></el-table-column>
        <el-table-column label="操作" align="center" width="400">
          <template slot-scope="scope">
            <el-button
              icon="el-icon-view"
              type="primary"
              size="mini"
              @click="handleViewAdvice(scope.row)"
            >查看</el-button>
            <el-button
              icon="el-icon-edit"
              type="primary"
              size="mini"
              @click="handleEditAdvice(scope.row)"
            >编辑</el-button>
            <el-button
              icon="el-icon-finished"
              type="primary"
              size="mini"
              @click="handleReplyAdvice(scope.row)"
            >回复</el-button>
            <el-button
              icon="el-icon-delete"
              type="danger"
              size="mini"
              @click="handleDeleteAdvice(scope.row)"
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

    <!-- 添加/修改系统建议 -->
    <advice-detail ref="adviceDetail" :adviceDetailDialogData="adviceDetailDialogData"></advice-detail>

    <!-- 查看内容 -->
    <advice-show ref="adviceShow" :adviceShowDialogData="adviceShowDialogData"></advice-show>

    <!-- 回复内容 -->
    <advice-reply ref="adviceReply" :adviceReplyDialogData="adviceReplyDialogData"></advice-reply>
  </div>
</template>
<script>
import { adviceList, deleteAdvice } from '@/api/setting/system_module/advice'
import AdviceDetail from './components/adviceDetail'
import AdviceShow from './components/adviceShow'
import AdviceReply from './components/adviceReply'
const defaultListQuery = {
  cur_page: 1,
  page_size: 20,
  status: '',
  type: '',
}
export default {
  name: 'Api:setting/system_module/advice/list-index',
  components: {
    AdviceDetail,
    AdviceShow,
    AdviceReply,
  },
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      defaultListQuery: Object.assign({}, defaultListQuery),
      list: [],
      total: 0,
      multipleSelection: [],
      statusOptions: [],
      typeOptions: [],
      adviceDetailDialogData: {
        adviceDetailDialogVisible: false,
        typeOptions: [],
        adviceDetailTitle: '',
        isEdit: false,
        id: '',
      },
      adviceShowDialogData: {
        adviceShowDialogVisible: false,
        adviceShowData: [],
      },
      adviceReplyDialogData: {
        adviceReplyDialogVisible: false,
        adviceReplyTitle: '',
        id: '',
        statusOptions: [],
      },
    }
  },
  created() {
    this.getDicts('sys_advice_status').then((response) => {
      if (response.code == 200) this.statusOptions = response.data.list
    })
    this.getDicts('sys_advice_type').then((response) => {
      if (response.code == 200) this.typeOptions = response.data.list
    })
    this.getList()
  },
  filters: {},
  methods: {
    updateView(e) {
      this.$forceUpdate()
    },
    handleViewAdvice(row) {
      this.adviceShowDialogData.adviceShowData = row
      this.adviceShowDialogData.adviceShowDialogVisible = true
    },
    handleReplyAdvice(row) {
      this.adviceReplyDialogData.id = row.id
      this.adviceReplyDialogData.statusOptions = this.statusOptions
      this.adviceReplyDialogData.adviceReplyTitle =
        '回复   ' + '"' + row.title + '"'
      this.adviceReplyDialogData.adviceReplyDialogVisible = true
      this.$refs['adviceReply'].getAdviceInfo()
    },
    handleAddAdvice() {
      this.adviceDetailDialogData.adviceDetailDialogVisible = true
      this.adviceDetailDialogData.typeOptions = this.typeOptions
      this.adviceDetailDialogData.adviceDetailTitle = '添加系统建议'
      this.adviceDetailDialogData.isEdit = false
      this.$refs['adviceDetail'].getAdviceInfo()
    },
    handleEditAdvice(row) {
      this.adviceDetailDialogData.adviceDetailDialogVisible = true
      this.adviceDetailDialogData.typeOptions = this.typeOptions
      this.adviceDetailDialogData.adviceDetailTitle =
        '修改 "' + row.title + '" 系统建议'
      this.adviceDetailDialogData.isEdit = true
      this.adviceDetailDialogData.id = row.id
      this.$refs['adviceDetail'].getAdviceInfo()
    },
    handleDeleteAdvice(row) {
      this.deleteAdvice(row.id)
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
      adviceList(this.listQuery).then((response) => {
        if (response.code == 200) {
          this.total = response.data.total
          this.list = response.data.list
        }
      })
    },

    deleteAdvice(id) {
      this.$confirm('是否要进行该删除操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        deleteAdvice(id).then((response) => {
          if (response.code == 200) this.getList()
        })
      })
    },
    // 状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status)
    },
    // 类型字典翻译
    typeFormat(row, column) {
      return this.selectDictLabel(this.typeOptions, row.type)
    },
  },
}
</script>
<style scoped>
.input-width {
  width: 203px;
}
</style>
