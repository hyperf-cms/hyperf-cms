<template>
  <div class="app-container">
    <conditional-filter
      :listQuery.sync="listQuery"
      :defaultListQuery="defaultListQuery"
      @getList="getList"
    >
      <template slot="extraForm">
        <el-form-item label="相册选择">
          <el-select
            v-model="listQuery.photo_album"
            clearable
            filterable
            class="input-width"
            placeholder="相册选择"
            @change="getList"
          >
            <el-option
              v-for="album in albumList"
              :key="album.id"
              :label="album.album_name"
              :value="album.id"
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
        @click="handleAddPhoto"
      >添加图片</el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="photoTable" :data="list" style="width: 100%;" size="mini">
        <el-table-column label="图片预览图" prop="photo_name" align="center" width="400">
          <template slot-scope="scope">
            <el-image
              fit="scale-down"
              style="width: 360px;height: 180px"
              :src="scope.row.photo_url"
              :preview-src-list="srcList"
            ></el-image>
          </template>
        </el-table-column>
        <el-table-column label="图片路径" align="center" prop="photo_url">
          <template slot-scope="scope">
            <span @click="copy(scope.row)" class="request_param">{{scope.row.photo_url}}</span>
          </template>
        </el-table-column>
        <el-table-column label="所属相册" align="center" width="200" prop="get_photo_album.album_name"></el-table-column>
        <el-table-column sortable label="创建时间" width="180" align="center">
          <template slot-scope="scope">{{scope.row.created_at}}</template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="140">
          <template slot-scope="scope">
            <el-button
              icon="el-icon-delete"
              type="danger"
              size="mini"
              @click="handleDeletePhoto(scope.row)"
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
    <photo-detail ref="photoDetail" :photoDetailDialogData="photoDetailDialogData"></photo-detail>
  </div>
</template>
<script>
import { photoList, deletePhoto } from '@/api/blog/picture_module/photo'
import { getAlbumOption } from '@/api/blog/picture_module/album'
import PhotoDetail from './components/detail'
import Clipboard from 'clipboard'
const defaultListQuery = {
  cur_page: 1,
  page_size: 20,
  photo_album: null,
}
export default {
  name: 'Api:blog/picture_module/photo/list-index',
  components: {
    PhotoDetail,
    Clipboard,
  },
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      defaultListQuery: Object.assign({}, defaultListQuery),
      list: [],
      albumList: [],
      srcList: [],
      total: 0,
      multipleSelection: [],
      statusOptions: [],
      typeOptions: [],
      photoDetailDialogData: {
        photoDetailDialogVisible: false,
        photoAlbumOption: [],
        photoDetailTitle: '',
      },
      photoShowDialogData: {
        photoShowDialogVisible: false,
        photoShowData: [],
      },
    }
  },
  created() {
    const photo_album = this.$route.params && this.$route.params.photo_album
    this.listQuery.photo_album = photo_album
    console.log(this.listQuery)
    this.getList()
    getAlbumOption().then((response) => {
      this.albumList = response.data.list
    })
  },
  filters: {},
  methods: {
    handleViewPhoto(row) {
      this.photoShowDialogData.photoShowData = row
      this.photoShowDialogData.photoShowDialogVisible = true
    },
    handleAddPhoto() {
      this.photoDetailDialogData.photoDetailDialogVisible = true
      this.photoDetailDialogData.photoAlbumOption = this.albumList
      this.photoDetailDialogData.photoDetailTitle = '添加图片'
      this.$refs['photoDetail'].getPhotoInfo()
    },
    handleDeletePhoto(row) {
      this.deletePhoto(row.id)
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
      photoList(this.listQuery).then((response) => {
        this.total = response.data.total
        this.list = response.data.list
        this.srcList = []
        for (let i = 0; i < this.list.length; i++) {
          this.srcList.push(this.list[i].photo_url)
        }
      })
    },
    deletePhoto(id) {
      this.$confirm('是否要进行该删除操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        deletePhoto(id).then((response) => {
          this.getList()
        })
      })
    },
    copy(row) {
      let clipboard = new Clipboard('.request_param', {
        text: function () {
          return row.photo_url
        },
      })
      clipboard.on('success', (e) => {
        this.$message({ message: '复制成功', showClose: true, type: 'success' })
        // 释放内存
        clipboard.destroy()
      })
      clipboard.on('error', (e) => {
        this.$message({ message: '复制失败,', showClose: true, type: 'error' })
        clipboard.destroy()
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
