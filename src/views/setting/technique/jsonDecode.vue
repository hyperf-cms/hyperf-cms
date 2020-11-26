<template> 
  <el-card class="form-container" shadow="never" style="width: 1200px">
    <el-form :model="form" label-width="80px">
      <el-form-item label="Json:" label-width="100px">
        <el-input type="textarea" v-model="form.json" :autosize="{minRows: 8}"></el-input>
      </el-form-item>
      <el-form-item label-width="100px">
        <el-button type="primary" @click="onSubmit()">解析</el-button>
      </el-form-item>
    </el-form>
    <div style="float: left;padding-right: 12px;width: 100px;text-align: right;font-size: 14px;color: #606266;">查询结果</div>
    <json-viewer :value="jsonData" :expand-depth=3 copyable boxed style="margin-left: 100px;"></json-viewer>
  </el-card>
</template>
<script>
import JsonViewer from 'vue-json-viewer';
import 'vue-json-viewer/style.css'
export default {
  name: 'SqlQuery',
  components: { JsonViewer },
  data() {
    return {
      form: {
        limit: true,
        sql: ''
      },
      sqlResult: '',
      jsonData: [],
    }
  },
  methods: {
    onSubmit: function() {
      try {
        this.jsonData = JSON.parse(this.form.json)
      } catch (e) {
        this.$message({
          message: '解析失败,JSON格式有问题',
          type: 'error',
        });
      }
    }
  }
}

</script>
