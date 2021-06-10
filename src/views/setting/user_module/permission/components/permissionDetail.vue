<template>
  <el-dialog
    :title="permissionDetailDialogData.permissionDetailTitle"
    :visible.sync="permissionDetailDialogData.permissionDetailDialogVisible"
    width="600px"
    :close-on-click-modal="false"
  >
    <el-form
      ref="permissionForm"
      :model="permission"
      :rules="rules"
      label-width="80px"
      size="medium"
    >
      <el-row>
        <el-col :span="24">
          <el-form-item label="上级菜单">
            <treeselect
              v-model="permission.parent_id"
              :options="menuOptions"
              :normalizer="normalizer"
              :show-count="true"
              placeholder="选择上级菜单"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="权限类型" prop="type">
            <el-radio-group v-model="permission.type">
              <el-radio :label="1">菜单</el-radio>
              <el-radio :label="2">按钮</el-radio>
              <el-radio :label="3">接口</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item v-if="permission.type == 1" label="菜单图标">
            <el-popover
              placement="bottom-start"
              width="460"
              trigger="click"
              @show="$refs['iconSelect'].reset()"
            >
              <IconSelect ref="iconSelect" @selected="selected" />
              <el-input slot="reference" v-model="permission.icon" placeholder="点击选择图标" readonly>
                <svg-icon
                  v-if="permission.icon"
                  slot="prefix"
                  :icon-class="permission.icon"
                  class="el-input__icon"
                  style="height: 32px;width: 16px;"
                />
                <i v-else slot="prefix" class="el-icon-search el-input__icon" />
              </el-input>
            </el-popover>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="显示排序" prop="orderNum">
            <el-input-number v-model="permission.sort" controls-position="right" :min="0" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="权限名称" prop="display_name">
            <el-input v-model="permission.display_name" placeholder="请输入权限名称" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="权限描述" prop="display_desc">
            <el-input v-model="permission.display_desc" placeholder="请输入权限描述" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item v-if="permission.type == 1" label="路由地址" prop="path">
            <el-input v-model="permission.url" placeholder="请输入路由地址" />
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="permission.type == 1">
          <el-form-item label="组件路径" prop="component">
            <el-input v-model="permission.component" placeholder="请输入组件路径" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="权限标识">
            <el-input v-model="permission.name" placeholder="请权限标识" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item v-if="permission.type == '1'" label="是否隐藏">
            <el-radio-group v-model="permission.hidden">
              <el-radio
                v-for="dict in permissionHiddenOptions"
                :key="dict.dict_value"
                :label="dict.dict_value"
              >{{dict.dict_label}}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="菜单状态">
            <el-radio-group v-model="permission.status">
              <el-radio
                v-for="dict in permissionStatusOptions"
                :key="dict.dict_value"
                :label="dict.dict_value"
              >{{dict.dict_label}}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="onSubmit('permissionForm')">提交</el-button>
      <el-button @click="resetForm('permissionForm')">重置</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {
  getPermission,
  editPermission,
  createPermission,
  updatePermission,
} from '@/api/setting/user_module/permission'
import { validatPhone } from '@/utils/validate'
import SingleUpload from '@/components/Upload/singleUpload'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import IconSelect from '@/components/IconSelect'
import { handleTree } from '@/utils/functions'

const defaultPermission = {
  parent_id: 0,
  name: '',
  display_name: '',
  display_desc: '',
  url: '',
  component: '',
  icon: '',
  type: 1,
  hidden: 0,
  status: 1,
  sort: '',
}
export default {
  name: 'permissionDetail',
  components: { SingleUpload, Treeselect, IconSelect },
  props: {
    permissionDetailDialogData: {
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
      permission: Object.assign({}, defaultPermission),
      menuOptions: [],
      permissionHiddenOptions: [],
      permissionStatusOptions: [],
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
            min: 2,
            max: 18,
            message: '长度在 2 到 18 个字符',
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
    this.getDicts('sys_permission_hidden').then((response) => {
      this.permissionHiddenOptions = response.data.list
    })
    this.getDicts('sys_permission_status').then((response) => {
      this.permissionStatusOptions = response.data.list
    })
  },
  methods: {
    // 选择图标
    selected(name) {
      this.permission.icon = name
    },
    /** 转换菜单数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children
      }
      return {
        id: node.id,
        label: node.display_name,
        children: node.children,
      }
    },
    /** 查询菜单下拉树结构 */
    getTreeselect() {
      getPermission().then((response) => {
        this.menuOptions = []
        const menu = { id: 0, display_name: '主类目', children: [] }
        menu.children = response.data.list
        this.menuOptions.push(menu)
      })
    },
    getPermissionInfo() {
      //判断是否为修改
      if (this.permissionDetailDialogData.isEdit == true) {
        editPermission(this.permissionDetailDialogData.permissionId).then(
          (response) => {
            let permissionData = response.data.list
            this.permission = Object.assign({}, permissionData)
          }
        )
      } else {
        this.permission = Object.assign({}, defaultPermission)
        this.permission.parent_id = this.permissionDetailDialogData.parent_id
      }
    },
    onSubmit(permissionForm) {
      this.$refs[permissionForm].validate((valid) => {
        if (valid) {
          this.$confirm('是否提交数据', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }).then(() => {
            if (this.permissionDetailDialogData.isEdit) {
              updatePermission(this.permission.id, this.permission).then(
                (response) => {
                  this.$refs[permissionForm].resetFields()
                  this.$parent.getList()
                  this.permissionDetailDialogData.permissionDetailDialogVisible = false
                }
              )
            } else {
              createPermission(this.permission).then((response) => {
                this.$refs[permissionForm].resetFields()
                this.permission = Object.assign({}, defaultPermission)
                this.$parent.getList()
                this.permissionDetailDialogData.permissionDetailDialogVisible = false
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
    resetForm(permissionForm) {
      this.$refs[permissionForm].resetFields()
      this.brand = Object.assign({}, defaultPermission)
    },
  },
}
</script>

<style>
</style>
