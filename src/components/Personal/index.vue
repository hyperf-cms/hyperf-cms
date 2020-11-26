<template> 
  <el-dialog title="广告渠道权限设置" :visible.sync="dialogVisible" width="35%" :close-on-click-modal="false">
    <el-card class="form-container" shadow="never">
     <!--  <el-form :model="user" :rules="rules" ref="userForm" label-width="150px">
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
      </el-form> -->
    </el-card>
  </el-dialog>
</template>
<script>


export default {
  name: 'Personal',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    user_id: {
      type: String,
      default: 0
    },
  },
  data() {
    return {
      checkStrictly: true,
      permissionLoading: false,
      filterPermissionText: '',
    }
  },
  watch: {
  
  },
  methods: {
   

  }
}

</script>
<style>
</style>
