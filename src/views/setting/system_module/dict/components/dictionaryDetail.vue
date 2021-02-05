<template>
  <el-dialog
    title="编辑用户权限"
    :visible.sync="permissionDetailData.visible"
    width="35%"
    :close-on-click-modal="false"
    class="field-dialog"
  >
    <div class="filter-container">
      <el-input style="margin-bottom:10px" placeholder="输入关键字进行过滤" v-model="filterText"></el-input>
      <div class="selected-fields">
        <div class="selected-box" ref="selectedBox">
          <div class="selected-group">
            <el-tree
              :data="permissionList"
              :props="defaultProps"
              show-checkbox
              node-key="name"
              ref="tree"
              :default-expand-all="true"
              indent="40"
              :filter-node-method="filterNode"
              :check-strictly="checkStrictly"
            ></el-tree>
          </div>
        </div>
      </div>
      <el-button
        style="margin-top: 10px;float: right;"
        @click="permissionDetailData.visible = false"
      >取消</el-button>
      <el-button
        type="primary"
        style="margin: 10px 10px 0 0;float: right;"
        @click="handleConfirm"
      >确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {
  accordUserPermission,
  getPermissionTreeByUser,
} from '@/api/setting/user_module/permission'
export default {
  name: 'DictionaryDetail',
  props: {
    permissionDetailData: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      //tree节点配置
      defaultProps: {
        children: 'child',
        label: 'display_name',
      },
      //过滤权限字段
      filterText: '',
      //tree组件是否父子级关联
      checkStrictly: false,
      //权限列表
      permissionList: [],
      //用户拥有权限列表
      userHasPermissionList: [],
    }
  },
  mounted() {},
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    },
  },
  created() {},
  methods: {
    init() {
      getPermissionTreeByUser({
        user_id: this.permissionDetailData.userId,
      }).then((response) => {
        this.permissionList = response.data.permission_list

        this.checkStrictly = true //重点：给数节点赋值之前 先设置为true
        this.$nextTick(() => {
          this.$refs.tree.setCheckedKeys(response.data.user_has_permission)
          this.checkStrictly = false //重点：给数节点赋值之前 先设置为true
        })
      })
    },
    filterNode(value, data) {
      if (!value) return true
      return data.display_name.indexOf(value) !== -1
    },
    handleConfirm() {
      this.$confirm('确认提交修改用户权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          var checkedKeys = this.$refs.tree.getCheckedKeys()
          var halfCheckedKeys = this.$refs.tree.getHalfCheckedKeys()
          var checkedPermission = checkedKeys.concat(halfCheckedKeys)
          var postData = {
            user_id: this.permissionDetailData.userId,
            user_has_permission: checkedPermission,
          }
          accordUserPermission(postData).then((response) => {
            this.permissionDetailData.visible = false
          })
        })
        .catch(() => {})
    },
  },
}
</script>


<style lang="scss" scoped>
.filter-container::after {
  content: '';
  display: block;
  clear: both;
}

.box-head {
  margin-bottom: 15px;
  padding: 10px 0;
  font-size: 16px;
  font-weight: bold;
  border-bottom: 1px solid #ddd;
}

.all-fields,
.selected-fields {
  padding: 5px 10px;
  border: 1px solid #ddd;
  overflow-y: scroll;
  height: 500px;
}

.all-fields {
  margin-right: 2%;
  //width: 69%;
}

.checkAll {
  display: block;
  margin-bottom: 20px;
  padding: 10px 20px;
  background-color: #f7f9fc;
}

.all-fields >>> .el-checkbox__label {
  font-size: 16px;
}
.all-fields >>> .el-checkbox__inner {
  width: 16px;
  height: 16px;
  &::before {
    top: 6px;
  }
  &::after {
    top: 2px;
    left: 5px;
  }
}
.checkAll >>> .el-checkbox__label {
  font-weight: bold;
}

.checkItem {
  margin: 0 0 10px 0;
  width: 33.333333%;
}
.checkItem:hover >>> .el-checkbox__inner {
  border-color: #409eff;
}

.selected-group {
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid #ddd;
  &:last-child {
    border-bottom: none;
  }
}

.selected-item {
  position: relative;
  margin-bottom: 10px;
  padding: 10px 20px;
  background-color: #f8f8f8;
  border-radius: 10px;
  cursor: move;
  &--active {
    background-color: #ddd;
  }
  &:last-child {
    margin-bottom: 0;
  }

  .cancelItemBtn {
    position: absolute;
    top: 50%;
    right: 20px;
    margin-top: -8px;
    width: 16px;
    height: 16px;
    cursor: pointer;

    &::before,
    &::after {
      content: '';
      display: block;
      position: absolute;
      top: 50%;
      margin-top: -1px;
      width: 100%;
      height: 2px;
      background-color: #9f9f9f;
      transition: all 0.3s;
    }
    &::before {
      transform: rotate(45deg);
    }
    &::after {
      transform: rotate(-45deg);
    }

    &:hover {
      &::before,
      &::after {
        background-color: #f00;
      }
    }
  }
}
</style>
