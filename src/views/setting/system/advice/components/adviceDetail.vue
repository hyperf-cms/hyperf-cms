<template> 
  <el-card class="form-container" shadow="never" style="width: 1000px">
    <el-form ref="adviceForm" :model="advice" :rules="adviceRules" label-width="80px">
      <el-form-item label="标题" prop="title">
        <el-input v-model="advice.title" plachod auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <el-select v-model="advice.type" default-first-option placeholder="请选择建议类型" clearable>
          <el-option label="bug" :value="0"></el-option>
          <el-option label="优化" :value="1"></el-option>
          <el-option label="混合" :value="2"></el-option>
        </el-select>
        <span style="color: #666">（优先处理bug）</span>
      </el-form-item>
      <el-form-item label="内容" prop="content">
        <tinymce :height="300" v-model="advice.content" id='tinymce' ref="contentEditor"></tinymce>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('adviceForm')">提交</el-button>
        <el-button v-if="!isEdit" @click="resetForm('adviceForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script>
import { getOneAdvice, createAdvice, updateAdvice } from '@/api/system/advice'
import Tinymce from '@/components/Tinymce'
const defaultAdvice = {
  id: null,
  title: '',
  content: '',
  type: null,
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
      advice: Object.assign({}, defaultAdvice),
      type: 1,
      adviceRules: {
        title: [
          { required: true, message: '请填写标题', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择类型', trigger: 'blur' }
        ],
      }
    }
  },
  created() {
    //判断是否为修改
    if (this.isEdit == true) {
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
    }
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
            if (this.isEdit) {
              updateAdvice(this.advice.id, { postData: this.advice }).then(response => {
                if (response.errorCode == 200) {
                  this.$refs[adviceForm].resetFields();
                  this.$router.back();
                }
              }).catch(err => {});
            } else {
              createAdvice({ postData: this.advice }).then(response => {
                if (response.errorCode == 200) {
                  this.$refs[adviceForm].resetFields();
                  this.advice = Object.assign({}, defaultAdvice);
                  this.$router.back();
                }
              }).catch(err => {});
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
    resetForm(adviceForm) {
      this.$refs[adviceForm].resetFields();
    }
  }
}

</script>
<style scoped>
  .el-form-item__content .el-input {
    width: 720px;
  }
</style>
