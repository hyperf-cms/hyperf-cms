<template>
  <div class="app-container">
    <conditional-filter
      :listQuery.sync="listQuery"
      :defaultListQuery="defaultListQuery"
      @getList="getList"
    >
      <template slot="extraForm">
        <el-form-item label="标题搜索：">
          <el-input
            v-model="listQuery.title"
            class="input-width"
            placeholder="标题搜索："
            style="width:400px;"
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
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-button
        style="float: right;"
        icon="el-icon-plus"
        type="primary"
        size="mini"
        @click="handleAddNotice"
      >添加通知</el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="noticeTable" :data="list" style="width: 100%;" size="mini">
        <el-table-column label="ID" align="center" width="120" prop="id"></el-table-column>
        <el-table-column label="标题" prop="title"></el-table-column>
        <el-table-column label="发布者" width="140" align="center" prop="get_user_name.desc"></el-table-column>
        <el-table-column label="状态" prop="status" width="140" :formatter="statusFormat"></el-table-column>
        <el-table-column label="发布时间" width="180" prop="public_time">
          <template slot-scope="scope">{{ parseTime(scope.row.public_time)}}</template>
        </el-table-column>
        <el-table-column label="创建时间" width="180" prop="created_at"></el-table-column>
        <el-table-column label="操作" align="center" width="300">
          <template slot-scope="scope">
            <el-button
              icon="el-icon-view"
              type="primary"
              size="mini"
              @click="handleViewNotice(scope.row)"
            >查看</el-button>
            <el-button
              icon="el-icon-edit"
              type="primary"
              size="mini"
              @click="handleEditNotice(scope.row)"
            >编辑</el-button>
            <el-button
              icon="el-icon-delete"
              type="danger"
              size="mini"
              @click="handleDeleteNotice(scope.row)"
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

    <!-- 添加/修改通知 -->
    <notice-detail ref="noticeDetail" :noticeDetailDialogData="noticeDetailDialogData"></notice-detail>

    <!-- 查看内容 -->
    <notice-show ref="noticeShow" :noticeShowDialogData="noticeShowDialogData"></notice-show>
  </div>
</template>
<script>
import { noticeList, deleteNotice } from '@/api/setting/system_module/notice'
import NoticeDetail from './components/noticeDetail'
import NoticeShow from './components/noticeShow'
const defaultListQuery = {
  cur_page: 1,
  page_size: 20,
  status: '',
  type: '',
}
export default {
  name: 'Api:setting/system_module/notice/list-index',
  components: {
    NoticeDetail,
    NoticeShow,
  },
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      defaultListQuery: Object.assign({}, defaultListQuery),
      list: [],
      total: 0,
      multipleSelection: [],
      statusOptions: [],
      noticeDetailDialogData: {
        noticeDetailDialogVisible: false,
        statusOptions: [],
        noticeDetailTitle: '',
        isEdit: false,
        id: '',
      },
      noticeShowDialogData: {
        noticeShowDialogVisible: false,
        noticeShowData: [],
      },
    }
  },
  created() {
    this.getDicts('sys_notice_status').then((response) => {
      this.statusOptions = response.data.list
    })

    this.getList()
  },
  filters: {},
  methods: {
    updateView(e) {
      this.$forceUpdate()
    },
    handleViewNotice(row) {
      this.noticeShowDialogData.noticeShowData = row
      this.noticeShowDialogData.noticeShowDialogVisible = true
    },
    handleAddNotice() {
      this.noticeDetailDialogData.noticeDetailDialogVisible = true
      this.noticeDetailDialogData.statusOptions = this.statusOptions
      this.noticeDetailDialogData.noticeDetailTitle = '添加通知'
      this.noticeDetailDialogData.isEdit = false
      this.$refs['noticeDetail'].getNoticeInfo()
    },
    handleEditNotice(row) {
      this.noticeDetailDialogData.noticeDetailDialogVisible = true
      this.noticeDetailDialogData.statusOptions = this.statusOptions
      this.noticeDetailDialogData.noticeDetailTitle =
        '修改 "' + row.title + '" 通知'
      this.noticeDetailDialogData.isEdit = true
      this.noticeDetailDialogData.id = row.id
      this.$refs['noticeDetail'].getNoticeInfo()
    },
    handleDeleteNotice(row) {
      this.deleteNotice(row.id)
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
      noticeList(this.listQuery).then((response) => {
        this.total = response.data.total
        this.list = response.data.list
      })
    },

    deleteNotice(id) {
      this.$confirm('是否要进行该删除操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        deleteNotice(id).then((response) => {
          this.getList()
        })
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
