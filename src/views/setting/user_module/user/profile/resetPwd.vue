<template>
  <el-form ref="form" :model="user" :rules="rules" label-width="80px">
    <el-form-item label="旧密码" prop="old_password">
      <el-input v-model="user.old_password" placeholder="请输入旧密码" type="password" />
    </el-form-item>
    <el-form-item label="新密码" prop="new_password">
      <el-input v-model="user.new_password" placeholder="请输入新密码" type="password" />
    </el-form-item>
    <el-form-item label="确认密码" prop="confirm_password">
      <el-input v-model="user.confirm_password" placeholder="请确认密码" type="password" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" size="mini" @click="submit">保存</el-button>
      <el-button type="danger" size="mini" @click="close">关闭</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { resetPassword } from '@/api/setting/user_module/user'

export default {
  data() {
    const equalToPassword = (rule, value, callback) => {
      if (this.user.new_password !== value) {
        callback(new Error('两次输入的密码不一致'))
      } else {
        callback()
      }
    }
    return {
      test: '1test',
      user: {
        old_password: undefined,
        new_password: undefined,
        confirm_password: undefined,
      },
      // 表单校验
      rules: {
        old_password: [
          { required: true, message: '旧密码不能为空', trigger: 'blur' },
        ],
        new_password: [
          { required: true, message: '新密码不能为空', trigger: 'blur' },
          {
            min: 6,
            max: 20,
            message: '长度在 6 到 20 个字符',
            trigger: 'blur',
          },
        ],
        confirm_password: [
          { required: true, message: '确认密码不能为空', trigger: 'blur' },
          { required: true, validator: equalToPassword, trigger: 'blur' },
        ],
      },
    }
  },
  methods: {
    submit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          let postData = {
            uid: this.$store.getters.userId,
            old_password: this.user.old_password,
            new_password: this.user.new_password,
            confirm_password: this.user.confirm_password,
          }
          resetPassword({ postData: postData }).then((response) => {})
        }
      })
    },
    close() {
      this.$router.push({ path: '/' })
    },
  },
}
</script>
