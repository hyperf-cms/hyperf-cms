<template> 
  <el-card class="form-container" shadow="never" style="width: 1000px">
    <el-form ref="adviceForm" :model="advice" :rules="adviceRules" label-width="80px">
      <el-form-item label="状态" prop="status">
        <el-select v-model="advice.status" default-first-option placeholder="请选择状态" clearable>
          <el-option label="待解决" :value="0"></el-option>
          <el-option label="已解决" :value="1"></el-option>
          <el-option label="关闭" :value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="备注" prop="reply">
        <tinymce :height="300" v-model="advice.reply" id='tinymce' ref="contentEditor"></tinymce>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('adviceForm')">提交</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script>
import { getOneAdvice, changeStatus } from '@/api/system/advice'
import Tinymce from '@/components/Tinymce'
const defaultAdvice = {
  id: null,
  title: '',
  content: '',
  type: null,
};
export default {
  name: 'Reply',
  components: { Tinymce },
  data() {
    return {
      advice: Object.assign({}, defaultAdvice),
      type: 1,
      adviceRules: {
        status: [
          { required: true, message: '请选择状态', trigger: 'blur' }
        ],
      }
    }
  },
  created() {
    getOneAdvice({id: this.$route.query.id, type: 'getOne'}).then(response => {
      if (response.errorCode == 200) {
        let adviceData = response.data;
        this.advice = Object.assign({}, adviceData);
      }
    }).catch(err => {
      this.$message({
        message: err,
        type: 'error',
      });
    });
  },
  methods: {
    onSubmit(adviceForm) {
      this.$refs[adviceForm].validate((valid) => {
        if (valid) {
          this.$confirm('是否提交数据', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            changeStatus({ postData: this.advice }).then(response => {
              if (response.errorCode == 200) {
                this.$refs[adviceForm].resetFields();
                this.$router.back();
              }
            }).catch(err => {});
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
    }
  }
}

</script>
<style scoped>
  .el-form-item__content .el-input {
    width: 720px;
  }
</style>
