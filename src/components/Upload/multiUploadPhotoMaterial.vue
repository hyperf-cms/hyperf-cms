<template> 
  <div style="margin-bottom: 40px;">
    <el-upload style="position: relative;" ref="upload_photo_material" :action="action" :headers="headers" :data="dataObj" list-type="picture"  :before-upload="beforeUpload" :on-remove="handleRemove" :on-success="handleUploadSuccess" :on-preview="handlePreview" :limit="maxCount" :on-exceed="handleExceed" drag multiple>
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
    </el-upload>
  
  </div>
</template>
<script>
import { getToken } from '@/utils/auth'
export default {
  name: 'multiUploadPhotoMaterial',
  props: {
    //图片属性数组
    value: Array,
    //最大上传图片数量
    maxCount: {
      type: Number,
      default: 100
    },
    savePath: {
      default: 'file_material',
    },
  },
  data() {
    return {
      dataObj: {
        savePath: this.savePath,
      },
      action: process.env.BASE_API + '/common/upload_photo_material',
      headers: { 'Authorization': 'Bearer ' + getToken() },
      dialogVisible: false,
      dialogImageUrl: null,
    };
  },
  computed: {
    fileList() {
      let fileList = [];
      for (let i = 0; i < this.value.length; i++) {
        fileList.push(this.value[i]);
      }
      return fileList;
    }
  },
  methods: {
    emitInput(fileList) {
      let value = [];
      for (let i = 0; i < fileList.length; i++) {
        value.push({
          file_name: fileList[i].file_name,
          file_path: fileList[i].file_path,
          file_ext: fileList[i].file_ext,  
          file_size: fileList[i].file_size,
          file_px: fileList[i].file_px,
          file_md5: fileList[i].file_md5
        });
      }
      this.$emit('input', value)
    },
    handleRemove(file, fileList) {
      this.emitInput(fileList);
    },
    handlePreview(file) {
      this.dialogVisible = true;
      this.dialogImageUrl = file.file_path;
    },
    beforeUpload(file) {

    },
    handleUploadSuccess(res, file) {
      if (res.errorCode != 200) {
        this.$message({
          message: res.message,
          type: 'error',
          duration: 1000
        });
        this.clearFiles()
        return false;
      }
      let data = res.data
      this.showFileList = true;
      this.fileList.push({ file_name: data.file_name, file_path: data.file_path, file_ext: data.file_ext, file_size: data.file_size, file_px: data.file_px, file_md5: data.file_md5 });
      this.emitInput(this.fileList);

    },
    clearFiles() {
      this.$refs['upload_photo_material'].clearFiles();
    },
    handleExceed(files, fileList) {
      this.$message({
        message: '最多只能上传' + this.maxCount + '张图片',
        type: 'warning',
        duration: 1000
      });
    },

  }
}

</script>
<style>
</style>
