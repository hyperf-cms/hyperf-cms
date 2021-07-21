<template>
  <div class="app-container">
    <conditional-filter
      :listQuery.sync="listQuery"
      :defaultListQuery="defaultListQuery"
      :columns.sync="columns"
      :list="list"
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
        <el-form-item label="状态选择">
          <el-select v-model="listQuery.status" clearable class="input-width" placeholder="状态选择：">
            <el-option
              v-for="dict in statusOptions"
              :key="dict.dict_value"
              :label="dict.dict_label"
              :value="dict.dict_value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="角色选择：">
          <el-select
            v-model="listQuery.role_name"
            clearable
            class="input-width"
            placeholder="角色选择："
          >
            <el-option
              v-for="(value, key) in roles"
              :key="key"
              :value="value.name"
              :label="value.description"
            ></el-option>
          </el-select>
        </el-form-item>
      </template>
    </conditional-filter>
    <div class="table-container">
      <el-table
        ref="userTable"
        :data="list"
        style="width: 100%;"
        size="mini"
        v-loading="listLoading"
      >
        <el-table-column label="UID" width="80" align="center" prop="id" v-if="columns[0].visible"></el-table-column>
        <el-table-column label="用户头像" width="120" align="center" v-if="columns[1].visible">
          <template slot-scope="scope">
            <image-view
              :image_url="scope.row.avatar"
              :image_list="srcList"
              style="width: 65px;height: 65px"
            ></image-view>
          </template>
        </el-table-column>
        <el-table-column
          sortable
          label="用户账号"
          width="180"
          prop="username"
          align="center"
          v-if="columns[2].visible"
        ></el-table-column>
        <el-table-column
          label="用户名称"
          width="150"
          align="center"
          prop="desc"
          v-if="columns[3].visible"
        ></el-table-column>
        <el-table-column label="角色" align="center" v-if="columns[4].visible">
          <template slot-scope="scope">
            <el-tag
              size="mini"
              v-for="(role, index) in scope.row.roles"
              :key="index"
            >{{ role.description }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="邮箱"
          width="140"
          align="center"
          prop="email"
          v-if="columns[5].visible"
        ></el-table-column>
        <el-table-column sortable label="状态" width="80" align="center" v-if="columns[6].visible">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              :active-value="1"
              :inactive-value="0"
              @change="handleStatusChange(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column
          label="上次登录IP"
          width="140"
          align="center"
          prop="last_ip"
          v-if="columns[7].visible"
        ></el-table-column>
        <el-table-column
          sortable
          label="上次登录时间"
          width="200"
          align="center"
          v-if="columns[8].visible"
        >
          <template slot-scope="scope">{{ parseTime(scope.row.last_login)}}</template>
        </el-table-column>
        <el-table-column
          sortable
          label="创建时间"
          width="180"
          prop="created_at"
          align="center"
          v-if="columns[9].visible"
        ></el-table-column>
        <el-table-column label="权限分配" align="center" width="150">
          <template slot-scope="scope">
            <el-button
              icon="el-icon-key"
              type="primary"
              class="button-color-red"
              size="mini"
              @click="handleViewPermission(scope.row)"
              v-if="scope.row.id != 1"
            >功能权限</el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="140">
          <template slot-scope="scope">
            <el-dropdown size="mini" type="warning" trigger="click" v-if="scope.row.id != 1">
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
                    v-if="scope.row.id != 1"
                  >重置密码</el-button>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
      <Pagination
        v-show="total>0"
        :total="total"
        :page.sync="listQuery.cur_page"
        :limit.sync="listQuery.page_size"
        @pagination="getList"
      ></Pagination>
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
    <permission-detail ref="permissionDetail" :permissionDetailData="permissionDetailData"></permission-detail>

    <!-- 添加/修改用户 -->
    <user-detail ref="userDetail" :userDetailDialogData="userDetailDialogData"></user-detail>
  </div>
</template>
<script>
import {
  userList,
  deleteUser,
  changeStatus,
  resetPassword,
} from '@/api/setting/user_module/user'
import { getRoleByTree } from '@/api/setting/user_module/role'
import UserDetail from './components/userDetail'
import permissionDetail from './components/permissionDetail'
import ImageView from '@/components/ImageView'
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
  name: 'Api:setting/user_module/user/list-index',
  components: {
    UserDetail,
    ImageView,
    permissionDetail,
  },
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      defaultListQuery: Object.assign({}, defaultListQuery),
      resetPasswordForm: Object.assign({}, defaultResetPasswordForm),
      list: [],
      total: 0,
      statusOptions: [],
      sexOptions: [],
      roles: [],
      multipleSelection: [],
      srcList: [],
      resetPasswordDialogVisible: false,
      userDetailDialogData: {
        userDetailDialogVisible: false,
        userDetailTitle: '',
        isEdit: false,
        userId: '',
        statusOptions: [],
        sexOptions: [],
      },
      permissionDetailData: {
        visible: false,
        defaultProps: {
          children: 'child',
          label: 'display_name',
        },
        userId: null,
      },
      columns: [
        { key: 0, field: 'id', label: `UID`, visible: true },
        { key: 1, field: 'avatar', label: `用户头像`, visible: true },
        { key: 2, field: 'username', label: `用户账号`, visible: true },
        { key: 3, field: 'desc', label: `用户名称`, visible: true },
        { key: 4, field: '', label: `角色`, visible: true },
        { key: 5, field: 'email', label: `邮箱`, visible: true },
        { key: 6, field: 'status', label: `状态`, visible: true },
        { key: 7, field: 'last_ip', label: `上次登陆IP`, visible: true },
        { key: 8, field: 'last_login', label: `上次登陆时间`, visible: true },
        { key: 9, field: 'created_at', label: `创建时间`, visible: true },
      ],
      userId: store.getters.userId,
    }
  },
  created() {
    getRoleByTree().then((response) => {
      if (response.code == 200) this.roles = response.data.list
    })
    this.getDicts('sys_user_status').then((response) => {
      if (response.code == 200) this.statusOptions = response.data.list
    })
    this.getDicts('sys_user_sex').then((response) => {
      if (response.code == 200) this.sexOptions = response.data.list
    })
    this.listQuery.role_name = this.activeRole
    this.getList()
  },
  methods: {
    updateView(e) {
      this.$forceUpdate()
    },
    // 编辑用户功能权限
    handleViewPermission(row) {
      this.permissionDetailData.userId = row.id
      this.$refs['permissionDetail'].init()
      this.permissionDetailData.visible = true
    },

    handleViewDataPermission(row) {
      this.dataPermissionData.visible = true
      this.dataPermissionData.defaultCheckedList = null
      this.dataPermissionData.user_id = row.id
      this.$refs['userDataPermission'].getDataPermission(row.id)
    },
    handleViewResetPassword(data) {
      this.resetPasswordForm = Object.assign({}, defaultResetPasswordForm)
      this.resetPasswordForm.uid = data.id
      this.resetPasswordDialogVisible = true
    },
    handleResetPassword() {
      resetPassword({ postData: this.resetPasswordForm }).then((response) => {
        if (response.code == 200) {
          this.getList()
          this.resetPasswordForm = Object.assign({}, defaultResetPasswordForm)
          this.resetPasswordDialogVisible = false
        }
      })
    },
    handleAddUser() {
      this.userDetailDialogData.userDetailDialogVisible = true
      this.userDetailDialogData.statusOptions = this.statusOptions
      this.userDetailDialogData.sexOptions = this.sexOptions
      this.userDetailDialogData.userDetailTitle = '添加用户'
      this.userDetailDialogData.isEdit = false
      this.$refs['userDetail'].getUserInfo()
    },
    handleEditUser(index, row) {
      this.userDetailDialogData.userDetailDialogVisible = true
      this.userDetailDialogData.statusOptions = this.statusOptions
      this.userDetailDialogData.sexOptions = this.sexOptions
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
        if (response.code == 200) {
          this.listLoading = false
          this.list = response.data.list
          this.total = response.data.total
          for (let i = 0; i < this.list.length; i++) {
            this.srcList.push(this.list[i].avatar)
          }
        }
      })
    },
    deleteUser(id) {
      this.$confirm('是否要进行该删除操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        deleteUser(id).then((response) => {
          if (response.code == 200) this.getList()
        })
      })
    },
    handleClick() {
      this.listQuery.role_name = this.activeRole
      this.getList()
    },
    handleStatusChange(row) {
      let text = row.status === 0 ? '停用' : '启用'
      this.$confirm('确认要"' + text + '""' + row.desc + '"用户吗?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(function () {
          return changeStatus({
            id: row.id,
            status: row.status,
          })
        })
        .catch(function () {
          row.status = row.status === 0 ? 1 : 0
        })
    },
  },
}
</script>
<style scoped>
.input-width {
  width: 203px;
}
</style>
