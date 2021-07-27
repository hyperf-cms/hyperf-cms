<template>
  <div class="app-container">
    <conditional-filter
      excelTitle="角色列表"
      :listQuery.sync="listQuery"
      :defaultListQuery="defaultListQuery"
      :columns.sync="columns"
      :list="list"
      :multipleSelection="multipleSelection"
      :batchDelete="false"
      @getList="getList"
      @handleAdd="handleAdd"
      @handleBatchDelete="handleBatchDelete"
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

    <div class="table-container">
      <el-table
        :data="list"
        style="width: 100%;"
        size="mini"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="60" align="center"></el-table-column>
        <el-table-column
          sortable
          label="ID"
          prop="id"
          width="80"
          align="center"
          v-if="columns[0].visible"
        ></el-table-column>
        <el-table-column
          label="角色标识"
          prop="name"
          width="180"
          align="center"
          v-if="columns[1].visible"
        ></el-table-column>
        <el-table-column
          sortable
          label="角色名"
          prop="description"
          width="180"
          align="center"
          v-if="columns[2].visible"
        ></el-table-column>
        <el-table-column
          sortable
          label="创建时间"
          width="400"
          prop="created_at"
          align="center"
          v-if="columns[3].visible"
        ></el-table-column>
        <el-table-column
          sortable
          label="更新时间"
          width="400"
          prop="updated_at"
          align="center"
          v-if="columns[4].visible"
        ></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              icon="el-icon-edit"
              type="primary"
              size="mini"
              @click="handleEdit(scope.$index, scope.row)"
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
      total: 0,
      multipleSelection: [],
      columns: [
        { key: 0, field: 'id', label: `ID`, visible: true },
        { key: 1, field: 'name', label: `角色标识`, visible: true },
        { key: 2, field: 'description', label: `角色名`, visible: true },
        { key: 3, field: 'created_at', label: `创建时间`, visible: true },
        { key: 4, field: 'updated_at', label: `更新时间`, visible: true },
      ],
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
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
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
    handleAdd() {
      this.roleDetailDialogData.roleDetailDialogVisible = true
      this.roleDetailDialogData.roleDetailTitle = '添加角色'
      this.roleDetailDialogData.isEdit = false
      this.$refs['roleDetail'].getRoleInfo()
    },
    //编辑角色操作
    handleEdit(index, row) {
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
  },
}
</script>
<style scoped>
.input-width {
  width: 203px;
}
</style>
