<template> 
  <el-card class="form-container" shadow="never" style="width: 1200px">
    <el-form ref="sqlForm" :model="form" label-width="80px">
      <el-form-item label="查询10条" prop="limit" label-width="100px">
        <el-switch
          v-model="form.limit"
          active-color="#13ce66"
          inactive-color="#ff4949">
        </el-switch>
        <span style="font-size: 14px;color: #999;">（使用limit需关闭该限制）</span>
      </el-form-item>
      <el-form-item label="查询数据库" label-width="100px">
        <el-input type="input" v-model="form.database"></el-input>
        <span style="font-size: 14px;color: #999;">（不填写则查询默认数据库）</span>
      </el-form-item>
      <el-form-item label="SQL语句" prop="sql" label-width="100px">
        <el-input
          type="textarea"
          v-model="form.sql"
          :autosize="{minRows: 8}"
          prop="sql"
        ></el-input>
        <span style="color: #F56C6C"> *只能执行select语句！</span>
      </el-form-item>
      <el-form-item label-width="100px">
        <el-button type="primary" @click="onSubmit('sqlForm')">查询</el-button>
      </el-form-item>
    </el-form>
    <div style="float: left;padding-right: 12px;width: 100px;text-align: right;font-size: 14px;color: #606266;">查询结果</div>
    <json-viewer
      :value="jsonData"
      :expand-depth=3
      copyable
      boxed
      style="margin-left: 100px;"
    ></json-viewer>
  </el-card>
</template>

<script>
import JsonViewer from 'vue-json-viewer';
import {getSqlResult} from '@/api/system/sqlQuery'
export default {
  name: 'SqlQuery',
  components: { JsonViewer },
  data() {
    return {
      form: {
        limit: true,
        sql: '',
        database: '',
      },
      sqlResult: '',
      jsonData: [],
    }
  },
  methods: {
    onSubmit: function () {
      this.jsonData = {};
      getSqlResult({postData: this.form}).then(response => {
        if (response.errorCode == 200) {
          this.jsonData = response.data;
        }
      }).catch(err => {});
    }
  }
}
</script>
