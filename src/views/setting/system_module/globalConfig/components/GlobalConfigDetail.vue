<template>
  <el-dialog
    :title="globalConfigDetailDialogData.globalConfigDetailTitle"
    :visible.sync="globalConfigDetailDialogData.globalConfigDetailDialogVisible"
    width="1000px"
    :close-on-click-modal="false"
    @close="closeDialog()"
  >
    <el-form :model="globalConfig" :rules="rules" ref="globalConfigForm" label-width="90px">
      <el-form-item label="名称" prop="name">
        <el-input v-model="globalConfig.name" auto-complete="off" size="medium" placeholder="请填写名称"></el-input>
      </el-form-item>
      <el-form-item label="KeyName" prop="key_name">
        <el-input
          v-model="globalConfig.key_name"
          auto-complete="off"
          size="medium"
          placeholder="请填写key_name"
        ></el-input>
      </el-form-item>

      <el-form-item label="数据">
        <tinymce :height="300" v-model="globalConfig.data" id="tinymce" ref="contentEditor"></tinymce>
      </el-form-item>
      <el-form-item label="备注">
        <el-input
          v-model="globalConfig.remark"
          auto-complete="off"
          size="medium"
          type="textarea"
          :rows="4"
          placeholder="请填写备注"
        ></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="onSubmit('globalConfigForm')">提交</el-button>
      <el-button
        v-if="!globalConfigDetailDialogData.isEdit"
        @click="resetForm('globalConfigForm')"
      >重置</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {
  createGlobalConfig,
  updateGlobalConfig,
  editGlobalConfig,
} from '@/api/setting/system_module/globalConfig'
import Tinymce from '@/components/Tinymce'
const defaultGlobalConfig = {
  name: '',
  key_name: '',
  data: '',
  remark: '',
}
export default {
  name: 'GlobalConfigDetail',
  components: { Tinymce },
  props: {
    globalConfigDetailDialogData: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      globalConfig: Object.assign({}, defaultGlobalConfig),
      rules: {
        name: [
          { required: true, message: '请填写名称', trigger: 'blur' },
          {
            min: 2,
            max: 60,
            message: '长度在 2 到 60 个字符',
            trigger: 'blur',
          },
        ],
        key_name: [
          { required: true, message: '请填写key_name', trigger: 'blur' },
          {
            min: 2,
            max: 60,
            message: '长度在 2 到 60 个字符',
            trigger: 'blur',
          },
        ],
      },
    }
  },
  created() {},
  methods: {
    getGlobalConfigInfo() {
      //判断是否为修改
      if (this.globalConfigDetailDialogData.isEdit == true) {
        editGlobalConfig(this.globalConfigDetailDialogData.id).then(
          (response) => {
            let globalConfigData = response.data.list
            this.$refs.contentEditor.setContent(globalConfigData.content)
          }
        )
      }
    },
    onSubmit(globalConfigForm) {
      this.$refs[globalConfigForm].validate((valid) => {
        if (valid) {
          this.$confirm('是否提交数据', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }).then(() => {
            if (this.globalConfigDetailDialogData.isEdit) {
              updateGlobalConfig(this.globalConfig.id, this.globalConfig).then(
                (response) => {
                  this.resetForm()
                  this.$parent.getList()
                  this.globalConfigDetailDialogData.globalConfigDetailDialogVisible = false
                }
              )
            } else {
              createGlobalConfig(this.globalConfig).then((response) => {
                this.resetForm()
                this.$parent.getList()
                this.globalConfigDetailDialogData.globalConfigDetailDialogVisible = false
              })
            }
          })
        } else {
          this.$message({
            message: '验证失败',
            type: 'error',
            duration: 1000,
          })
          return false
        }
      })
    },
    resetForm() {
      this.globalConfig = Object.assign({}, defaultGlobalConfig)
      this.$refs.contentEditor.setContent('')
    },
    closeDialog() {
      this.resetForm()
    },
  },
}
</script>

<style>
</style>
