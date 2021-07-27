<template>
  <div class="app-container">
    <conditional-filter
      :listQuery.sync="listQuery"
      :defaultListQuery="defaultListQuery"
      :columns.sync="columns"
      :list="list"
      :multipleSelection="multipleSelection"
      :batchDelete="false"
      @getList="getList"
      @handleAdd="handleAdd"
      @handleBatchDelete="handleBatchDelete"
      excelTitle="权限列表"
    >
      <template slot="extraForm">
        <el-form-item label="权限名搜索：">
          <el-input
            v-model="listQuery.display_name"
            class="input-width"
            placeholder="账号搜索："
            @keyup.enter.native="getList"
          ></el-input>
        </el-form-item>
        <el-form-item label="权限标识搜索：">
          <el-input
            v-model="listQuery.name"
            class="input-width"
            placeholder="权限标识搜索："
            @keyup.enter.native="getList"
          ></el-input>
        </el-form-item>
        <el-form-item label="状态选择：">
          <el-select v-model="listQuery.status" clearable class="input-width" placeholder="状态选择：">
            <el-option
              v-for="dict in statusOptions"
              :key="dict.dict_value"
              :label="dict.dict_label"
              :value="dict.dict_value"
            ></el-option>
          </el-select>
        </el-form-item>
      </template>
    </conditional-filter>
    <div class="table-container">
      <el-table
        :data="list"
        style="width: 100%;margin-bottom: 20px;"
        row-key="id"
        size="small"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      >
        <el-table-column prop="display_name" label="菜单名称" width="200" v-if="columns[0].visible"></el-table-column>
        <el-table-column
          prop="icon"
          label="图标"
          align="center"
          width="150"
          v-if="columns[1].visible"
        >
          <template slot-scope="scope">
            <svg-icon :icon-class="scope.row.icon" />
          </template>
        </el-table-column>
        <el-table-column prop="sort" label="排序" width="80" v-if="columns[2].visible"></el-table-column>
        <el-table-column prop="name" label="权限标识" v-if="columns[3].visible"></el-table-column>
        <el-table-column prop="component" label="组件路径" v-if="columns[4].visible"></el-table-column>
        <el-table-column
          prop="status"
          label="状态"
          width="80"
          :formatter="statusFormat"
          v-if="columns[5].visible"
        ></el-table-column>
        <el-table-column prop="created_at" label="创建时间" width="180" v-if="columns[6].visible"></el-table-column>
        <el-table-column label="操作" width="280">
          <template slot-scope="scope">
            <el-button
              icon="el-icon-plus"
              type="primary"
              size="mini"
              @click="handleAdd(scope.row)"
            >添加</el-button>
            <el-button
              icon="el-icon-edit"
              type="warning"
              size="mini"
              @click="handleEdit(scope.row)"
            >编辑</el-button>
            <el-button
              icon="el-icon-delete"
              type="danger"
              size="mini"
              @click="handleDelete(scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <permission-detail
        ref="permissionDetail"
        :permissionDetailDialogData="permissionDetailDialogData"
      ></permission-detail>
    </div>
  </div>
</template>
<script>
import {
  getPermission,
  deletePermission,
} from '@/api/setting/user_module/permission'
import PermissionDetail from './components/permissionDetail'
const defaultListQuery = {
  display_name: '',
  name: '',
  status: '',
}
export default {
  components: {
    PermissionDetail,
  },
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      list: [],
      statusOptions: [],
      permissionDetailDialogData: {
        permissionDetailDialogVisible: false,
        permissionDetailTitle: '',
        isEdit: false,
        permissionId: '',
      },
      columns: [
        { key: 0, field: 'display_name', label: `菜单名称`, visible: true },
        { key: 1, field: 'icon', label: `图标`, visible: true },
        { key: 2, field: 'sort', label: `排序`, visible: true },
        { key: 3, field: 'name', label: `权限标识`, visible: true },
        { key: 4, field: 'component', label: `组件路径`, visible: true },
        { key: 5, field: 'status', label: `状态`, visible: true },
        { key: 6, field: 'created_at', label: `创建时间`, visible: true },
      ],
    }
  },
  created() {
    this.getList()
    this.getDicts('sys_permission_status').then((response) => {
      if (response.code == 200) this.statusOptions = response.data.list
    })
  },
  watch: {},
  methods: {
    //获取权限列表
    getList() {
      getPermission(this.listQuery).then((response) => {
        if (response.code == 200) this.list = response.data.list
      })
    },
    //添加权限操作
    handleAdd(row) {
      if (row != undefined) {
        this.permissionDetailDialogData.parent_id = row.id
      } else {
        this.permissionDetailDialogData.parent_id = 0
      }
      this.permissionDetailDialogData.permissionDetailDialogVisible = true
      this.permissionDetailDialogData.permissionDetailTitle = '添加权限'
      this.permissionDetailDialogData.isEdit = false
      this.$refs['permissionDetail'].getPermissionInfo()
      this.$refs['permissionDetail'].getTreeselect()
    },
    //编辑权限操作
    handleEdit(row) {
      this.permissionDetailDialogData.permissionDetailDialogVisible = true
      this.permissionDetailDialogData.permissionDetailTitle =
        '修改 "' + row.display_name + '" 权限'
      this.permissionDetailDialogData.isEdit = true
      this.permissionDetailDialogData.permissionId = row.id
      this.$refs['permissionDetail'].getPermissionInfo()
      this.$refs['permissionDetail'].getTreeselect()
    },
    handleDelete(row) {
      this.deletePermission(row.id)
    },
    //删除权限操作
    deletePermission(id) {
      this.$confirm('是否要进行该删除操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        deletePermission(id).then((response) => {
          if (response.code == 200) this.getList()
        })
      })
    },
    // 权限状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status)
    },
  },
}
</script>
<style type="text/css">
</style>
<style scoped>
.input-width {
  width: 203px;
}

.tree {
  margin-top: 20px;
}

.el-tree > .el-tree-node__content {
  height: 46px;
}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 16px;
  padding-right: 8px;
}
</style>
