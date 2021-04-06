<template>
  <div class="app-container">
    <conditional-filter
      :listQuery.sync="listQuery"
      :defaultListQuery="defaultListQuery"
      @getList="getList"
    >
      <template slot="extraForm">
        <el-form-item label="相册名称搜索：">
          <el-input
            v-model="listQuery.title"
            class="input-width"
            placeholder="相册名称搜索："
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
        @click="handleAddNotice"
      >添加相册</el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="noticeTable" :data="list" style="width: 100%;" size="mini">
        <el-table-column label="ID" align="center" width="120" prop="id"></el-table-column>
        <el-table-column label="相册预览图" prop="album_name" align="center" width="400">
          <template slot-scope="scope">
            <el-image
              fit="scale-down"
              style="width: 360px;height: 180px"
              :src="scope.row.album_cover"
              :preview-src-list="srcList"
            ></el-image>
          </template>
        </el-table-column>
        <el-table-column label="相册名" width="140" align="center" prop="album_name"></el-table-column>
        <el-table-column label="相册描述" width="250" align="center" prop="album_desc"></el-table-column>
        <el-table-column label="相册作者" width="120" align="center" prop="album_author"></el-table-column>
        <el-table-column label="浏览人数" width="120" align="center" prop="album_click_num"></el-table-column>
        <el-table-column label="相册排序" width="120" align="center" prop="album_sort"></el-table-column>
        <el-table-column sortable label="创建时间" width="160" align="center">
          <template slot-scope="scope">{{scope.row.created_at}}</template>
        </el-table-column>
        <el-table-column sortable label="更改时间" width="160" align="center">
          <template slot-scope="scope">{{scope.row.updated_at}}</template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="300">
          <template slot-scope="scope">
            <el-button
              icon="el-icon-view"
              type="success"
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

    <!-- 添加/修改相册 -->
    <album-detail ref="noticeDetail" :noticeDetailDialogData="noticeDetailDialogData"></album-detail>
  </div>
</template>
<script>
import {
  albumList,
  deleteNodeleteAlbumice,
} from '@/api/blog/picture_module/album'
import AlbumDetail from './components/detail'
const defaultListQuery = {
  cur_page: 1,
  page_size: 20,
  status: '',
  type: '',
}
export default {
  name: 'Api:blog/picture_module/album/list-index',
  components: {
    AlbumDetail,
  },
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      defaultListQuery: Object.assign({}, defaultListQuery),
      list: [],
      srcList: [],
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
      this.noticeDetailDialogData.noticeDetailTitle = '添加相册'
      this.noticeDetailDialogData.isEdit = false
      this.$refs['noticeDetail'].getNoticeInfo()
    },
    handleEditNotice(row) {
      this.noticeDetailDialogData.noticeDetailDialogVisible = true
      this.noticeDetailDialogData.statusOptions = this.statusOptions
      this.noticeDetailDialogData.noticeDetailTitle =
        '修改 "' + row.title + '" 相册'
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
      albumList(this.listQuery).then((response) => {
        this.total = response.data.total
        this.list = response.data.list
        this.srcList = []
        for (let i = 0; i < this.list.length; i++) {
          this.srcList.push(this.list[i].album_cover)
        }
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
