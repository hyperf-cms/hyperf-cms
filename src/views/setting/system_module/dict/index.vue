<template>
  <div class="app-container">
    <conditional-filter
      :listQuery.sync="listQuery"
      :defaultListQuery="defaultListQuery"
      @getList="getList"
    >
      <template slot="extraForm">
        <el-form-item label="字典名称：">
          <el-input
            v-model="listQuery.username"
            class="input-width"
            placeholder="请个选择字典名称："
            @keyup.enter.native="getList"
          ></el-input>
        </el-form-item>
        <el-form-item label="字典标签">
          <el-input
            v-model="listQuery.desc"
            class="input-width"
            placeholder="请输入字典标签"
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
      >添加字典类型</el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="dictTypeTable" :data="list" style="width: 100%;" size="mini">
        <el-table-column label="UID" width="80" align="center">
          <template slot-scope="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column label="用户头像" width="120" align="center">
          <template slot-scope="scope">
            <image-view
              :image_url="scope.row.avatar"
              :image_list="srcList"
              style="width: 65px;height: 65px"
            ></image-view>
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
        <el-table-column label="邮箱" width="140" align="center">
          <template slot-scope="scope">{{scope.row.email}}</template>
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
        <el-table-column label="操作" align="center" width="140">
          <template slot-scope="scope">
            <el-button
              icon="el-icon-edit"
              type="primary"
              size="mini"
              @click="handleEditUser(scope.$index, scope.row)"
            >编辑</el-button>

            <el-button
              icon="el-icon-delete"
              type="danger"
              size="mini"
              @click="handleDeleteUser(scope.$index, scope.row)"
              v-show="scope.row.id != userId"
            >删除</el-button>
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

    <!-- 添加/修改用户 -->
    <dictionary-detail
      ref="dictionaryDetail"
      :dictionaryDetailDialogData="dictionaryDetailDialogData"
    ></dictionary-detail>
  </div>
</template>
<script>
import { dictTypeList } from '@/api/setting/system_module/dictType'
import { formatDate } from '@/utils/date'
import ConditionalFilter from '@/components/ConditionalFilter'
import DictionaryDetail from './components/dictionaryDetail'
import store from '@/store'
const defaultListQuery = {
  cur_page: 1,
  page_size: 20,
  dict_name: '',
  dict_type: '',
  status: null,
}
export default {
  name: 'Api:setting/system_module/dict——type/list-index',
  components: {
    ConditionalFilter,
    DictionaryDetail,
  },
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      defaultListQuery: Object.assign({}, defaultListQuery),
      list: [],
      total: 0,
      roles: [],
      multipleSelection: [],
      dictionaryDetailDialogData: {
        dictionaryDetailDialogVisible: false,
        dictionaryDetailTitle: '',
        isEdit: false,
        userId: '',
      },
    }
  },
  created() {
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
      this.dictionaryDetailDialogData.dictionaryDetailDialogVisible = true
      this.dictionaryDetailDialogData.dictionaryDetailTitle = '添加用户'
      this.dictionaryDetailDialogData.isEdit = false
      this.$refs['dictionaryDetail'].getUserInfo()
    },
    handleEditUser(index, row) {
      this.dictionaryDetailDialogData.dictionaryDetailDialogVisible = true
      this.dictionaryDetailDialogData.dictionaryDetailTitle =
        '修改 "' + row.desc + '" 用户'
      this.dictionaryDetailDialogData.isEdit = true
      this.dictionaryDetailDialogData.userId = row.id
      this.$refs['dictionaryDetail'].getUserInfo()
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
      dictTypeList(this.listQuery).then((response) => {
        this.total = response.data.total
        for (let i = 0; i < this.list.length; i++) {
          this.srcList.push(this.list[i].avatar)
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
