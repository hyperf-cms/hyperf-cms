<template>
  <el-form ref="form" :model="user" :rules="rules" label-width="80px">
    <el-form-item label="用户昵称" prop="desc">
      <el-input v-model="user.desc" />
    </el-form-item>
    <el-form-item label="手机号码" prop="mobile">
      <el-input v-model="user.mobile" maxlength="11" />
    </el-form-item>
    <el-form-item label="邮箱" prop="email">
      <el-input v-model="user.email" maxlength="50" />
    </el-form-item>
    <el-form-item label="地址" prop="email">
      <el-input v-model="user.address" maxlength="50" />
    </el-form-item>
    <el-form-item label="性别">
      <el-radio-group v-model="user.sex">
        <el-radio
          v-for="dict in sexOptions"
          :key="dict.dict_value"
          :label="dict.dict_value"
        >{{dict.dict_label}}</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" size="mini" @click="submit">保存</el-button>
      <el-button type="danger" size="mini" @click="close">关闭</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { profileEdit } from '@/api/setting/user_module/user'

export default {
  props: {
    user: {
      type: Object,
    },
  },
  created() {
    this.getDicts('sys_user_sex').then((response) => {
      if (response.code == 200) this.sexOptions = response.data.list
    })
  },
  data() {
    return {
      sexOptions: [],
      // 表单校验
      rules: {
        desc: [
          { required: true, message: '用户昵称不能为空', trigger: 'blur' },
        ],
        email: [
          { required: true, message: '邮箱地址不能为空', trigger: 'blur' },
          {
            type: 'email',
            message: "'请输入正确的邮箱地址",
            trigger: ['blur', 'change'],
          },
        ],
        mobile: [
          { required: true, message: '手机号码不能为空', trigger: 'blur' },
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: '请输入正确的手机号码',
            trigger: 'blur',
          },
        ],
      },
    }
  },
  methods: {
    submit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          profileEdit(this.user.id, this.user).then((response) => {})
        }
      })
    },
    close() {
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push({ path: '/index' })
    },
  },
}
</script>
