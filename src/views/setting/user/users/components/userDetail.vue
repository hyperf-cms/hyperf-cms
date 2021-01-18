<template> 
  <el-dialog :title="userDetailTitle" :visible.sync="userDetailDialogData.userDetailDialogVisible" width="100%" fullscreen :close-on-click-modal="false">
    <el-form :model="user" :rules="rules" ref="userForm" label-width="150px">
      <el-form-item label="用户账号" prop="username">
        <el-input v-model="user.username" :disabled="isEdit"></el-input>
      </el-form-item>
      <el-form-item label="用户昵称">
        <el-input v-model="user.desc"></el-input>
      </el-form-item>
      <el-form-item label="用户密码" prop="password" v-show="isEdit == false">
        <el-input v-model="user.password" type="password" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="确定密码" prop="password_confirmation" v-show="isEdit == false">
        <el-input type="password" v-model="user.password_confirmation" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="手机号码" prop="mobile">
        <el-input v-model="user.mobile"></el-input>
      </el-form-item>
      <el-form-item label="用户角色" prop="roleData">
        <el-select v-model="user.roleData" multiple filterable allow-create default-first-option size="medium" placeholder="请选择用户角色">
          <el-option v-for="(item, key) in roles" :key="key" :label="item" :value="key">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="用户头像：">
        <single-upload v-model="user.avatar" savePath="admin_face"></single-upload>
      </el-form-item>
      <el-form-item label="状态：">
        <el-radio-group v-model="user.status">
          <el-radio :label="1">启动</el-radio>
          <el-radio :label="0">停用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('userForm')">提交</el-button>
        <el-button v-if="!isEdit" @click="resetForm('userForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
import { createUser, userList, updateUser } from '@/api/auth/user'
import { getRole } from '@/api/auth/role'
import { validatPhone } from '@/utils/validate';
import SingleUpload from '@/components/Upload/singleUpload'
const defaultUser = {
  username: '',
  password: '',
  desc: '',
  avatar: '',
  status: 1,
  mobile: '',
  roleData: '',
  password_confirmation: '',
};
export default {
  name: 'UserDetail',
  components: { SingleUpload },
  props: {
    userDetailDialogData: {
      type: Object,
      default: {}
    },
  },
  data() {
    var validatePhone = (rule, value, callback) => {
      if (!validatPhone(value)) {
        callback(new Error('手机号码格式不正确'));
      } else {
        callback();
      }
    };
    return {
      user: Object.assign({}, defaultUser),
      roles: '',
      rules: {
        username: [
          { required: true, message: '情输入用户名', trigger: 'blur' },
          { min: 2, max: 60, message: '长度在 2 到 60 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 2, max: 18, message: '长度在 2 到 18 个字符', trigger: 'blur' }
        ],
        mobile: [
          { required: true, validator: validatePhone, trigger: 'blur' },
        ],
        password_confirmation: [
          { required: true, message: '请输入确定密码', trigger: 'blur' },
        ],
        roleData: [
          { required: true, message: '请至少选择一个角色', trigger: 'blur' },
        ]
      }
    }
  },
  created() {
    getRole({ type: 'tree' }).then(response => {
      this.roles = response.data
    });


    //判断是否为修改
    if (this.isEdit == true) {
      userList({ id: this.$route.query.id, type: 'getOne' }).then(response => {
        let userData = response.data
        this.user = Object.assign({}, userData);
      });
      delete this.rules.password_confirmation
      delete this.rules.password
      delete this.rules.username
      delete this.user.username
      delete this.user.password_confirmation
      delete this.user.password
    }
  },
  methods: {
    onSubmit(userForm) {
      this.$refs[userForm].validate((valid) => {
        if (valid) {
          this.$confirm('是否提交数据', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            if (this.isEdit) {
              updateUser(this.user.id, { postData: this.user }).then(response => {
                this.$refs[userForm].resetFields();
                this.$router.back();
              });
            } else {
              createUser({ postData: this.user }).then(response => {
                this.$refs[userForm].resetFields();
                this.user = Object.assign({}, defaultUser);
                this.$router.back();
              });
            }
          });

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
    resetForm(userForm) {
      this.$refs[userForm].resetFields();
      this.brand = Object.assign({}, defaultUser);
    }
  }
}

</script>
<style>
</style>
