<template>
  <div class="app-container">
    <el-tabs v-model="activeRole" @tab-click="handleClick" style="border-bottom: none">
      <el-tab-pane label="全部" name="0"></el-tab-pane>
      <el-tab-pane v-for="(item, key) in roles" :key="key" :label="item" :name="key"></el-tab-pane>
    </el-tabs>
    <conditional-filter
      :listQuery.sync="listQuery"
      :defaultListQuery="defaultListQuery"
      @getList="getList"
    >
      <template slot="extraForm">
        <el-form-item label="账号搜索：">
          <el-input
            v-model="listQuery.username"
            class="input-width"
            placeholder="账号搜索："
            @keyup.enter.native="getList"
          ></el-input>
        </el-form-item>
        <el-form-item label="名称搜索：">
          <el-input
            v-model="listQuery.desc"
            class="input-width"
            placeholder="名称搜索："
            @keyup.enter.native="getList"
          ></el-input>
        </el-form-item>
        <el-form-item label="状态选择：">
          <el-select v-model="listQuery.status" clearable class="input-width" placeholder="状态选择：">
            <el-option value="1" label="正常"></el-option>
            <el-option value="0" label="停用"></el-option>
          </el-select>
        </el-form-item>
      </template>
    </conditional-filter>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-button
        style="float: right;"
        icon="el-icon-plus"
        type="primary"
        size="mini"
        @click="handleAddUser"
      >创建用户</el-button>
    </el-card>
    <div class="table-container">
      <el-table
        ref="userTable"
        :data="list"
        style="width: 100%;"
        size="mini"
        v-loading="listLoading"
      >
        <el-table-column label="UID" width="80" align="center">
          <template slot-scope="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column label="用户头像" width="120" align="center">
          <template slot-scope="scope">
            <img style="width: 65px;height: 65px" :src="scope.row.avatar" />
          </template>
        </el-table-column>
        <el-table-column sortable label="用户账号" prop="username" align="center">
          <template slot-scope="scope">{{scope.row.username}}</template>
        </el-table-column>
        <el-table-column label="用户名称" width="150" align="center">
          <template slot-scope="scope">{{scope.row.desc}}</template>
        </el-table-column>
        <el-table-column label="角色" align="center">
          <template slot-scope="scope">
            <el-tag
              size="mini"
              v-for="(role, index) in scope.row.roles"
              :key="index"
            >{{ role.description }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="手机号码" width="140" align="center">
          <template slot-scope="scope">{{scope.row.mobile}}</template>
        </el-table-column>
        <el-table-column sortable label="状态" width="80" align="center">
          <template slot-scope="scope">{{scope.row.status | status}}</template>
        </el-table-column>
        <el-table-column label="上次登录IP" width="140" align="center">
          <template slot-scope="scope">{{scope.row.last_ip}}</template>
        </el-table-column>
        <el-table-column sortable label="上次登录时间" width="200" align="center">
          <template slot-scope="scope">{{scope.row.last_login | formatLoginTime}}</template>
        </el-table-column>
        <el-table-column sortable label="创建时间" width="180" prop="last_login" align="center">
          <template slot-scope="scope">{{ scope.row.created_at }}</template>
        </el-table-column>
        <el-table-column label="权限分配" align="center" width="150">
          <template slot-scope="scope">
            <el-dropdown size="mini" type="warning" trigger="click">
              <el-button icon="el-icon-menu" type="primary" size="mini" class="button-color-red">
                权限菜单
                <i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item divided>
                  <el-button
                    icon="el-icon-key"
                    type="primary"
                    class="button-color-green"
                    size="mini"
                    @click="handleViewPermission(scope.row)"
                  >功能权限</el-button>
                </el-dropdown-item>
                <el-dropdown-item divided>
                  <el-button
                    icon="el-icon-unlock"
                    type="primary"
                    class="button-color-violet"
                    size="mini"
                    @click="handleViewDataPermission(scope.row)"
                  >数据权限</el-button>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="140">
          <template slot-scope="scope">
            <el-dropdown size="mini" type="warning" trigger="click">
              <el-button icon="el-icon-more" type="primary" size="mini" class="button-color-violet">
                操作菜单
                <i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item divided>
                  <el-button
                    icon="el-icon-edit"
                    type="primary"
                    size="mini"
                    @click="handleEditUser(scope.$index, scope.row)"
                  >编辑</el-button>
                </el-dropdown-item>
                <el-dropdown-item divided>
                  <el-button
                    icon="el-icon-delete"
                    type="danger"
                    size="mini"
                    @click="handleDeleteUser(scope.$index, scope.row)"
                    v-show="scope.row.id != userId"
                  >删除</el-button>
                </el-dropdown-item>
                <el-dropdown-item divided>
                  <el-button
                    icon="el-icon-reset"
                    type="info"
                    size="mini"
                    @click="handleViewResetPassword(scope.row)"
                  >重置密码</el-button>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes,prev, pager, next,jumper"
        :current-page.sync="listQuery.cur_page"
        :page-size="listQuery.page_size"
        :page-sizes="[10,20,30,50,80,100]"
        :total="total"
      ></el-pagination>
    </div>
    <!-- 重置密码 -->
    <el-dialog
      title="重置密码"
      :visible.sync="resetPasswordDialogVisible"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form ref="roleForm" :model="resetPasswordForm" label-width="80px">
        <el-form-item label="新密码">
          <el-input
            type="password"
            v-model="resetPasswordForm.new_password"
            auto-complete="off"
            size="medium"
          ></el-input>
        </el-form-item>
        <el-form-item label="确认密码">
          <el-input
            type="password"
            v-model="resetPasswordForm.confirm_password"
            auto-complete="off"
            size="medium"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button size="small" @click="resetPasswordDialogVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="handleResetPassword()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 权限设置 -->
    <user-permission ref="userPermission" :permissionData="permissionData"></user-permission>
    <!-- 添加/修改用户 -->
    <user-detail ref="userDetail" :userDetailDialogData="userDetailDialogData"></user-detail>
  </div>
</template>
<script>
import { userList, deleteUser, resetPassword } from '@/api/auth/user'
import { formatDate } from '@/utils/date'
import { getRoleByTree } from '@/api/auth/role'
import UserDetail from './components/userDetail'
import UserPermission from './components/userPermission'
import ConditionalFilter from '@/components/ConditionalFilter'
import store from '@/store'
const defaultListQuery = {
  cur_page: 1,
  page_size: 20,
  role_name: null,
}
const defaultResetPasswordForm = {
  uid: null,
  old_password: null,
  new_password: null,
  confirm_password: null,
}
export default {
  name: 'userList',
  components: { UserDetail, UserPermission, ConditionalFilter },
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      defaultListQuery: Object.assign({}, defaultListQuery),
      resetPasswordForm: Object.assign({}, defaultResetPasswordForm),
      list: [],
      total: 0,
      roles: [],
      activeRole: null,
      multipleSelection: [],
      resetPasswordDialogVisible: false,
      userDetailDialogData: {
        userDetailDialogVisible: false,
        userDetailTitle: '',
        isEdit: false,
        userId: '',
      },
      permissionData: {
        permissonDialogVisible: false,
        list: null,
        defaultProps: {
          children: 'children',
          label: 'display_name',
        },
        defaultCheckedList: null,
        checkedList: null,
        user_id: null,
      },
      dataPermissionData: {
        dataPermissonDialogVisible: false,
        list: null,
        defaultProps: {
          children: 'children',
          label: 'display_name',
        },
        defaultCheckedList: null,
        checkedList: null,
        user_id: null,
      },
      userId: store.getters.userId,
    }
  },
  created() {
    getRoleByTree().then((response) => {
      this.roles = response.data.list
    })
    this.listQuery.role_name = this.activeRole
    this.getList()
  },
  filters: {
    formatLoginTime(time) {
      let date = new Date(time * 1000)
      return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
    },
    status(status) {
      if (status == 0) return '停用'
      if (status == 1) return '正常'
    },
  },
  methods: {
    updateView(e) {
      this.$forceUpdate()
    },
    handleViewPermission(row) {
      this.permissionData.permissonDialogVisible = true
      this.permissionData.defaultCheckedList = null
      this.permissionData.user_id = row.id
      this.$refs['userPermission'].getPermission(row.id)
    },
    handleViewDataPermission(row) {
      this.dataPermissionData.dataPermissonDialogVisible = true
      this.dataPermissionData.defaultCheckedList = null
      this.dataPermissionData.user_id = row.id
      this.$refs['userDataPermission'].getDataPermission(row.id)
    },
    handleViewResetPassword(data) {
      this.resetPasswordForm.uid = data.id
      this.resetPasswordDialogVisible = true
    },
    handleResetPassword() {
      resetPassword({ postData: this.resetPasswordForm }).then((response) => {
        this.getList()
        this.resetPasswordForm = Object.assign({}, defaultResetPasswordForm)
        this.resetPasswordDialogVisible = false
      })
    },
    handleAddUser() {
      this.userDetailDialogData.userDetailDialogVisible = true
      this.userDetailDialogData.userDetailTitle = '添加用户'
      this.userDetailDialogData.isEdit = false
      this.$refs['userDetail'].getUserInfo()
    },
    handleEditUser(index, row) {
      console.log(row)
      this.userDetailDialogData.userDetailDialogVisible = true
      this.userDetailDialogData.userDetailTitle = '修改 "' + row.desc + '" 用户'
      this.userDetailDialogData.isEdit = true
      this.userDetailDialogData.userId = row.id
      this.$refs['userDetail'].getUserInfo()
    },
    handleDeleteUser(index, row) {
      this.deleteUser(row.id)
    },
    handleSizeChange(val) {
      this.listQuery.cur_page = 1
      this.listQuery.page_size = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.cur_page = val
      this.getList()
    },
    getList() {
      userList(this.listQuery).then((response) => {
        this.listLoading = false
        this.list = response.data.list
        this.total = response.data.total
      })
    },

    deleteUser(id) {
      this.$confirm('是否要进行该删除操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        deleteUser(id).then((response) => {
          this.getList()
        })
      })
    },
    handleClick() {
      this.listQuery.role_name = this.activeRole
      this.getList()
    },
  },
}
</script>
<style scoped>
.input-width {
  width: 203px;
}
</style>
