<template>
  <div class="app-container">
    <el-card class="table-info" shadow="never">
      <span>文件列表</span>
      <el-button type="primary" size="mini" @click="uploadDialogVisible = true">上传文件</el-button>
    </el-card>
    <div class="table-container">
      <el-table
        ref="adDetailTable"
        :data="list"
        style="width: 100%"
        size="mini"
        border
        max-height="800"
      >
        <el-table-column label="文件">
          <template slot-scope="scope">{{ scope.row.name }}</template>
        </el-table-column>
        <el-table-column label="url">
          <template slot-scope="scope">{{ scope.row.url }}</template>
        </el-table-column>
        <el-table-column label="操作" width="200px">
          <template slot-scope="scope">
            <el-button
              icon="el-icon-edit"
              type="primary"
              size="mini"
              @click="handleDownload(scope.row.url)"
            >下载</el-button>
            <el-button
              icon="el-icon-edit"
              type="danger"
              size="mini"
              @click="handleDelete(scope.row.name)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 上传文件 -->
    <el-dialog
      title="上传文件"
      :visible.sync="uploadDialogVisible"
      :close-on-click-modal="false"
      width="600px"
      @close="handleCloseDialog"
    >
      <el-form
        ref="uploadForm"
        :model="uploadForm"
        label-width="100px"
        class="uploadForm"
      >
        <el-form-item label="文件名：" prop="name">
          <el-input v-model="uploadForm.name" placeholder="请输入名称"></el-input>
        </el-form-item>
        <el-form-item label="文件上传：" prop="file" v-if="uploadForm.name">
          <multi-file-upload v-model="uploadForm.file" savePath="configFile" :fileName="uploadForm.name" @handleUploadSuccess="handleUploadSuccess"></multi-file-upload>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { getConfigFile,deleteConfigFile } from "@/api/system/configFile";
import MultiFileUpload from '@/components/Upload/multiFileUpload'

const defaultUploadForm = {
  name: "",
  file: "",
}

export default {
  name: "ConfigFile",
  components: {
    MultiFileUpload
  },
  data() {
    return {
      list: [],
      uploadDialogVisible: false,
      uploadForm: Object.assign({}, defaultUploadForm),
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      getConfigFile().then((response) => {
        if (response.errorCode == 200) {
          this.list = response.data.list;
        }
      });
    },
    handleDownload(url) {
      window.open(url, '_blank');
    },
    handleDelete(name) {
      this.$confirm('确认删除吗', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteConfigFile({name}).then(response => {
          if (response.errorCode == 200) {
            this.getList();
          }
        });
      }).catch(err => {});
    },
    handleCloseDialog() {
      this.uploadForm = Object.assign({}, defaultUploadForm);
      this.getList();
    },
    handleUploadSuccess() {
      this.uploadDialogVisible = false;
      this.getList();
    }
  },
};
</script>

<style lang="scss" scoped>
.table-info >>> .el-card__body {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.uploadForm .el-input {
  width: 360px;
}
</style>