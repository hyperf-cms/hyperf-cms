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
      <el-form-item label="类型" prop="type">
        <el-select
          v-model="globalConfig.type"
          placeholder="请选择类型"
          default-first-option
          @change="changeType()"
          size="medium"
        >
          <el-option
            v-for="(item, index) in globalConfigDetailDialogData.typeOptions"
            :key="index"
            :value="item.dict_value"
            :label="item.dict_label"
          ></el-option>
        </el-select>
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
        <el-input
          v-module="globalConfig.data"
          placeholder="请填写数据"
          type="textarea"
          :rows="5"
          v-if="globalConfig.type == 'text'"
        ></el-input>
        <el-switch
          v-model="globalConfig.data"
          :active-value="true"
          :inactive-value="false"
          active-color="#13ce66"
          inactive-color="#ff4949"
          v-if="globalConfig.type == 'boolean'"
        ></el-switch>
        <tinymce
          :height="300"
          v-model="globalConfig.data"
          id="tinymce"
          ref="contentEditor"
          v-if="globalConfig.type == 'html'"
        ></tinymce>
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
  type: 'text',
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
        type: [{ required: true, message: '请选择类型', trigger: 'blur' }],
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
            this.globalConfig = response.data.list
            if (this.globalConfig.type == 'html') {
              this.$refs.contentEditor.setContent(this.globalConfig.content)
            }
          }
        )
      }
    },
    changeType() {
      this.globalConfig.data = ''
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
                  this.globalConfigDetailDialogData.globalConfigDetailDialogVisible = false
                  this.$parent.getList()
                }
              )
            } else {
              createGlobalConfig(this.globalConfig).then((response) => {
                this.resetForm()
                this.globalConfigDetailDialogData.globalConfigDetailDialogVisible = false
                this.$parent.getList()
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
      if (this.globalConfig.type == 'html') {
        this.$refs.contentEditor.setContent('')
      }
      this.globalConfig = Object.assign({}, defaultGlobalConfig)
    },
    closeDialog() {
      this.resetForm()
    },
  },
}
</script>

<style>
</style>
