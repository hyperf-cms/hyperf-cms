<template>
  <div class="app-container">
    <conditional-filter
      :listQuery.sync="listQuery"
      :defaultListQuery="defaultListQuery"
      @getList="getList"
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
        size="small"
        @click="handleAddPermission()"
      >添加权限</el-button>
    </el-card>
    <div class="table-container">
      <el-table
        :data="list"
        style="width: 100%;margin-bottom: 20px;"
        row-key="id"
        size="small"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      >
        <el-table-column prop="display_name" label="菜单名称" width="150"></el-table-column>
        <el-table-column prop="icon" label="图标" align="center" width="150">
          <template slot-scope="scope">
            <svg-icon :icon-class="scope.row.icon" />
          </template>
        </el-table-column>
        <el-table-column prop="sort" label="排序" width="80"></el-table-column>
        <el-table-column prop="name" label="权限标识"></el-table-column>
        <el-table-column prop="component" label="组件路径"></el-table-column>
        <el-table-column prop="status" label="状态" width="180">
          <template slot-scope="scope">{{ scope.row.status | status}}</template>
        </el-table-column>
        <el-table-column prop="created_at" label="创建时间" width="180"></el-table-column>
        <el-table-column label="操作" width="280">
          <template slot-scope="scope">
            <el-button
              icon="el-icon-plus"
              type="primary"
              size="mini"
              @click="handleAddPermission(scope.row)"
            >添加</el-button>
            <el-button
              icon="el-icon-edit"
              type="warning"
              size="mini"
              @click="handleEditPermission(scope.row)"
            >编辑</el-button>
            <el-button
              icon="el-icon-delete"
              type="danger"
              size="mini"
              @click="handleDeletePermission(scope.row)"
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
import ConditionalFilter from '@/components/ConditionalFilter'
import PermissionDetail from './components/permissionDetail'
const defaultListQuery = {
  display_name: '',
  name: '',
  status: '',
}
export default {
  components: {
    ConditionalFilter,
    PermissionDetail,
  },
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      list: [],
      permissionDetailDialogData: {
        permissionDetailDialogVisible: false,
        permissionDetailTitle: '',
        isEdit: false,
        permissionId: '',
      },
    }
  },
  created() {
    this.getList()
  },
  filters: {
    status(status) {
      if (status == 0) return '停用'
      if (status == 1) return '正常'
    },
  },
  watch: {},
  methods: {
    //获取权限列表
    getList() {
      getPermission(this.listQuery).then((response) => {
        this.list = response.data.list
      })
    },
    //添加权限操作
    handleAddPermission(row) {
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
    handleEditPermission(row) {
      this.permissionDetailDialogData.permissionDetailDialogVisible = true
      this.permissionDetailDialogData.permissionDetailTitle =
        '修改 "' + row.display_name + '" 权限'
      this.permissionDetailDialogData.isEdit = true
      this.permissionDetailDialogData.permissionId = row.id
      this.$refs['permissionDetail'].getPermissionInfo()
      this.$refs['permissionDetail'].getTreeselect()
    },
    //删除权限操作
    deletePermission(id) {
      this.$confirm('是否要进行该删除操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        deletePermission(id).then((response) => {
          this.getList()
        })
      })
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
