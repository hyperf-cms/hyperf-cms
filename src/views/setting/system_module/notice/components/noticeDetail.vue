<template>
  <el-dialog
    :title="noticeDetailDialogData.noticeDetailTitle"
    :visible.sync="noticeDetailDialogData.noticeDetailDialogVisible"
    width="1000px"
    :close-on-click-modal="false"
    @close="closeDialog()"
  >
    <el-form :model="notice" :rules="rules" ref="noticeForm" label-width="90px">
      <el-form-item label="标题" prop="title">
        <el-input v-model="notice.title" auto-complete="off" size="medium" placeholder="请输入标题"></el-input>
      </el-form-item>
      <el-form-item label="发布时间" prop="public_time">
        <el-date-picker
          v-model="notice.public_time"
          type="datetime"
          placeholder="选择日期时间"
          align="right"
          size="medium"
          ref="datePoint"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select
          v-model="notice.status"
          clearable
          class="input-width"
          size="medium"
          placeholder="状态选择"
        >
          <el-option
            v-for="dict in noticeDetailDialogData.statusOptions"
            :key="dict.dict_value"
            :label="dict.dict_label"
            :value="dict.dict_value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="内容" prop="content">
        <tinymce :height="300" v-model="notice.content" id="tinymce" ref="contentEditor"></tinymce>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="onSubmit('noticeForm')">提交</el-button>
      <el-button v-if="!noticeDetailDialogData.isEdit" @click="resetForm('noticeForm')">重置</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {
  createNotice,
  updateNotice,
  editNotice,
} from '@/api/setting/system_module/notice'
import Tinymce from '@/components/Tinymce'
const defaultNotice = {
  title: '',
  status: '',
  content: '',
  public_time: '',
}
export default {
  name: 'NoticeDetail',
  components: { Tinymce },
  props: {
    noticeDetailDialogData: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      notice: Object.assign({}, defaultNotice),
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
        status: [{ required: true, message: '请选择状态', trigger: 'blur' }],
        public_time: [
          { required: true, message: '请选择发布时间', trigger: 'blur' },
        ],
      },
    }
  },
  created() {},
  methods: {
    getNoticeInfo() {
      //判断是否为修改
      if (this.noticeDetailDialogData.isEdit == true) {
        editNotice(this.noticeDetailDialogData.id).then((response) => {
          if (response.code == 200) {
            let noticeData = response.data.list
            this.notice = Object.assign({}, noticeData)
            this.$refs.contentEditor.setContent(noticeData.content)
          }
        })
      } else {
        this.notice = Object.assign({}, defaultNotice)
      }
    },
    onSubmit(noticeForm) {
      this.$refs[noticeForm].validate((valid) => {
        if (valid) {
          this.$confirm('是否提交数据', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }).then(() => {
            if (this.noticeDetailDialogData.isEdit) {
              updateNotice(this.notice.id, this.notice).then((response) => {
                if (response.code == 200) {
                  this.$refs[noticeForm].resetFields()
                  this.$parent.getList()
                  this.noticeDetailDialogData.noticeDetailDialogVisible = false
                }
              })
            } else {
              createNotice(this.notice).then((response) => {
                if (response.code == 200) {
                  this.$refs[noticeForm].resetFields()
                  this.notice = Object.assign({}, defaultNotice)
                  this.$parent.getList()
                  this.noticeDetailDialogData.noticeDetailDialogVisible = false
                }
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
    resetForm(noticeForm) {
      this.$refs[noticeForm].resetFields()
      this.brand = Object.assign({}, defaultNotice)
    },
    closeDialog() {
      this.$refs.contentEditor.setContent('')
    },
  },
}
</script>

<style>
</style>
