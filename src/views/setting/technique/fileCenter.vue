<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card shadow="never">
          <div slot="header">
            <span>文件夹列表</span>
          </div>
          <el-tree
            :data="dirList"
            :props="{children: 'children', label: 'name'}"
            @node-click="handleNodeClick"
          >
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <span>{{ node.label }}</span>
              <span>{{ data.size }}</span>
            </span>
          </el-tree>
        </el-card>
      </el-col>
      <el-col :span="18">
        <el-table
          ref="fileTable"
          :data="fileList"
          size="mini"
          border
          max-height="800"
        >
          <el-table-column label="文件">
            <template slot-scope="scope">{{ scope.row.name }}</template>
          </el-table-column>
          <el-table-column label="大小">
            <template slot-scope="scope">{{ scope.row.size }}</template>
          </el-table-column>
          <el-table-column label="操作" width="200px">
            <template slot-scope="scope">
              <el-button
                icon="el-icon-edit"
                type="primary"
                size="mini"
                @click="handleDownload(scope.row.url)"
              >查看</el-button>
              <el-button
                icon="el-icon-edit"
                type="danger"
                size="mini"
                @click="handleDelete(scope.row.name)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination-container">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          layout="total,sizes,prev,pager,next,jumper"
          :current-page.sync="listQuery.cur_page"
          :page-size="listQuery.page_size"
          :page-sizes="[1,20,50,100,150,200]"
          :total="total"
        />
      </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getDirList,getFileList,deleteFile } from "@/api/system/fileCenter";

const defaultListQuery = {
  cur_page: 1,
  page_size: 20,
};

export default {
  name: "FileCenter",
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      curName: '',
      dirList: [],
      fileList: [],
      total: 0,
    }
  },
  created() {
    this.getDirList();
  },
  methods: {
    getDirList() {
      getDirList().then(response => {
        if (response.errorCode == 200) {
          this.dirList = response.data.list;
        }
      });
    },
    handleNodeClick(data) {
      this.curName = data.name;
      this.listQuery.cur_page = 1;
      
      this.getFileList();
    },
    getFileList() {
      getFileList({
        cur_page: this.listQuery.cur_page,
        page_size: this.listQuery.page_size,
        path: this.curName,
      }).then(response => {
        if (response.errorCode == 200) {
          this.fileList = response.data.list;
          this.total = response.data.total;
        }
      });
    },
    handleSizeChange(val) {
      this.listQuery.cur_page = 1;
      this.listQuery.page_size = val;
      this.getFileList();
    },
    handleCurrentChange(val) {
      this.listQuery.cur_page = val;
      this.getFileList();
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
        deleteFile({name: name}).then(response => {
          if (response.errorCode == 200) {
            this.getFileList();
          }
        });
      }).catch(err => {});
    },
  }
}
</script>

<style lang="scss" scoped>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>