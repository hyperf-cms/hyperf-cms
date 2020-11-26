<template> 
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button style="float:right" type="primary" @click="handleSearchList()" size="small">
          查询搜索
        </el-button>
        <el-button style="float:right;margin-right: 15px" @click="handleResetSearch()" size="small">
          重置
        </el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small">
          <el-form-item label="输入搜索：">
            <el-input v-model="listQuery.description" class="input-width" placeholder="组名"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-button style="float: right;" icon="el-icon-plus" type="primary" size="mini" @click="handleViewRole('add', '')">添加组
      </el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="roleTable" :data="list" style="width: 100%;" v-loading="listLoading" size="mini">
        <el-table-column type="selection" width="60" align="center"></el-table-column>
        <el-table-column sortable label="Id" prop="id" width="80" align="center">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column>
        <el-table-column label="组标识" prop="name" width="180" align="center">
          <template slot-scope="scope">{{scope.row.name}}</template>
        </el-table-column>
        <el-table-column sortable label="组名" width="180" align="center">
          <template slot-scope="scope">{{scope.row.description}}</template>
        </el-table-column>
        <el-table-column sortable label="创建时间" width="400" prop="last_login" align="center">
          <template slot-scope="scope">{{ scope.row.created_at }}</template>
        </el-table-column>
        <el-table-column sortable label="更新时间" width="400" prop="last_login" align="center">
          <template slot-scope="scope">{{ scope.row.updated_at }}</template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button icon="el-icon-edit" type="primary" size="mini" @click="handleViewRole('edit',scope.row)" v-if="scope.row.name != 'super_admin'">编辑</el-button>
            <el-button icon="el-icon-key" type="success" class="button-color-green" size="mini" @click="handleViewPermission(scope.$index, scope.row)" v-if="scope.row.name != 'super_admin'">功能权限</el-button>
            <el-button icon="el-icon-unlock" type="warning" class="button-color-violet" size="mini" @click="handleViewDataPermission(scope.$index, scope.row)" v-if="scope.row.name != 'super_admin'">数据权限</el-button>
            <el-button v-if="scope.row.name == 'super_admin'" icon="el-icon-reset" type="danger" size="mini">该组为系统最高权限/不可编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" layout="total, sizes,prev, pager, next,jumper" :current-page.sync="listQuery.cur_page" :page-size="listQuery.page_size" :page-sizes="[10,20,30,50,80,100]" :total="total">
      </el-pagination>
    </div>
    <!-- 功能权限设置 -->
    <el-dialog title="功能权限设置" :visible.sync="permissionDialogVisible" width="35%" :close-on-click-modal="false" v-loading="true" >
      <el-input size="medium" placeholder="输入关键字进行过滤" v-model="filterPermissionText">
      </el-input>
      <el-divider></el-divider>
      <el-tree :data="permissionDialogData.list" v-loading="permissionLoading" :props="permissionDialogData.defaultProps" ref="tree" :current-node-key="permissionDialogData.checkedList" node-key="name" :check-strictly="checkStrictly" :default-expanded-keys="permissionDialogData.defaultCheckedList" :default-checked-keys="permissionDialogData.defaultCheckedList" show-checkbox :filter-node-method="filterNode">
      </el-tree>
      <div slot="footer">
        <el-button size="small" type="warning" @click="checkStrictly = false">开启关联</el-button>
        <el-button size="small" @click="permissionDialogVisible = false">取 消</el-button>
        <el-button size="small" type="primary"  @click="handleAddRolePermission()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 数据权限设置 -->
    <el-dialog title="数据权限设置" :visible.sync="dataPermissionDialogVisible" width="35%" :close-on-click-modal="false" >
      <el-input size="medium" placeholder="输入关键字进行过滤" v-model="filterDataPermissionText">
      </el-input>
      <el-divider></el-divider>
      <el-tree :data="dataPermissionDialogData.list"  v-loading="permissionLoading" :props="dataPermissionDialogData.defaultProps" ref="dataPermissionTree" :current-node-key="dataPermissionDialogData.checkedList" node-key="name" :check-strictly="checkStrictly" :default-expanded-keys="dataPermissionDialogData.defaultCheckedList" :default-checked-keys="dataPermissionDialogData.defaultCheckedList" show-checkbox :filter-node-method="filterNode">
      </el-tree>
      <div slot="footer">
        <el-button size="small" type="warning" @click="checkStrictly = false">开启关联</el-button>
        <el-button size="small" @click="dataPermissionDialogVisible = false">取 消</el-button>
        <el-button size="small" type="primary"  @click="handleAddRoleDataPermission()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 添加/修改组 -->
    <el-dialog title="添加组" :visible.sync="createRoleDialogVisible" width="500px" :close-on-click-modal="false">
      <el-form ref="roleForm" :model="roleForm" :rules="roleRules" label-width="80px">
        <el-form-item label="组标识" prop="name">
          <el-input v-model="roleForm.name" plachod auto-complete="off" size="medium"></el-input>
        </el-form-item>
        <el-form-item label="组名" prop="description">
          <el-input v-model="roleForm.description" auto-complete="off" size="medium"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button size="small" @click="createRoleDialogVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="handleAddRole()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getRole, deleteRole, createRole, updateRole } from '@/api/auth/role'
import { getPermission,giveRolePermission } from '@/api/auth/permission'
import { formatDate } from '@/utils/date';
import store from '@/store'
const defaultListQuery = {
  cur_page: 1,
  page_size: 20,
};
export default {
  name: "roleList",
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      listLoading: true,
      permissionLoading: false,
      checkStrictly: true,
      list: null,
      type: null,
      total: null,
      operateType: null,
      multipleSelection: [],
      filterPermissionText: '',
      filterDataPermissionText: '',
      closeOrder: {
        dialogVisible: false,
        content: null,
        orderIds: []
      },
      permissionDialogData: {
        list: null,
        defaultProps: {
          children: 'children',
          label: 'display_name'
        },
        defaultCheckedList: null,
        checkedList: null,
        role_id: null,
      },
      dataPermissionDialogData: {
        list: null,
        defaultProps: {
          children: 'children',
          label: 'display_name'
        },
        defaultCheckedList: null,
        checkedList: null,
        role_id: null,
      },
      permissionDialogVisible: false,
      createRoleDialogVisible: false,
      dataPermissionDialogVisible: false,
      roleForm: {
        id: null,
        name: null,
        description: null,
      },
      roleRules: {
        name: [
          { required: true, message: '请输入组名称', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请输入描述', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getList();
  },
  watch: {
    filterPermissionText(val) {
      this.$refs.tree.filter(val);
    },
    filterDataPermissionText(val) {
      this.$refs.dataPermissionTree.filter(val);
    }
  },
  filters: {
    formatLoginTime(time) {
      let date = new Date(time * 1000);
      return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
    },
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.display_name.indexOf(value) !== -1;
    },
    handleViewPermission(index, row) {
      this.permissionDialogVisible = true;
      this.permissionDialogData.defaultCheckedList = null
      this.getPermission(row.id);
    },
    handleViewDataPermission(index, row) {
      this.dataPermissionDialogVisible = true;
      this.dataPermissionDialogData.defaultCheckedList = null
      this.getDataPermission(row.id);
    },
    handleResetSearch() {
      this.listQuery = Object.assign({}, defaultListQuery);
      this.getList();
    },
    handleSearchList() {
      this.listQuery.pageNum = 1;
      this.getList();
    },
    handleDeleteUser(index, row) {
      this.deleteUser(row.id);
    },
    handleSizeChange(val) {
      this.listQuery.cur_page = 1;
      this.listQuery.page_size = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.cur_page = val;
      this.getList();
    },
    getList() {
      this.listLoading = true;
      getRole(this.listQuery).then(response => {
        this.listLoading = false;
        this.list = response.data.list;
        this.total = response.data.total;
      });
    },
    handleViewRole(type, data) {
      this.createRoleDialogVisible = true
      this.type = type
      if (type == 'edit') {
        this.roleForm.id = data.id
        this.roleForm.name = data.name
        this.roleForm.description = data.description
      } else {
        this.roleForm.id = null
        this.roleForm.name = null
        this.roleForm.description = null
      }
    },
    handleAddRole() {
      this.$refs['roleForm'].validate((valid) => {
        if (valid) {
          this.createRoleDialogVisible = false
          this.listLoading = true
          if (this.type == 'add') {
            createRole({ postData: this.roleForm }).then(response => {
              if (response.errorCode == 200) {
                this.getList();
                this.listLoading = false

              }
            })
          } else {
            updateRole(this.roleForm.id, { postData: this.roleForm }).then(response => {
              if (response.errorCode == 200) {
                this.getList();
                this.listLoading = false
              }
            })
          }
        } else {
          this.$message({
            message: '表单验证不通过',
            type: 'error',
            duration: 1000
          });
          return false;
        }
      });

    },
    deleteUser(id) {
      this.$confirm('是否要进行该删除操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteUser(id).then(response => {

          this.getList();
        });
      })
    },
    getPermission(role_id) {
      getPermission({ type: 'tree' }).then(response => {
        var list = response.data.list
        this.permissionDialogData.list = list
      })

      getPermission({ role_id: role_id }).then(response => {
        var list = response.data.list
        this.$nextTick(() => {
          this.permissionDialogData.defaultCheckedList = list
        })

      })
      this.permissionDialogData.role_id = role_id
    },
    getDataPermission(role_id) {
      getDataPermission({ type: 'tree' }).then(response => {
        var list = response.data.list
        this.dataPermissionDialogData.list = list
      })

      getDataPermission({ role_id: role_id }).then(response => {
        var list = response.data.list
        this.$nextTick(() => {
          this.dataPermissionDialogData.defaultCheckedList = list
        })

      })
      this.dataPermissionDialogData.role_id = role_id
    },

    handleAddRolePermission() {
      this.permissionLoading = true;

      var checkedKeys = this.$refs.tree.getCheckedKeys()
      var halfCheckedKeys = this.$refs.tree.getHalfCheckedKeys()

      var checkedPermission = checkedKeys.concat(halfCheckedKeys)


      var postData = { roleId: this.permissionDialogData.role_id, permissionsAllow: checkedPermission }
      giveRolePermission({ postData: postData }).then(response => {
        this.permissionDialogVisible = false
        this.permissionLoading = false;
      })
      this.checkStrictly = true
    },
    handleAddRoleDataPermission() {
      this.permissionLoading = true;

      var checkedKeys = this.$refs.dataPermissionTree.getCheckedKeys()
      var halfCheckedKeys = this.$refs.dataPermissionTree.getHalfCheckedKeys()

      var checkedPermission = checkedKeys.concat(halfCheckedKeys);
    

      var postData = { roleId: this.dataPermissionDialogData.role_id, dataPermissionsAllow: checkedPermission }
      giveRoleDataPermission({ postData: postData }).then(response => {
        this.dataPermissionDialogVisible = false
         this.permissionLoading = false;
      })
      this.checkStrictly = true
     
    }
  }
}

</script>
<style scoped>
.input-width {
  width: 203px;
}

</style>
