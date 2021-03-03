<template>
  <el-dialog
    :title="adviceReplyDialogData.adviceReplyTitle"
    :visible.sync="adviceReplyDialogData.adviceReplyDialogVisible"
    width="900px"
    :close-on-click-modal="false"
    @close="closeDialog()"
  >
    <el-form ref="adviceForm" :model="advice" :rules="adviceRules" label-width="80px">
      <el-form-item label="状态" prop="type">
        <el-select
          v-model="advice.status"
          clearable
          class="input-width"
          size="medium"
          placeholder="状态选择"
        >
          <el-option
            v-for="dict in adviceReplyDialogData.statusOptions"
            :key="dict.dict_value"
            :label="dict.dict_label"
            :value="dict.dict_value"
          ></el-option>
        </el-select>
        <span>(优先处理bug)</span>
      </el-form-item>
      <el-form-item label="回复内容" prop="reply">
        <tinymce
          :height="300"
          v-model="advice.reply"
          id="adviceReplyEditor"
          ref="adviceReplyEditor"
        ></tinymce>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="onSubmit('adviceForm')">提交</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { editAdvice, replyAdvice } from '@/api/setting/system_module/advice'
import Tinymce from '@/components/Tinymce'
const defaultAdvice = {
  id: null,
  title: '',
  reply: '',
  type: null,
}
export default {
  name: 'Reply',
  components: { Tinymce },
  props: {
    adviceReplyDialogData: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      advice: Object.assign({}, defaultAdvice),
      type: 1,
      adviceRules: {
        status: [{ required: true, message: '请选择状态', trigger: 'blur' }],
      },
    }
  },
  methods: {
    getAdviceInfo() {
      editAdvice(this.adviceReplyDialogData.id)
        .then((response) => {
          let adviceData = response.data.list
          this.advice = Object.assign({}, adviceData)
          this.$refs.adviceReplyEditor.setContent(adviceData.reply)
        })
        .catch((err) => {
          this.$message({
            message: err,
            type: 'error',
          })
        })
    },
    onSubmit(adviceForm) {
      this.$refs[adviceForm].validate((valid) => {
        if (valid) {
          this.$confirm('是否提交数据', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          })
            .then(() => {
              replyAdvice(this.adviceReplyDialogData.id, this.advice)
                .then((response) => {
                  this.$refs[adviceForm].resetFields()
                  this.adviceReplyDialogData.adviceReplyDialogVisible = false
                })
                .catch((err) => {})
            })
            .catch((err) => {})
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
    closeDialog() {
      this.$refs.adviceReplyEditor.setContent('')
    },
  },
}
</script>
<style scoped>
.el-form-item__content .el-input {
  width: 720px;
}
</style>
