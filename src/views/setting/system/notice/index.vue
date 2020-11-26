<template>
  <div class="app-container">
    <el-card class="box-card">
      <el-card shadow="never">
        <i class="el-icon-tickets"></i>
        <span>{{ $route.meta.title }}</span>
        <el-button
          style="float: right;"
          icon="el-icon-plus"
          type="primary"
          size="mini"
          @click="handleAddNotice()"
        >添加通知</el-button>
      </el-card>
    </el-card>
    <div class="table-container">
      <el-table
        ref="configTable"
        :data="list"
        style="width: 100%;"
        size="mini"
        v-loading="listLoading"
      >
        <el-table-column label="ID" width="150" align="center">
          <template slot-scope="scope">{{ scope.row.id}}</template>
        </el-table-column>
        <el-table-column label="标题">
          <template slot-scope="scope">{{ scope.row.title }}</template>
        </el-table-column>
        <el-table-column label="发布者" width="100">
          <template slot-scope="scope">
            <div class="content-cell">{{ scope.row.get_user_name.desc }}</div>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" width="200">
          <template slot-scope="scope">{{ scope.row.created_at }}</template>
        </el-table-column>
        <el-table-column label="操作" width="300">
          <template slot-scope="scope">
            <el-button
              icon="el-icon-view"
              type="primary"
              size="mini"
              @click="handleViewNotice(scope.row)"
            >查看</el-button>
            <el-button
              icon="el-icon-edit"
              type="primary"
              size="mini"
              @click="handleEditNotice(scope.$index, scope.row)"
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
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes,prev, pager, next,jumper"
        :current-page.sync="listQuery.cur_page"
        :page-size="listQuery.page_size"
        :page-sizes="[10,20,30,50,80,100]"
        :total="total"
      ></el-pagination>
    </div>
    <el-dialog title="详细内容" :visible.sync="viewNoticeDialog">
      <el-card class="box-card" shadow="never">
        <h3 v-html="viewContent.title"></h3>
        <div v-html="viewContent.content"></div>
      </el-card>
    </el-dialog>
  </div>
</template>

<script>
import {
  getNoticeList,
  deleteNotice,
} from "@/api/system/notice";
import { formatDate } from "@/utils/date";
import Tinymce from "@/components/Tinymce";
const defaultListQuery = {
  cur_page: 1,
  page_size: 20
};

export default {
  name: "NoticeList",
  components: { Tinymce },
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      listLoading: true,
      list: null,
      total: null,
      viewNoticeDialog: false,
      viewContent: []
    };
  },
  created() {
    this.getList();
  },
  methods: {
    handleViewNotice(row) {
      this.viewNoticeDialog = true;
      this.viewContent = row;
    },
    getList() {
      this.listLoading = true;
      getNoticeList(this.listQuery).then(response => {
        this.listLoading = false;
        this.list = response.data.list;
        this.total = response.data.total;
      });
    },
    handleEditNotice(index, row) {
      this.$router.push({
        path: "/setting/system/notice/update",
        query: { id: row.id }
      });
    },
    handleAddNotice(isPublic = 0) {
      this.$router.push({ path: "/setting/system/notice/create" });
    },
    handleDeleteNotice(row) {
      this.$confirm("是否要进行该删除操作?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteNotice(row.id).then(response => {
            this.getList();
          });
        })
        .catch(err => {});
    },
    handleSizeChange(val) {
      this.listQuery.cur_page = 1;
      this.listQuery.page_size = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.cur_page = val;
      this.getList();
    }
  }
};
</script>
<style scoped>
.content-cell {
  word-break: break-word;
}
</style>
