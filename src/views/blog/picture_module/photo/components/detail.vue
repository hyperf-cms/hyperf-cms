<template>
  <el-dialog
    :title="photoDetailDialogData.photoDetailTitle"
    :visible.sync="photoDetailDialogData.photoDetailDialogVisible"
    width="700px"
    :close-on-click-modal="false"
  >
    <el-form :model="photo" :rules="rules" ref="photoForm" label-width="180px">
      <el-form-item label="相册类型：" prop="photo_album">
        <el-select
          v-model="photo.photo_album"
          clearable
          class="input-width"
          size="medium"
          placeholder="相册类型"
        >
          <el-option
            v-for="album in photoDetailDialogData.photoAlbumOption"
            :key="album.id"
            :label="album.album_name"
            :value="album.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="图片上传：" prop="photo_type">
        <multi-upload v-model="photo.photo_url" :savePath="photo"></multi-upload>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="onSubmit('photoForm')">提交</el-button>
      <el-button v-if="!photoDetailDialogData.isEdit" @click="resetForm('photoForm')">重置</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {
  createPhoto,
  updatePhoto,
  editPhoto,
} from '@/api/blog/picture_module/photo'
import MultiUpload from '@/components/Upload/multiUpload'
const defaultPhoto = {
  photo_album: '',
  photo_url: '',
}
export default {
  name: 'PhotoDetail',
  props: {
    photoDetailDialogData: {
      type: Object,
      default: {},
    },
  },
  components: {
    MultiUpload,
  },
  data() {
    return {
      photo: Object.assign({}, defaultPhoto),
      rules: {
        photo_album: [
          { required: true, message: '请选择相册类型', trigger: 'blur' },
        ],
      },
    }
  },
  created() {},
  methods: {
    getPhotoInfo() {
      this.photo = Object.assign({}, defaultPhoto)
      //判断是否为修改
      if (this.photoDetailDialogData.isEdit == true) {
        editPhoto(this.photoDetailDialogData.id).then((response) => {
          let photoData = response.data.list
          this.photo = Object.assign({}, photoData)
        })
      }
    },
    onSubmit(photoForm) {
      this.$refs[photoForm].validate((valid) => {
        if (valid) {
          this.$confirm('是否提交数据', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }).then(() => {
            if (this.photoDetailDialogData.isEdit) {
              updatePhoto(this.photo.id, this.photo).then((response) => {
                this.$refs[photoForm].resetFields()
                this.$parent.getList()
                this.photoDetailDialogData.photoDetailDialogVisible = false
              })
            } else {
              createPhoto(this.photo).then((response) => {
                this.$refs[photoForm].resetFields()
                this.photo = Object.assign({}, defaultPhoto)
                this.$parent.getList()
                this.photoDetailDialogData.photoDetailDialogVisible = false
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
    resetForm(photoForm) {
      this.$refs[photoForm].resetFields()
      this.brand = Object.assign({}, defaultPhoto)
    },
  },
}
</script>

<style>
</style>
