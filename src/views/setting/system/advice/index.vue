<template>
  <div class="app-container">
    <el-card class="filter-container" shadow="never" style="margin-bottom: 20px">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button style="float:right" type="primary" @click="handleSearchList()" size="small">查询搜索</el-button>
        <el-button style="float:right;margin-right: 15px" @click="handleResetSearch()" size="small">重置</el-button>
      </div>
      <div style="margin-top: 30px">
        <el-form :inline="true" :model="this.listQuery" size="small">
          <el-form-item label="状态：">
            <el-select v-model="listQuery.status" clearable default-first-option>
              <el-option label="待解决" :value="0"></el-option>
              <el-option label="已解决" :value="1"></el-option>
              <el-option label="关闭" :value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="类型：">
            <el-select v-model="listQuery.type" clearable default-first-option>
              <el-option label="bug" :value="0"></el-option>
              <el-option label="优化" :value="1"></el-option>
              <el-option label="混合" :value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="box-card">
      <el-card shadow="never">
        <i class="el-icon-tickets"></i>
        <span>{{ $route.meta.title }}</span>
        <el-button
          style="float: right;"
          icon="el-icon-plus"
          type="primary"
          size="mini"
          @click="handleAddAdvice()"
        >添加建议</el-button>
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
        <el-table-column label="状态" width="100">
          <template slot-scope="scope">
            <div class="content-cell" :class="[{greenFont: scope.row.status==1}, {redFont: scope.row.status==0}]">{{ scope.row.status | formatStatus }}</div>
          </template>
        </el-table-column>
        <el-table-column label="类别" width="100">
          <template slot-scope="scope">
            <div class="content-cell">{{ scope.row.type | formatType }}</div>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" width="200">
          <template slot-scope="scope">{{ scope.row.created_at }}</template>
        </el-table-column>
        <el-table-column label="操作" width="400">
          <template slot-scope="scope">
            <el-button
              icon="el-icon-view"
              type="primary"
              size="mini"
              @click="handleViewAdvice(scope.row)"
            >查看</el-button>
            <el-button
              icon="el-icon-edit"
              type="primary"
              size="mini"
              @click="handleEditAdvice(scope.row)"
            >编辑</el-button>
            <el-button
              icon="el-icon-finished"
              type="primary"
              size="mini"
              @click="handleReplyAdvice(scope.row)"
            >回复</el-button>
            <el-button
              icon="el-icon-delete"
              type="danger"
              size="mini"
              @click="handleDeleteAdvice(scope.row)"
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
    <el-dialog title="详细内容" :visible.sync="viewAdviceDialog">
      <el-card class="box-card" shadow="never">
        <h3 v-html="viewContent.title"></h3>
        <div v-html="viewContent.content" class="box-content"></div>
      </el-card>
      <el-card class="box-card reply-box" shadow="never" v-if="viewContent.reply">
        <h3>管理员回复：</h3>
        <div v-html="viewContent.reply" class="box-content"></div>
      </el-card>
    </el-dialog>
  </div>
</template>

<script>
import {
  getAdviceList,
  deleteAdvice
} from "@/api/system/advice";
import { formatDate } from "@/utils/date";
const defaultListQuery = {
  cur_page: 1,
  page_size: 20,
  status: null,
  type: null
};

export default {
  name: "AdviceList",
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      listLoading: true,
      list: null,
      total: null,
      viewAdviceDialog: false,
      viewContent: []
    };
  },
  created() {
    this.getList();
  },
  filters: {
    formatStatus(status) {
      if (status == 0) return '待解决';
      if (status == 1) return '已解决';
      if (status == 2) return '关闭';
    },
    formatType(type) {
      if (type == 0) return 'bug';
      if (type == 1) return '优化';
      if (type == 2) return '混合';
    }
  },
  methods: {
    handleResetSearch() {
      this.listQuery = Object.assign({}, this.defaultListQuery);
      this.getList();
    },
    handleSearchList() {
      this.getList();
    },
    handleViewAdvice(row) {
      this.viewAdviceDialog = true;
      this.viewContent = row;
    },
    handleAddAdvice() {
      this.$router.push({ path: "/setting/system/advice/create" });
    },
    handleEditAdvice(row) {
      if (row.status != 0) {
        this.$message({
          type: 'error',
          message: '该条数据当前状态不可编辑'
        });
        return false;
      }
      this.$router.push({
        path: "/setting/system/advice/update",
        query: { id: row.id }
      });
    },
    handleReplyAdvice(row) {
      this.$router.push({
        path: "/setting/system/advice/reply",
        query: { id: row.id }
      })
    },
    handleDeleteAdvice(row) {
      this.$confirm('是否要进行删除操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteAdvice(row.id).then(response => {
          if (response.errorCode == 200) {
            this.getList();
          }
        });
      })
    },
    getList() {
      this.listLoading = true;
      getAdviceList(this.listQuery).then(response => {
        this.listLoading = false;
        this.list = response.data.list;
        this.total = response.data.total;
      });
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
  .box-card.reply-box {
    margin-top: 30px;
  }
  .greenFont {
    color: green;
  }
  .redFont {
    color: red;
  }
  .app-container >>> .box-content img {
    max-width: 100%;
    height: auto;
  }
</style>
