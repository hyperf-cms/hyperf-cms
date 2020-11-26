<template> 
  <el-card class="form-container" shadow="never" style="width: 1000px">
    <el-form ref="noticeForm" :model="notice" :rules="noticeRules" label-width="80px">
      <el-form-item label="标题" prop="title">
        <el-input v-model="notice.title" plachod auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="内容" prop="content">
        <tinymce :height="300" v-model="notice.content" id='tinymce' ref="contentEditor"></tinymce>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('noticeForm')">保存</el-button>
        <el-button v-if="!isEdit" @click="resetForm('noticeForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script>
import { getOneNotice, createNotice, updateNotice } from '@/api/system/notice'
import Tinymce from '@/components/Tinymce'
const defaultNotice = {
  id: null,
  title: '',
  content: ''
};
export default {
  name: 'NoticeDetail',
  components: { Tinymce },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      notice: Object.assign({}, defaultNotice),
      type: 1,
      noticeRules: {
        title: [
          { required: true, message: '请填写标题', trigger: 'blur' }
        ],
      }
    }
  },
  created() {
    //判断是否为修改
    if (this.isEdit == true) {
      getOneNotice({id: this.$route.query.id, type: 'getOne'}).then(response => {
        if (response.errorCode == 200) {
          let noticeData = response.data;
          this.notice = Object.assign({}, noticeData);
        }
      }).catch(err => {
        this.$message({
          message: err,
          type: 'error',
        });
      });
    }
  },
  methods: {
    onSubmit(noticeForm) {
      this.$refs[noticeForm].validate((valid) => {
        if (valid) {
          this.$confirm('是否提交数据', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            if (this.isEdit) {
              updateNotice(this.notice.id, { postData: this.notice }).then(response => {
                if (response.errorCode == 200) {
                  this.$refs[noticeForm].resetFields();
                  this.$router.back();
                }
              }).catch(err => {
                this.$message({
                  message: err,
                  type: 'error',
                });
              });
            } else {
              createNotice({ postData: this.notice }).then(response => {
                if (response.errorCode == 200) {
                  this.$refs[noticeForm].resetFields();
                  this.notice = Object.assign({}, defaultNotice);
                  this.$router.back();
                }
              }).catch(err => {
                this.$message({
                  message: err,
                  type: 'error',
                });
              });
            }
          }).catch(err => {});
        } else {
          this.$message({
            message: '验证失败',
            type: 'error',
            duration: 1000
          });
          return false;
        }
      });
    },
    resetForm(noticeForm) {
      this.$refs[noticeForm].resetFields();
    }
  }
}

</script>
<style scoped>
  .el-form-item__content .el-input {
    width: 720px;
  }
</style>
