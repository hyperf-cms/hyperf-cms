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
        @click="handleViewPermission('add', '', '0', '顶级')"
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
          <template slot-scope="scope">{{ scope.row.status | status}}</template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import {
  getPermission,
  createPermission,
  deletePermission,
  updatePermission,
} from '@/api/setting/user_module/permission'
import ConditionalFilter from '@/components/ConditionalFilter'
import { formatDate } from '@/utils/date'
const defaultListQuery = {
  display_name: '',
  name: '',
}
export default {
  components: {
    ConditionalFilter,
  },
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      list: null,
      createPermissionDialogVisible: false,
      permissionForm: {
        id: null,
        name: null,
        display_name: null,
        pid: null,
        is_display: 1,
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
    handleViewPermission(type, data, pid, show_name) {
      this.createPermissionDialogVisible = true
      this.type = type
      if (type == 'edit') {
        this.permissionForm.id = data.id
        this.permissionForm.pid = data.pid
        this.permissionForm.is_display = data.is_display
        this.permissionForm.name = data.name
        this.permissionForm.display_name = data.display_name
        this.show_name = data.display_name
      } else {
        this.permissionForm.id = null
        this.permissionForm.pid = pid
        this.permissionForm.is_display = 1
        this.permissionForm.name = null
        this.permissionForm.display_name = null
        this.show_name = show_name
      }
    },
    getList() {
      getPermission(this.listQuery).then((response) => {
        this.list = response.data.list
      })
    },
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
    handleAddPermission() {
      this.$refs['permissionForm'].validate((valid) => {
        if (valid) {
          if (this.type == 'add') {
            createPermission({ postData: this.permissionForm }).then(
              (response) => {
                if (response.errorCode == 200) {
                  this.getList()
                }
              }
            )
          } else {
            updatePermission(this.permissionForm.id, {
              postData: this.permissionForm,
            }).then((response) => {
              if (response.errorCode == 200) {
                this.getList()
              }
            })
          }
        } else {
          this.$message({
            message: '表单验证不通过',
            type: 'success',
            duration: 1000,
          })
          return false
        }
      })
      this.createPermissionDialogVisible = false
    },
    filterNode(value, data) {
      if (!value) return true
      return data.display_name.indexOf(value) !== -1
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
