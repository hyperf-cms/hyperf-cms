<template>
  <el-dialog title="功能权限设置" :visible.sync="permissionData.permissonDialogVisible" width="35%"
    :close-on-click-modal="false">
    <el-input size="medium" placeholder="输入关键字进行过滤" v-model="filterPermissionText"></el-input>
    <el-divider></el-divider>
    <el-tree :data="permissionData.list" v-loading="permissionLoading" :props="permissionData.defaultProps" ref="tree"
      :current-node-key="permissionData.checkedList" node-key="name" :check-strictly="checkStrictly"
      :default-expanded-keys="permissionData.defaultCheckedList"
      :default-checked-keys="permissionData.defaultCheckedList" show-checkbox :filter-node-method="filterNode">
    </el-tree>
    <div slot="footer">
      <el-button size="small" type="warning" @click="checkStrictly = false">开启关联</el-button>
      <el-button size="small" @click="permissionData.permissonDialogVisible = false">取 消</el-button>
      <el-button size="small" type="primary" @click="handleAddUserPermission()">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { getPermission, giveUserPermission } from "@/api/auth/permission";

export default {
  name: "UserPermission",
  props: {
    permissionData: {
      type: Object,
      default: {},
    },
    user_id: {
      type: String,
      default: 0,
    },
  },
  data() {
    return {
      checkStrictly: true,
      permissionLoading: false,
      filterPermissionText: "",
    };
  },
  watch: {
    filterPermissionText(val) {
      this.$refs.tree.filter(val);
    },
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.display_name.indexOf(value) !== -1;
    },
    handleAddUserPermission() {
      this.permissionLoading = true;
      var checkedKeys = this.$refs.tree.getCheckedKeys();
      var halfCheckedKeys = this.$refs.tree.getHalfCheckedKeys();

      var checkedPermission = checkedKeys.concat(halfCheckedKeys);

      var postData = {
        userId: this.permissionData.user_id,
        permissionsAllow: checkedPermission,
      };
      giveUserPermission({ postData: postData }).then((response) => {
        this.permissionData.permissonDialogVisible = false;
        this.permissionLoading = false;
      });
    },
    getPermission(user_id) {
      this.checkStrictly = true;
      getPermission({ type: "tree" }).then((response) => {
        var list = response.data.list;
        this.permissionData.list = list;
      });

      getPermission({ user_id: user_id }).then((response) => {
        var list = response.data.list;
        this.$nextTick(() => {
          this.permissionData.defaultCheckedList = list;
        });
      });
      this.permissionData.user_id = user_id;
    },
  },
};
</script>
<style>
</style>
