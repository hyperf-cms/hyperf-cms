<template>
  <el-dialog
    :title="dictDataDetailDialogData.dictDataDetailTitle"
    :visible.sync="dictDataDetailDialogData.dictDataDetailDialogVisible"
    width="30%"
    :close-on-click-modal="false"
  >
    <el-form :model="dictData" :rules="rules" ref="dictDataForm" label-width="150px">
      <el-form-item label="字典类型" prop="dict_type">
        <el-input v-model="dictData.dict_type" auto-complete="off" disabled readonly size="medium"></el-input>
      </el-form-item>
      <el-form-item label="数据标签" prop="dict_label">
        <el-input
          v-model="dictData.dict_label"
          plachod
          auto-complete="off"
          size="medium"
          placeholder="请输入数据标签"
        ></el-input>
      </el-form-item>
      <el-form-item label="数据键值" prop="dict_value">
        <el-input
          v-model="dictData.dict_value"
          plachod
          auto-complete="off"
          size="medium"
          placeholder="请输入数据键值"
        ></el-input>
      </el-form-item>
      <el-form-item label="显示排序" prop="dict_sort">
        <el-input-number
          v-model="dictData.dict_sort"
          :min="1"
          :max="99"
          auto-complete="off"
          size="medium"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="状态：">
        <el-radio-group v-model="dictData.status">
          <el-radio :label="1">启动</el-radio>
          <el-radio :label="0">停用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="备注">
        <el-input
          v-model="dictData.remark"
          type="textarea"
          auto-complete="off"
          size="medium"
          placeholder="请输入内容"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('dictDataForm')">提交</el-button>
        <el-button v-if="!dictDataDetailDialogData.isEdit" @click="resetForm('dictDataForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import {
  createDictData,
  updateDictData,
  editDictData,
} from '@/api/setting/system_module/dictData'
const defaultDictType = {
  dict_type: '',
  dict_label: '',
  dict_value: '',
  dict_sort: '',
  status: 1,
  remark: '',
}
export default {
  name: 'dictDataDetail',
  props: {
    dictDataDetailDialogData: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      dictData: Object.assign({}, defaultDictType),
      rules: {
        dict_label: [
          { required: true, message: '请输入数据标签', trigger: 'blur' },
          {
            min: 1,
            max: 60,
            message: '长度在 1 到 60 个字符',
            trigger: 'blur',
          },
        ],
        dict_value: [
          { required: true, message: '请输入数据键值', trigger: 'blur' },
          {
            min: 1,
            max: 60,
            message: '长度在 1 到 60 个字符',
            trigger: 'blur',
          },
        ],
        dict_type: [
          { required: true, message: '请输入字典类型', trigger: 'blur' },
          {
            min: 1,
            max: 60,
            message: '长度在 1 到 60 个字符',
            trigger: 'blur',
          },
        ],
      },
    }
  },
  created() {},
  methods: {
    getDictTypeInfo() {
      //判断是否为修改
      if (this.dictDataDetailDialogData.isEdit == true) {
        editDictData(this.dictDataDetailDialogData.dict_code).then(
          (response) => {
            let dictDataData = response.data.list
            this.dictData = Object.assign({}, dictDataData)
          }
        )
      } else {
        this.dictData = Object.assign({}, defaultDictType)
        this.dictData.dict_type = this.dictDataDetailDialogData.dictType
      }
    },
    onSubmit(dictDataForm) {
      this.$refs[dictDataForm].validate((valid) => {
        if (valid) {
          this.$confirm('是否提交数据', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }).then(() => {
            if (this.dictDataDetailDialogData.isEdit) {
              updateDictData(this.dictData.dict_code, this.dictData).then(
                (response) => {
                  this.$refs[dictDataForm].resetFields()
                  this.$parent.getList()
                  this.dictDataDetailDialogData.dictDataDetailDialogVisible = false
                }
              )
            } else {
              createDictData(this.dictData).then((response) => {
                this.$refs[dictDataForm].resetFields()
                this.dictData = Object.assign({}, defaultDictType)
                this.$parent.getList()
                this.dictDataDetailDialogData.dictDataDetailDialogVisible = false
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
    resetForm(dictDataForm) {
      this.$refs[dictDataForm].resetFields()
      this.brand = Object.assign({}, defaultDictType)
    },
  },
}
</script>

<style>
</style>
