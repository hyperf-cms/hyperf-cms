<template>
  <div class="app-container">
    <conditional-filter
      :listQuery.sync="listQuery"
      :defaultListQuery="defaultListQuery"
      @getList="getList"
    >
      <template slot="extraForm">
        <el-form-item label="输入搜索：">
          <el-input
            v-model="listQuery.description"
            class="input-width"
            placeholder="角色名"
            @keyup.enter.native="getList"
          ></el-input>
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
        @click="handleAddRole"
      >添加角色</el-button>
    </el-card>
    <div class="table-container">
      <el-table :data="list" style="width: 100%;" size="mini">
        <el-table-column type="selection" width="60" align="center"></el-table-column>
        <el-table-column sortable label="Id" prop="id" width="80" align="center">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column>
        <el-table-column label="角色标识" prop="name" width="180" align="center">
          <template slot-scope="scope">{{scope.row.name}}</template>
        </el-table-column>
        <el-table-column sortable label="角色名" prop="description" width="180" align="center">
          <template slot-scope="scope">{{scope.row.description}}</template>
        </el-table-column>
        <el-table-column sortable label="创建时间" width="400" prop="created_at" align="center">
          <template slot-scope="scope">{{ scope.row.created_at }}</template>
        </el-table-column>
        <el-table-column sortable label="更新时间" width="400" prop="updated_at" align="center">
          <template slot-scope="scope">{{ scope.row.updated_at }}</template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              icon="el-icon-edit"
              type="primary"
              size="mini"
              @click="handleEditRole(scope.$index, scope.row)"
              v-if="scope.row.name != 'super_admin'"
            >编辑</el-button>
            <el-button
              icon="el-icon-key"
              type="success"
              class="button-color-green"
              size="mini"
              @click="handleViewPermission(scope.row)"
              v-if="scope.row.name != 'super_admin'"
            >功能权限</el-button>
            <el-button
              v-if="scope.row.name == 'super_admin'"
              icon="el-icon-reset"
              type="danger"
              size="mini"
            >该角色为系统最高权限/不可编辑</el-button>
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

    <role-detail ref="roleDetail" :roleDetailDialogData="roleDetailDialogData"></role-detail>
    <permission-detail ref="permissionDetail" :permissionDetailData="permissionDetailData"></permission-detail>
  </div>
</template>
<script>
import { getRoleList } from '@/api/setting/user_module/role'
import { formatDate } from '@/utils/date'
import RoleDetail from './components/roleDetail'
import PermissionDetail from './components/permissionDetail'

const defaultListQuery = {
  cur_page: 1,
  page_size: 20,
}
export default {
  name: 'Api:setting/user_module/role/list-index',
  components: {
    RoleDetail,
    PermissionDetail,
  },
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      list: [],
      total: null,
      multipleSelection: [],
      roleDetailDialogData: {
        roleDetailDialogVisible: false,
        roleDetailTitle: '',
        isEdit: false,
        roleId: '',
      },
      permissionDetailData: {
        visible: false,
        defaultProps: {
          children: 'child',
          label: 'display_name',
        },
        userId: null,
      },
    }
  },
  created() {
    this.getList()
  },
  watch: {},
  filters: {
    formatLoginTime(time) {
      let date = new Date(time * 1000)
      return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
    },
  },
  methods: {
    //获取角色列表
    getList() {
      getRoleList(this.listQuery).then((response) => {
        if (response.code == 200) {
          this.list = response.data.list
          this.total = response.data.total
        }
      })
    },
    //添加角色操作
    handleAddRole() {
      this.roleDetailDialogData.roleDetailDialogVisible = true
      this.roleDetailDialogData.roleDetailTitle = '添加角色'
      this.roleDetailDialogData.isEdit = false
      this.$refs['roleDetail'].getRoleInfo()
    },
    //编辑角色操作
    handleEditRole(index, row) {
      this.roleDetailDialogData.roleDetailDialogVisible = true
      this.roleDetailDialogData.roleDetailTitle = '修改 "' + row.desc + '" 用户'
      this.roleDetailDialogData.isEdit = true
      this.roleDetailDialogData.roleId = row.id
      this.$refs['roleDetail'].getRoleInfo()
    },
    // 编辑用户功能权限
    handleViewPermission(row) {
      this.permissionDetailData.roleId = row.id
      this.$refs['permissionDetail'].init()
      this.permissionDetailData.visible = true
    },
    //重置查询
    handleResetSearch() {
      this.listQuery = Object.assign({}, defaultListQuery)
      this.getList()
    },
    //查询操作
    handleSearchList() {
      this.listQuery.pageNum = 1
      this.getList()
    },
    //更改页显示条木材
    handleSizeChange(val) {
      this.listQuery.cur_page = 1
      this.listQuery.page_size = val
      this.getList()
    },
    //分页
    handleCurrentChange(val) {
      this.listQuery.cur_page = val
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
