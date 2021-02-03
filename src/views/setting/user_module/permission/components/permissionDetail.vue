   <!-- 添加/修改权限 -->
      <el-dialog
        :title="show_name"
        :visible.sync="createPermissionDialogVisible"
        width="500px"
        :close-on-click-modal="false"
      >
        <el-form
          ref="permissionForm"
          :model="permissionForm"
          :rules="permissionRule"
          label-width="80px"
        >
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