<template>
  <div style="margin-bottom: 40px;">
    <el-upload
      style="position: relative;"
      :action="action"
      :headers="headers"
      :data="dataObj"
      list-type="text"
      :before-upload="beforeUpload"
      :on-remove="handleRemove"
      :on-success="handleUploadSuccess"
      :on-preview="handlePreview"
      :limit="maxCount"
      :on-exceed="handleExceed"
      drag
      multiple
      :file-list="fileList"
    >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">
        将文件拖到此处，或
        <em>点击上传</em>
      </div>
    </el-upload>
  </div>
</template>
<script>
import { getToken } from '@/utils/auth'
export default {
  name: 'multiFileUpload',
  props: {
    //图片属性数组
    value: Array,
    //最大上传图片数量
    maxCount: {
      type: Number,
      default: 100,
    },
    savePath: {
      default: '/default_video',
    },
    fileName: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      dataObj: {
        savePath: this.savePath,
        fileName: '',
      },
      action: process.env.VUE_APP_BASE_API + 'common/upload/single_pic',
      headers: { Authorization: 'Bearer ' + getToken() },
      dialogVisible: false,
      dialogImageUrl: null,
    }
  },
  computed: {
    fileList() {
      let fileList = []
      if (this.value != null) {
        for (let i = 0; i < this.value.length; i++) {
          fileList.push({ url: this.value[i] })
        }
      }
      return fileList
    },
  },
  methods: {
    emitInput(fileList) {
      let value = []
      for (let i = 0; i < fileList.length; i++) {
        value.push(fileList[i].url)
      }
      this.$emit('input', value)
    },
    handleRemove(file, fileList) {
      this.emitInput(fileList)
    },
    handlePreview(file) {
      this.dialogVisible = true
      this.dialogImageUrl = file.url
    },
    beforeUpload(file) {
      this.dataObj.fileName = this.fileName
    },
    handleUploadSuccess(res, file) {
      if (res.errorCode != 200) {
        this.$message({
          message: res.message,
          type: 'error',
          duration: 1000,
        })
      }
      let data = res.data
      this.showFileList = true
      this.fileList.push({ name: data.fileName, url: data.url })
      this.emitInput(this.fileList)
      this.$emit('handleUploadSuccess')
    },
    handleExceed(files, fileList) {
      this.$message({
        message: '最多只能上传' + this.maxCount + '个文件',
        type: 'warning',
        duration: 1000,
      })
    },
  },
}
</script>
<style>
</style>
