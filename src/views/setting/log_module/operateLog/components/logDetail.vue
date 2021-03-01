<template>
  <!-- 操作日志详细 -->
  <el-dialog
    :title="logDetailDialogData.logDetailTitle"
    :visible.sync="logDetailDialogData.logDetailDialogVisible"
    width="800px"
    append-to-body
  >
    <el-form
      ref="logDetailForm"
      :model="logDetailDialogData.logDetailData"
      label-width="100px"
      size="mini"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item label="操作行为：">{{ logDetailDialogData.logDetailData.action }}</el-form-item>
          <el-form-item
            label="登录信息："
          >{{ logDetailDialogData.logDetailData.uid }} / {{ logDetailDialogData.logDetailData.username }} / {{ logDetailDialogData.logDetailData.operator }}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="请求地址：">{{ logDetailDialogData.logDetailData.target_url }}</el-form-item>
          <el-form-item
            label="请求信息："
          >{{ logDetailDialogData.logDetailData.request_method}} / {{ logDetailDialogData.logDetailData.request_ip }}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="目标控制器">{{ logDetailDialogData.logDetailData.target_class }}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="目标方法：">{{ logDetailDialogData.logDetailData.target_method }}</el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="请求参数：" v-if="logDetailDialogData.logDetailData.data != undefined">
            <json-viewer
              :value="JSON.parse(logDetailDialogData.logDetailData.data)"
              :expand-depth="3"
              copyable
              boxed
            ></json-viewer>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item
            label="响应结果："
          >{{ logDetailDialogData.logDetailData.response_code}} / {{ logDetailDialogData.logDetailData.response_result}}</el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="操作时间：">{{ logDetailDialogData.logDetailData.created_at}}</el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item
            label="异常信息："
            v-if="logDetailDialogData.logDetailData.status != 200"
          >{{ logDetailDialogData.logDetailData.response_result }}</el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="closeDialog()">关 闭</el-button>
    </div>
  </el-dialog>
</template>
<script>
import JsonViewer from 'vue-json-viewer'
import 'vue-json-viewer/style.css'
export default {
  name: 'logDetail',
  components: { JsonViewer },
  props: {
    logDetailDialogData: {
      type: Object,
      default: {},
    },
  },
  methods: {
    closeDialog() {
      this.logDetailDialogData.logDetailDialogVisible = false
    },
  },
}
</script>

<style>
</style>
