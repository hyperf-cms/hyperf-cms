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
            v-model="listQuery.album_name"
            class="input-width"
            placeholder="相册名称搜索："
            style="width:300px;"
            @keyup.enter.native="getList"
          ></el-input>
        </el-form-item>
        <el-form-item label="状态选择">
          <el-select
            v-model="listQuery.album_status"
            clearable
            class="input-width"
            placeholder="状态选择"
          >
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
        @click="handleAddAlbum"
      >添加相册</el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="albumTable" :data="list" style="width: 100%;" size="mini">
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
        <el-table-column
          label=" 相册状态"
          width="120"
          align="center"
          prop="album_status"
          :formatter="statusFormat"
        ></el-table-column>
        <el-table-column sortable label="创建时间" align="center">
          <template slot-scope="scope">{{scope.row.created_at}}</template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="300">
          <template slot-scope="scope">
            <el-button
              icon="el-icon-view"
              type="success"
              size="mini"
              @click="handleViewAlbum(scope.row)"
            >查看</el-button>
            <el-button
              icon="el-icon-edit"
              type="primary"
              size="mini"
              @click="handleEditAlbum(scope.row)"
            >编辑</el-button>
            <el-button
              icon="el-icon-delete"
              type="danger"
              size="mini"
              @click="handleDeleteAlbum(scope.row)"
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
    <album-detail ref="albumDetail" :albumDetailDialogData="albumDetailDialogData"></album-detail>
  </div>
</template>
<script>
import { albumList, deleteAlbum } from '@/api/blog/picture_module/album'
import AlbumDetail from './components/detail'
const defaultListQuery = {
  cur_page: 1,
  page_size: 20,
  album_status: null,
  album_name: '',
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
      typeOptions: [],
      albumDetailDialogData: {
        albumDetailDialogVisible: false,
        statusOptions: [],
        typeOptions: [],
        albumDetailTitle: '',
        isEdit: false,
        id: '',
      },
      albumShowDialogData: {
        albumShowDialogVisible: false,
        albumShowData: [],
      },
    }
  },
  created() {
    this.getDicts('blog_album_status').then((response) => {
      if (response.code == 200) this.statusOptions = response.data.list
    })
    this.getDicts('blog_album_type').then((response) => {
      if (response.code == 200) this.typeOptions = response.data.list
    })

    this.getList()
  },
  filters: {},
  methods: {
    updateView(e) {
      this.$forceUpdate()
    },
    handleViewAlbum(row) {
      this.$router.push({
        name: 'Api:blog/picture_module/photo/list-index',
        params: { photo_album: row.id },
      })
    },
    handleAddAlbum() {
      this.albumDetailDialogData.albumDetailDialogVisible = true
      this.albumDetailDialogData.statusOptions = this.statusOptions
      this.albumDetailDialogData.typeOptions = this.typeOptions
      this.albumDetailDialogData.albumDetailTitle = '添加相册'
      this.albumDetailDialogData.isEdit = false
      this.$refs['albumDetail'].getAlbumInfo()
    },
    handleEditAlbum(row) {
      this.albumDetailDialogData.albumDetailDialogVisible = true
      this.albumDetailDialogData.statusOptions = this.statusOptions
      this.albumDetailDialogData.typeOptions = this.typeOptions
      this.albumDetailDialogData.albumDetailTitle =
        '修改 "' + row.title + '" 相册'
      this.albumDetailDialogData.isEdit = true
      this.albumDetailDialogData.id = row.id
      this.$refs['albumDetail'].getAlbumInfo()
    },
    handleDeleteAlbum(row) {
      this.deleteAlbum(row.id)
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
        if (response.code == 200) {
          this.total = response.data.total
          this.list = response.data.list
          this.srcList = []
          for (let i = 0; i < this.list.length; i++) {
            this.srcList.push(this.list[i].album_cover)
          }
        }
      })
    },
    deleteAlbum(id) {
      this.$confirm('是否要进行该删除操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        deleteAlbum(id).then((response) => {
          if (response.code == 200) this.getList()
        })
      })
    },
    // 状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.album_status)
    },
    // 状态字典翻译
    typeFormat(row, column) {
      return this.selectDictLabel(this.typeFormat, row.album_type)
    },
  },
}
</script>
<style scoped>
.input-width {
  width: 203px;
}
</style>
