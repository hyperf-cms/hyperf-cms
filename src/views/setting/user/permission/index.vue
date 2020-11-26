<template> 
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-button style="float: right;" icon="el-icon-plus" type="primary" size="small" @click="handleViewPermission('add', '', '0', '顶级')">添加权限
      </el-button>
    </el-card>
    <div class="tree">
      <el-card class="operate-container" shadow="never">
        <el-input size="medium" placeholder="输入关键字进行过滤" v-model="filterText">
        </el-input>
        <el-divider></el-divider>
        <el-tree :data="data" node-key="id" :indent="40" ref="tree" :props="defaultProps" :expand-on-click-node="false" :filter-node-method="filterNode">
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span>{{ node.label }}</span>
            <span>
              <el-button type="success" icon="el-icon-plus" circle size="medium" @click="() => handleViewPermission('add', '', data.id, node.label)">
              </el-button>
              <el-button type="primary" icon="el-icon-edit" circle size="medium" @click="() => handleViewPermission('edit', data, data.id, node.label)">
              </el-button>
              <el-button type="danger" icon="el-icon-delete" circle size="medium" @click="() => deletePermission(data.id)">
              </el-button>
            </span>
          </span>
        </el-tree>
      </el-card>
      <!-- 添加/修改权限 -->
      <el-dialog :title="show_name" :visible.sync="createPermissionDialogVisible" width="500px" :close-on-click-modal="false">
        <el-form ref="permissionForm" :model="permissionForm" :rules="permissionRule" label-width="80px">
          <el-form-item label="权限名" prop="name">
            <el-input v-model="permissionForm.name" auto-complete="off" size="medium"></el-input>
          </el-form-item>
          <el-form-item label="权限描述" prop="display_name">
            <el-input v-model="permissionForm.display_name" auto-complete="off" size="medium"></el-input>
          </el-form-item>
          <el-form-item label="是否显示">
            <el-radio-group v-model="permissionForm.is_display">
              <el-radio :label="1">启动</el-radio>
              <el-radio :label="0">停用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <div slot="footer">
          <el-button size="small" @click="createPermissionDialogVisible = false">取 消</el-button>
          <el-button size="small" type="primary" @click="handleAddPermission()">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
  import {getPermission, createPermission, deletePermission, updatePermission} from '@/api/auth/permission'
  import {formatDate} from '@/utils/date';
  import store from '@/store'
  export default {
    data() {
      return {
        data: null,
        show_name: '顶级',
        createPermissionDialogVisible: false,
        filterText: '',
        defaultProps: {
          children: 'children',
          label: 'display_name'
        },
        permissionForm: {
          id: null,
          name: null,
          display_name: null,
          pid: null,
          is_display: 1,
        },
        permissionRule: {
            name: [
              { required: true, message: '请输入权限名称', trigger: 'blur' }
            ],
            display_name: [
              { required: true, message: '请输入权限描述', trigger: 'blur' }
            ]
        }
      };
    },
     created() {
      this.getList();
    },
    watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
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
        }else{
            this.permissionForm.id = null
            this.permissionForm.pid = pid
            this.permissionForm.is_display = 1
            this.permissionForm.name = null          
            this.permissionForm.display_name = null
            this.show_name = show_name
        }
      },
      getList() {
        getPermission({type: 'tree'}).then(response => {
          this.data = response.data.list
        });
      },
      deletePermission(id){
        this.$confirm('是否要进行该删除操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deletePermission(id).then(response=>{
            this.getList();
          });
        })
      },
      handleAddPermission() {
        this.$refs['permissionForm'].validate((valid) => {
          if (valid) {
            if (this.type == 'add') {
              createPermission({postData: this.permissionForm}).then(response => {
                  if (response.errorCode == 200) {
                      this.getList();
                  }
              })
            }else{
              updatePermission(this.permissionForm.id,{postData: this.permissionForm}).then(response => {
                  if (response.errorCode == 200) {
                      this.getList();
                  }
              })
            }
            
           }else {
            this.$message({
              message: '表单验证不通过',
              type: 'success',
              duration:1000
            });
            return false;
          }
        });
        this.createPermissionDialogVisible = false
      },
      filterNode(value, data) {
        if (!value) return true;
        return data.display_name.indexOf(value) !== -1;
      },
    }
  };  
</script>
<style type="text/css">
.tree .el-tree-node__content {
  height: 45px;
  line-height: 40px;
}

</style>
<style scoped>
.input-width {
  width: 203px;

}

.tree {
  margin-top: 20px;
}

.el-tree>.el-tree-node__content {

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
