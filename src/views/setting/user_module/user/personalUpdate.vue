<template>
  <el-card class="form-container" shadow="never">
    <el-form :model="user" :rules="rules" ref="userForm" label-width="150px">
      <el-form-item label="用户账号" prop="username">
        <el-input v-model="user.username" disabled></el-input>
      </el-form-item>
      <el-form-item label="用户昵称">
        <el-input v-model="user.desc"></el-input>
      </el-form-item>
      <el-form-item label="原密码">
        <el-input v-model="user.old_password" type="password" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="用户密码">
        <el-input v-model="user.password" type="password" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="确定密码">
        <el-input type="password" v-model="user.password_confirmation" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="手机号码" prop="mobile">
        <el-input v-model="user.mobile"></el-input>
      </el-form-item>
      <el-form-item label="用户头像：">
        <single-upload v-model="user.avatar" savePath="admin_face"></single-upload>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('userForm')">提交</el-button>
        <el-button v-if="!isEdit" @click="resetForm('userForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script>
import { editUser } from '@/api/setting/user_module/user'
import { personalUpdate } from '@/api/auth/login'
import { validatPhone } from '@/utils/validate'
import SingleUpload from '@/components/Upload/singleUpload'
const defaultUser = {
  username: '',
  password: '',
  old_password: '',
  desc: '',
  avatar: '',
  status: 1,
  mobile: '',
  roleData: '',
  password_confirmation: '',
}
export default {
  name: 'UserDetail',
  components: { SingleUpload },
  data() {
    var validatePhone = (rule, value, callback) => {
      if (!validatPhone(value)) {
        callback(new Error('手机号码格式不正确'))
      } else {
        callback()
      }
    }
    return {
      user: Object.assign({}, defaultUser),
      roles: '',
      rules: {
        username: [
          { required: true, message: '情输入用户名', trigger: 'blur' },
          {
            min: 2,
            max: 60,
            message: '长度在 2 到 60 个字符',
            trigger: 'blur',
          },
        ],
        mobile: [{ required: true, validator: validatePhone, trigger: 'blur' }],
      },
    }
  },
  created() {
    //判断是否为修改
    getUserOne(this.$route.query.id).then((response) => {
      let userData = response.data.list
      this.user = Object.assign({}, userData)
    })
    delete this.rules.password_confirmation
    delete this.rules.password
    delete this.rules.username
    delete this.user.username
    delete this.user.password_confirmation
    delete this.user.old_password
  },
  methods: {
    onSubmit(userForm) {
      this.$refs[userForm].validate((valid) => {
        if (valid) {
          this.$confirm('是否提交数据', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }).then(() => {
            personalUpdate(this.user.id, { postData: this.user }).then(
              (response) => {
                this.$refs[userForm].resetFields()
                location.reload()
              }
            )
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
    resetForm(userForm) {
      this.$refs[userForm].resetFields()
      this.brand = Object.assign({}, defaultUser)
    },
  },
}
</script>
<style>
</style>
