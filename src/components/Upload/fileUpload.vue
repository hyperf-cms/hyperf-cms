<template>
  <div>
    <el-upload
      :action="action"
      :data="dataObj"
      :headers="headers"
      list-type="text"
      :multiple="false"
      :show-file-list="showFileList"
      :file-list="fileList"
      :before-upload="handleBeforeUpload"
      :on-remove="handleRemove"
      :on-success="handleUploadSuccess"
      :on-preview="handlePreview"
    >
      <el-button size="small" type="primary">点击上传</el-button>
      <div slot="tip" class="el-upload__tip">上传文件不超过10MB</div>
    </el-upload>
  </div>
</template>
<script>
import { getToken } from '@/utils/auth'
export default {
  name: 'fileUpload',
  props: {
    value: String,
    savePath: {
      default: 'test',
    },
  },
  computed: {
    imageUrl() {
      return this.value
    },
    imageName() {
      if (this.value != null && this.value !== '') {
        return this.value.substr(this.value.lastIndexOf('/') + 1)
      } else {
        return null
      }
    },
    fileList() {
      return [
        {
          name: this.imageName,
          url: this.imageUrl,
        },
      ]
    },
    showFileList: {
      get: function () {
        return (
          this.value !== null && this.value !== '' && this.value !== undefined
        )
      },
      set: function (newValue) {},
    },
  },
  data() {
    return {
      dataObj: {
        savePath: this.savePath,
      },
      dialogVisible: false,
      action: process.env.VUE_APP_BASE_API + '/common/upload_file',
      headers: { Authorization: 'Bearer ' + getToken() },
    }
  },
  methods: {
    emitInput(val) {
      this.$emit('input', val)
    },
    handleRemove(file, fileList) {
      this.emitInput('')
    },
    handlePreview(file) {
      this.dialogVisible = true
    },
    handleUploadSuccess(res, file) {
      let data = res.data
      this.showFileList = true
      this.fileList.pop()
      this.fileList.push({ name: data.fileName, url: data.url })
      this.emitInput(this.fileList[0].url)
    },
    handleBeforeUpload() {},
  },
}
</script>
<style>
</style>


