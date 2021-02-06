<template>
  <el-dialog
    :title="dictionaryDetailDialogData.dictionaryDetailTitle"
    :visible.sync="dictionaryDetailDialogData.dictionaryDetailDialogVisible"
    width="30%"
    :close-on-click-modal="false"
  >
    <el-form :model="dictType" :rules="rules" ref="dictTypeForm" label-width="150px">
      <el-form-item label="字典名称" prop="dict_name">
        <el-input
          v-model="dictType.dict_name"
          plachod
          auto-complete="off"
          size="medium"
          placeholder="请输入字典名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="字典类型" prop="dict_type">
        <el-input
          v-model="dictType.dict_type"
          auto-complete="off"
          size="medium"
          placeholder="请输入字典类型"
        ></el-input>
      </el-form-item>
      <el-form-item label="状态：">
        <el-radio-group v-model="dictType.status">
          <el-radio :label="1">启动</el-radio>
          <el-radio :label="0">停用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="备注">
        <el-input
          v-model="dictType.remark"
          type="textarea"
          auto-complete="off"
          size="medium"
          placeholder="请输入内容"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('dictTypeForm')">提交</el-button>
        <el-button v-if="!dictionaryDetailDialogData.isEdit" @click="resetForm('dictTypeForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import {
  createDictType,
  updateDictType,
  editDictType,
} from '@/api/setting/system_module/dictType'
const defaultDictType = {
  dict_name: '',
  dict_type: '',
  status: 1,
  remark: '',
}
export default {
  name: 'dictionaryDetail',
  props: {
    dictionaryDetailDialogData: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      dictType: Object.assign({}, defaultDictType),
      rules: {
        dict_name: [
          { required: true, message: '请输入字典名称', trigger: 'blur' },
          {
            min: 2,
            max: 60,
            message: '长度在 2 到 60 个字符',
            trigger: 'blur',
          },
        ],
        dict_type: [
          { required: true, message: '请输入字典类型', trigger: 'blur' },
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
    getDictTypeInfo() {
      //判断是否为修改
      if (this.dictionaryDetailDialogData.isEdit == true) {
        editDictType(this.dictionaryDetailDialogData.dict_id).then(
          (response) => {
            let dictTypeData = response.data.list
            this.dictType = Object.assign({}, dictTypeData)
          }
        )
      } else {
        this.dictType = Object.assign({}, defaultDictType)
      }
    },
    onSubmit(dictTypeForm) {
      this.$refs[dictTypeForm].validate((valid) => {
        if (valid) {
          this.$confirm('是否提交数据', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }).then(() => {
            if (this.dictionaryDetailDialogData.isEdit) {
              updateDictType(this.dictType.dict_id, this.dictType).then(
                (response) => {
                  this.$refs[dictTypeForm].resetFields()
                  this.$parent.getList()
                  this.dictionaryDetailDialogData.dictionaryDetailDialogVisible = false
                }
              )
            } else {
              createDictType(this.dictType).then((response) => {
                this.$refs[dictTypeForm].resetFields()
                this.dictType = Object.assign({}, defaultDictType)
                this.$parent.getList()
                this.dictionaryDetailDialogData.dictionaryDetailDialogVisible = false
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
    resetForm(dictTypeForm) {
      this.$refs[dictTypeForm].resetFields()
      this.brand = Object.assign({}, defaultDictType)
    },
  },
}
</script>

<style>
</style>
