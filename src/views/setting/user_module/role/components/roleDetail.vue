<template>
  <el-dialog
    :title="roleDetailDialogData.roleDetailTitle"
    :visible.sync="roleDetailDialogData.roleDetailDialogVisible"
    width="30%"
    :close-on-click-modal="false"
  >
    <el-form :model="role" :rules="rules" ref="roleForm" label-width="150px">
      <el-form-item label="角色标识" prop="name">
        <el-input v-model="role.name" plachod auto-complete="off" size="medium"></el-input>
      </el-form-item>
      <el-form-item label="角色名" prop="description">
        <el-input v-model="role.description" auto-complete="off" size="medium"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="onSubmit('roleForm')">提交</el-button>
      <el-button @click="resetForm('roleForm')">重置</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {
  createRole,
  updateRole,
  editRole,
  getRoleByTree,
} from '@/api/setting/user_module/role'
const defaultRole = {
  name: '',
  description: '',
  id: '',
}
export default {
  name: 'roleDetail',
  props: {
    roleDetailDialogData: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      role: Object.assign({}, defaultRole),
      rules: {
        name: [
          { required: true, message: '情输入角色唯一标识', trigger: 'blur' },
          {
            min: 2,
            max: 60,
            message: '长度在 2 到 60 个字符',
            trigger: 'blur',
          },
        ],
      },
    }
  },
  created() {
    getRoleByTree({ type: 'tree' }).then((response) => {
      this.roles = response.data.list
    })
  },
  methods: {
    getRoleInfo() {
      //判断是否为修改
      if (this.roleDetailDialogData.isEdit == true) {
        editRole(this.roleDetailDialogData.roleId).then((response) => {
          let roleData = response.data.list
          this.role = Object.assign({}, roleData)
        })
        delete this.rules.name
        delete this.role.name
        delete this.role.description
      } else {
        this.role = Object.assign({}, defaultRole)
      }
    },
    onSubmit(roleForm) {
      this.$refs[roleForm].validate((valid) => {
        if (valid) {
          this.$confirm('是否提交数据', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }).then(() => {
            if (this.roleDetailDialogData.isEdit) {
              updateRole(this.role.id, this.role).then((response) => {
                this.$refs[roleForm].resetFields()
                this.$parent.getList()
                this.roleDetailDialogData.roleDetailDialogVisible = false
              })
            } else {
              createRole(this.role).then((response) => {
                this.$refs[roleForm].resetFields()
                this.role = Object.assign({}, defaultRole)
                this.$parent.getList()
                this.roleDetailDialogData.roleDetailDialogVisible = false
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
    resetForm(roleForm) {
      this.$refs[roleForm].resetFields()
      this.brand = Object.assign({}, defaultRole)
    },
  },
}
</script>

<style>
</style>
