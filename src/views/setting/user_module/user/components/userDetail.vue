<template>
  <el-dialog
    :title="userDetailDialogData.userDetailTitle"
    :visible.sync="userDetailDialogData.userDetailDialogVisible"
    width="50%"
    :close-on-click-modal="false"
  >
    <el-form :model="user" :rules="rules" ref="userForm" label-width="150px">
      <el-form-item label="用户账号:" prop="username">
        <el-input
          v-model="user.username"
          :disabled="userDetailDialogData.isEdit"
          placeholder="请填写用户账号名（唯一）"
        ></el-input>
      </el-form-item>
      <el-form-item label="用户昵称:">
        <el-input v-model="user.desc" placeholder="请填写用户昵称"></el-input>
      </el-form-item>
      <el-form-item label="用户密码:" prop="password" v-show="userDetailDialogData.isEdit == false">
        <el-input v-model="user.password" type="password" autocomplete="off" placeholder="请输入用户密码"></el-input>
      </el-form-item>
      <el-form-item
        label="确认密码:"
        prop="password_confirmation"
        v-show="userDetailDialogData.isEdit == false"
      >
        <el-input
          type="password"
          v-model="user.password_confirmation"
          autocomplete="off"
          placeholder="请再次输入用户密码"
        ></el-input>
      </el-form-item>
      <el-form-item label="手机号码:" prop="mobile">
        <el-input v-model="user.mobile" placeholder="请填写用户手机号码"></el-input>
      </el-form-item>
      <el-form-item label="邮箱:" prop="email">
        <el-input v-model="user.email" placeholder="请填写用户邮箱地址"></el-input>
      </el-form-item>
      <el-form-item label="用户角色:" prop="roleData">
        <el-select
          v-model="user.roleData"
          multiple
          filterable
          allow-create
          default-first-option
          size="medium"
          placeholder="请选择用户角色"
        >
          <el-option
            v-for="(item, key) in roles"
            :key="key"
            :label="item.description"
            :value="item.name"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="用户头像:">
        <single-upload v-model="user.avatar" savePath="admin_face"></single-upload>
      </el-form-item>
      <el-form-item label="性别：">
        <el-radio-group v-model="user.sex">
          <el-radio
            v-for="dict in userDetailDialogData.sexOptions"
            :key="dict.dict_value"
            :label="dict.dict_value"
          >{{dict.dict_label}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="状态：">
        <el-radio-group v-model="user.status">
          <el-radio
            v-for="dict in userDetailDialogData.statusOptions"
            :key="dict.dict_value"
            :label="dict.dict_value"
          >{{dict.dict_label}}</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="onSubmit('userForm')">提交</el-button>
      <el-button @click="resetForm('userForm')">重置</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {
  createUser,
  updateUser,
  editUser,
} from '@/api/setting/user_module/user'
import { getRoleByTree } from '@/api/setting/user_module/role'
import { validatPhone } from '@/utils/validate'
import SingleUpload from '@/components/Upload/singleUpload'
const defaultUser = {
  username: '',
  password: '',
  desc: '',
  avatar: '',
  status: 1,
  sex: 0,
  mobile: '',
  roleData: '',
  email: '',
  password_confirmation: '',
}
export default {
  name: 'UserDetail',
  components: { SingleUpload },
  props: {
    userDetailDialogData: {
      type: Object,
      default: {},
    },
  },
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
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 18,
            message: '长度在 6 到 18 个字符',
            trigger: 'blur',
          },
        ],
        mobile: [{ required: true, validator: validatePhone, trigger: 'blur' }],
        password_confirmation: [
          { required: true, message: '请输入确定密码', trigger: 'blur' },
        ],
        roleData: [
          { required: true, message: '请至少选择一个角色', trigger: 'blur' },
        ],
      },
    }
  },
  created() {
    getRoleByTree({ type: 'tree' }).then((response) => {
      if (response.code == 200) this.roles = response.data.list
    })
  },
  methods: {
    getUserInfo() {
      //判断是否为修改
      if (this.userDetailDialogData.isEdit == true) {
        editUser(this.userDetailDialogData.userId).then((response) => {
          if (response.code == 200) {
            let userData = response.data.list
            this.user = Object.assign({}, userData)
          }
        })
        delete this.rules.password_confirmation
        delete this.rules.password
        delete this.rules.username
        delete this.user.username
        delete this.user.password_confirmation
        delete this.user.password
      } else {
        this.user = Object.assign({}, defaultUser)
      }
    },
    onSubmit(userForm) {
      this.$refs[userForm].validate((valid) => {
        if (valid) {
          this.$confirm('是否提交数据', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }).then(() => {
            if (this.userDetailDialogData.isEdit) {
              updateUser(this.user.id, this.user).then((response) => {
                if (response.code == 200) {
                  this.$refs[userForm].resetFields()
                  this.$parent.getList()
                  this.userDetailDialogData.userDetailDialogVisible = false
                }
              })
            } else {
              createUser(this.user).then((response) => {
                if (response.code == 200) {
                  this.$refs[userForm].resetFields()
                  this.user = Object.assign({}, defaultUser)
                  this.$parent.getList()
                  this.userDetailDialogData.userDetailDialogVisible = false
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
  },
}
</script>

<style>
</style>
