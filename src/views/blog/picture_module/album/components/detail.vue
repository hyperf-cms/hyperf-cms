<template>
  <el-dialog
    :title="albumDetailDialogData.albumDetailTitle"
    :visible.sync="albumDetailDialogData.albumDetailDialogVisible"
    width="800px"
    :close-on-click-modal="false"
  >
    <el-form :model="album" :rules="rules" ref="albumForm" label-width="150px">
      <el-form-item label="相册名称：" prop="album_name">
        <el-input
          v-model="album.album_name"
          auto-complete="off"
          size="medium"
          placeholder="请输入标题"
          style="width:500px"
        ></el-input>
      </el-form-item>
      <el-form-item label="相册描述：" prop="album_desc">
        <el-input
          v-model="album.album_desc"
          auto-complete="off"
          size="medium"
          placeholder="请输入相册描述"
          style="width:500px"
        ></el-input>
      </el-form-item>
      <el-form-item label="相册作者：" prop="album_author">
        <el-input
          v-model="album.album_author"
          auto-complete="off"
          size="medium"
          placeholder="请输入相册作者"
          style="width:500px"
        ></el-input>
      </el-form-item>
      <el-form-item label="相册类型：" prop="album_type">
        <el-select
          v-model="album.album_type"
          clearable
          class="input-width"
          size="medium"
          placeholder="相册类型"
        >
          <el-option
            v-for="dict in albumDetailDialogData.typeOptions"
            :key="dict.dict_value"
            :label="dict.dict_label"
            :value="dict.dict_value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="相册问题：" prop="album_question" v-if="album.album_type == 2">
        <el-input
          v-model="album.album_question"
          auto-complete="off"
          size="medium"
          placeholder="请输入相册问题"
          style="width:500px"
        ></el-input>
      </el-form-item>
      <el-form-item label="相册密码" prop="album_answer" v-if="album.album_type == 2">
        <el-input
          v-model="album.album_answer"
          auto-complete="off"
          size="medium"
          placeholder="请输入相册密码"
          style="width:500px"
        ></el-input>
      </el-form-item>
      <el-form-item label="相册排序：" prop="album_sort">
        <el-input-number
          v-model="album.album_sort"
          auto-complete="off"
          size="medium"
          placeholder="请输入相册排序"
          :max="99"
          :min="1"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="相册封面：" prop="album_cover">
        <single-upload v-model="album.album_cover" :savePath="album/album_cover"></single-upload>
      </el-form-item>
      <el-form-item label="相册状态：" prop="album_status">
        <el-radio
          v-model="album.album_status"
          v-for="dict in albumDetailDialogData.statusOptions"
          :key="dict.dict_value"
          :label="dict.dict_value"
        >{{ dict.dict_label}}</el-radio>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="onSubmit('albumForm')">提交</el-button>
      <el-button v-if="!albumDetailDialogData.isEdit" @click="resetForm('albumForm')">重置</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {
  createAlbum,
  updateAlbum,
  editAlbum,
} from '@/api/blog/picture_module/album'
import SingleUpload from '@/components/Upload/singleUpload'
const defaultAlbum = {
  album_name: '',
  album_desc: '',
  album_cover: '',
  album_type: 1,
  album_author: '',
  album_status: 1,
  album_question: '',
  album_answer: '',
  album_sort: '',
}
export default {
  name: 'AlbumDetail',
  props: {
    albumDetailDialogData: {
      type: Object,
      default: {},
    },
  },
  components: {
    SingleUpload,
  },
  data() {
    return {
      album: Object.assign({}, defaultAlbum),
      rules: {
        album_name: [
          { required: true, message: '请填写相册名称', trigger: 'blur' },
          {
            min: 2,
            max: 60,
            message: '长度在 2 到 60 个字符',
            trigger: 'blur',
          },
        ],
        album_status: [
          { required: true, message: '请选择状态', trigger: 'blur' },
        ],
        album_type: [
          { required: true, message: '请选择类型', trigger: 'blur' },
        ],
      },
    }
  },
  created() {},
  methods: {
    getAlbumInfo() {
      this.album = Object.assign({}, defaultAlbum)
      //判断是否为修改
      if (this.albumDetailDialogData.isEdit == true) {
        editAlbum(this.albumDetailDialogData.id).then((response) => {
          if (response.code == 200) {
            let albumData = response.data.list
            this.album = Object.assign({}, albumData)
          }
        })
      }
    },
    onSubmit(albumForm) {
      this.$refs[albumForm].validate((valid) => {
        if (valid) {
          this.$confirm('是否提交数据', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }).then(() => {
            if (this.albumDetailDialogData.isEdit) {
              updateAlbum(this.album.id, this.album).then((response) => {
                if (response.code == 200) {
                  this.$refs[albumForm].resetFields()
                  this.$parent.getList()
                  this.albumDetailDialogData.albumDetailDialogVisible = false
                }
              })
            } else {
              createAlbum(this.album).then((response) => {
                if (response.code == 200) {
                  this.$refs[albumForm].resetFields()
                  this.album = Object.assign({}, defaultAlbum)
                  this.$parent.getList()
                  this.albumDetailDialogData.albumDetailDialogVisible = false
                }
              })
            }
          })
        } else {
          this.$message({
            message: '验证失败',
            type: 'error',
            duration: 1000,
          })
          return false
        }
      })
    },
    resetForm(albumForm) {
      this.$refs[albumForm].resetFields()
      this.brand = Object.assign({}, defaultAlbum)
    },
  },
}
</script>

<style>
</style>
