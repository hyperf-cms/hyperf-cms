<template>
  <div class="app-container">
    <el-card shadow="never" style="margin: 0 auto 30px;width: 60%;">
      <el-form ref="sqlForm" :model="form" label-width="80px">
        <el-form-item label="数据库" label-width="100px">
          <el-input type="input" v-model="form.database"></el-input>
          <span style="font-size: 14px;color: #999;">（不填写则查询默认数据库）</span>
        </el-form-item>
        <el-form-item label="数据表" label-width="100px">
          <el-input type="input" v-model="form.table"></el-input>
        </el-form-item>
        <el-form-item label="where条件" label-width="100px">
          <el-button @click="addWhere" plain>添加</el-button>
          <el-card
            shadow="never"
            v-for="(item, index) in form.where"
            :key="index"
            style="margin-top: 20px;"
          >
            <el-row :gutter="20">
              <el-col :span="5">
                <el-input type="input" placeholder="请输入字段" v-model="item.field"></el-input>
              </el-col>
              <el-col :span="5">
                <el-input type="input" placeholder="请输入符号" v-model="item.symbol"></el-input>
              </el-col>
              <el-col :span="5">
                <el-input type="input" placeholder="请输入值" v-model="item.value"></el-input>
              </el-col>
              <el-col :span="5">
                <el-select v-model="form.where[index + 1].connection" placeholder="请选择条件" v-if="index < form.where.length-1">
                  <el-option label="and" value="and" />
                  <el-option label="or" value="or" />
                </el-select>
              </el-col>
              <el-col :span="4">
                <el-button type="danger" @click="deleteWhere(index)">删除</el-button>
              </el-col>
            </el-row>
          </el-card>
        </el-form-item>
        <el-form-item label-width="100px">
          <el-button type="primary" @click="onSubmit('sqlForm')">导出</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card shadow="never" style="margin: 0 auto;width: 60%;">
      <div slot="header" class="clearfix">
        <span>已导出的SQL文件</span>
      </div>
      <el-table
        ref="sqlFileTable"
        size="mini"
        :data="list"
        style="width: 100%;"
        border
      >
        <el-table-column label="文件名称">
          <template slot-scope="scope">{{scope.row.name}}</template>
        </el-table-column>
        <el-table-column label="操作" width="160">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              @click="handleDownloadFile(scope.row)"
            >下载</el-button>
            <el-button
              type="danger"
              size="mini"
              @click="handleDeleteFile(scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import {exportSql,getSqlFile,deleteFileList} from '@/api/system/sqlQuery'

export default {
  name: "SqlExport",
  data() {
    return {
      form: {
        database: "",
        table: "",
        where: []
      },
      list: [],
    };
  },
  created() {
    this.getList();
  },
  methods: {
    addWhere() {
      let len = this.form.where.length;
      this.form.where.push({
        field: "",
        symbol: "",
        value: "",
        connection: len > 0 ? "and" : "",
      });
    },
    deleteWhere(index) {
      // 清空待删除条件的下一个条件的关联
      if (this.form.where[index + 1] && this.form.where[index + 1].connection != "") {
        this.form.where[index + 1].connection = "";
      }
      // 删除条件
      this.form.where.splice(index, 1);
    },
    onSubmit() {
      exportSql(this.form).then(response => {
        if (response.errorCode == 200) {
          let downloadUrl = response.data.url;
          window.open(downloadUrl, '_blank');

          this.getList();
        }
      });
    },
    getList() {
      getSqlFile().then(response => {
        if (response.errorCode == 200) {
          this.list = response.data.list;
        }
      });
    },
    handleDownloadFile(row) {
      window.open(row.url, '_blank');
    },
    handleDeleteFile(row) {
      this.$confirm('确认删除吗', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteFileList({name: row.name}).then(response => {
          if (response.errorCode == 200) {
            this.getList();
          }
        });
      }).catch(err => {});
    },
  }
};
</script>