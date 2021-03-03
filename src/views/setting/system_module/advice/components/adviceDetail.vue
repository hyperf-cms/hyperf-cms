<template>
  <el-dialog
    :title="adviceDetailDialogData.adviceDetailTitle"
    :visible.sync="adviceDetailDialogData.adviceDetailDialogVisible"
    width="900px"
    :close-on-click-modal="false"
    @close="closeDialog()"
  >
    <el-form :model="advice" :rules="rules" ref="adviceForm" label-width="90px">
      <el-form-item label="标题" prop="title">
        <el-input v-model="advice.title" auto-complete="off" size="medium" placeholder="请输入标题"></el-input>
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <el-select
          v-model="advice.type"
          clearable
          class="input-width"
          size="medium"
          placeholder="类型选择"
        >
          <el-option
            v-for="dict in adviceDetailDialogData.typeOptions"
            :key="dict.dict_value"
            :label="dict.dict_label"
            :value="dict.dict_value"
          ></el-option>
        </el-select>
        <span>(优先处理bug)</span>
      </el-form-item>
      <el-form-item label="内容" prop="content">
        <tinymce :height="300" v-model="advice.content" id="tinymce" ref="contentEditor"></tinymce>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="onSubmit('adviceForm')">提交</el-button>
      <el-button v-if="!adviceDetailDialogData.isEdit" @click="resetForm('adviceForm')">重置</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {
  createAdvice,
  updateAdvice,
  editAdvice,
} from '@/api/setting/system_module/advice'
import Tinymce from '@/components/Tinymce'
const defaultAdvice = {
  title: '',
  type: '',
  content: '',
}
export default {
  name: 'AdviceDetail',
  components: { Tinymce },
  props: {
    adviceDetailDialogData: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      advice: Object.assign({}, defaultAdvice),
      rules: {
        title: [
          { required: true, message: '请填写标题', trigger: 'blur' },
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
    getAdviceInfo() {
      //判断是否为修改
      if (this.adviceDetailDialogData.isEdit == true) {
        editAdvice(this.adviceDetailDialogData.id).then((response) => {
          let adviceData = response.data.list
          this.advice = Object.assign({}, adviceData)
          this.$refs.contentEditor.setContent(adviceData.content)
        })
      } else {
        this.advice = Object.assign({}, defaultAdvice)
      }
    },
    onSubmit(adviceForm) {
      this.$refs[adviceForm].validate((valid) => {
        if (valid) {
          this.$confirm('是否提交数据', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }).then(() => {
            if (this.adviceDetailDialogData.isEdit) {
              updateAdvice(this.advice.id, this.advice).then((response) => {
                this.$refs[adviceForm].resetFields()
                this.$parent.getList()
                this.adviceDetailDialogData.adviceDetailDialogVisible = false
              })
            } else {
              createAdvice(this.advice).then((response) => {
                this.$refs[adviceForm].resetFields()
                this.advice = Object.assign({}, defaultAdvice)
                this.$parent.getList()
                this.adviceDetailDialogData.adviceDetailDialogVisible = false
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
    resetForm(adviceForm) {
      this.$refs[adviceForm].resetFields()
      this.brand = Object.assign({}, defaultAdvice)
    },
    closeDialog() {
      this.$refs.contentEditor.setContent('')
    },
  },
}
</script>

<style>
</style>
