<template>
  <div class="app-container">
    <conditional-filter
      :listQuery.sync="listQuery"
      :defaultListQuery="defaultListQuery"
      :columns.sync="columns"
      :list="list"
      :multipleSelection="multipleSelection"
      @getList="getList"
      @handleAdd="handleAdd"
      @handleBatchDelete="handleBatchDelete"
      excelTitle="通知管理"
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
    <div class="table-container">
      <el-table
        ref="noticeTable"
        :data="list"
        style="width: 100%;"
        size="mini"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="ID" align="center" width="120" prop="id" v-if="columns[0].visible"></el-table-column>
        <el-table-column label="标题" prop="title" v-if="columns[1].visible"></el-table-column>
        <el-table-column
          label="发布者"
          width="140"
          align="center"
          prop="get_user_name.desc"
          v-if="columns[2].visible"
        ></el-table-column>
        <el-table-column
          label="状态"
          prop="status"
          width="140"
          :formatter="statusFormat"
          v-if="columns[3].visible"
        ></el-table-column>
        <el-table-column label="发布时间" width="180" prop="public_time" v-if="columns[4].visible">
          <template slot-scope="scope">{{ parseTime(scope.row.public_time)}}</template>
        </el-table-column>
        <el-table-column label="创建时间" width="180" prop="created_at" v-if="columns[5].visible"></el-table-column>
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
              @click="handleEdit(scope.row)"
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
      columns: [
        { key: 0, field: 'id', label: `ID`, visible: true },
        { key: 1, field: 'title', label: `标题`, visible: true },
        { key: 2, field: 'get_user_name.desc', label: `发布者`, visible: true },
        { key: 3, field: 'status', label: `状态`, visible: true },
        { key: 4, field: 'public_time', label: `发布时间`, visible: true },
        { key: 5, field: 'created_at', label: `创建时间`, visible: true },
      ],
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
      if (response.code == 200) this.statusOptions = response.data.list
    })

    this.getList()
  },
  filters: {},
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleViewNotice(row) {
      this.noticeShowDialogData.noticeShowData = row
      this.noticeShowDialogData.noticeShowDialogVisible = true
    },
    handleAdd() {
      this.noticeDetailDialogData.noticeDetailDialogVisible = true
      this.noticeDetailDialogData.statusOptions = this.statusOptions
      this.noticeDetailDialogData.noticeDetailTitle = '添加通知'
      this.noticeDetailDialogData.isEdit = false
      this.$refs['noticeDetail'].getNoticeInfo()
    },
    handleEdit(row) {
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
    handleBatchDelete() {
      let id_arr = []
      for (let i = 0; i < this.multipleSelection.length; i++) {
        id_arr.push(this.multipleSelection[i].id)
      }
      this.deleteNotice(id_arr, true)
    },
    getList() {
      noticeList(this.listQuery).then((response) => {
        if (response.code == 200) {
          this.total = response.data.total
          this.list = response.data.list
        }
      })
    },
    deleteNotice(id, isBatch = false) {
      this.$confirm('是否要进行该删除操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        if (isBatch) {
          deleteNotice(0, { id: id }).then((response) => {
            if (response.code == 200) {
              this.multipleSelection = []
              this.getList()
            }
          })
        } else {
          deleteNotice(id).then((response) => {
            if (response.code == 200) {
              this.multipleSelection = []
              this.getList()
            }
          })
        }
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
