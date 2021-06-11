<template>
  <el-dialog
    :title="groupTool.contact.displayName"
    :visible.sync="groupTool.groupMemberManageDialogVisible"
    width="30%"
    append-to-body
  >
    <div class="filter-container">
      <el-input
        prefix-icon="el-icon-search"
        style="margin-bottom:10px; width:50%"
        size="small"
        placeholder="输入关键字进行过滤"
        v-model="listQuery.desc"
      ></el-input>
    </div>
    <div>
      <el-table style="width: 100%" size="medium" :data="list" height="500">
        <el-table-column label="用户昵称" width="200">
          <template slot-scope="scope">
            <img
              :src="scope.row.avatar"
              alt
              style="width:40px;height:40px;border-radius:10px;margin-right:5px;vertical-align: middle;"
            />
            <span style="font-size: 16px;">{{ scope.row.desc}}</span>
          </template>
        </el-table-column>
        <el-table-column property="file_size" label="进群时间" width="180">
          <template slot-scope="scope">{{ scope.row.created_at }}</template>
        </el-table-column>
        <el-table-column align="center" label="身份" width="80">
          <template slot-scope="scope">
            <span>
              <span v-if="scope.row.level == 0">
                <svg-icon icon-class="lord" style="width:1.8em;height:1.8em;"></svg-icon>
              </span>
              <span v-if="scope.row.level == 1" style="cursor: pointer;">
                <svg-icon
                  icon-class="manager"
                  style="width:1.8em;height:1.8em;"
                  @click="handleChangeLevel(scope.$index, scope.row)"
                ></svg-icon>
              </span>
              <span
                v-if="scope.row.level == 2"
                style="cursor: pointer;"
                @click="handleChangeLevel(scope.$index, scope.row)"
              >
                <svg-icon icon-class="group_manager_add" style="width:1.8em;height:1.8em;"></svg-icon>
              </span>
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.uid != groupTool.user.id && scope.row.uid != groupTool.contact.uid"
              type="danger"
              size="mini"
              icon="el-icon-delete"
              @click="handleDeleteGroupMember(scope.$index, scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div slot="footer" class="dialog-footer" style="height:50px">
      <Pagination
        v-show="total>0"
        :total="total"
        :page.sync="listQuery.cur_page"
        :limit.sync="listQuery.page_size"
        @pagination="getList"
      ></Pagination>
    </div>
  </el-dialog>
</template>
<script>
import { groupMemberManage } from '@/api/laboratory/chat_module/group'
const defaultListQuery = {
  desc: '',
}
export default {
  name: 'GroupMemberManage',
  props: {
    groupTool: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      list: [],
      total: 0,
    }
  },
  mounted() {},
  watch: {
    'listQuery.desc'(val) {
      this.getList()
    },
  },
  created() {},
  methods: {
    init() {
      this.getList()
    },
    getList() {
      this.listQuery.contact_id = this.groupTool.contact.id
      groupMemberManage(this.listQuery).then((response) => {
        this.list = response.data.list
        this.total = response.data.total
      })
    },
    handleDeleteGroupMember(index, row) {
      this.$confirm('是否要将该用用户从群聊T出, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.$parent.$parent.$parent.sendDeleteGroupMember(row)
          this.list.splice(index, 1)
        })
        .catch(() => {})
    },
    handleChangeLevel(index, row) {
      let confirmMessage = ''
      if (row.level == 1)
        confirmMessage = '是否要撤回该用户管理员权限, 是否继续?'
      if (row.level == 2) confirmMessage = '是否要将该用户设为管理员, 是否继续?'
      this.$confirm(confirmMessage, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.$parent.$parent.$parent.sendChangeGroupLevel(row)
          this.list[index].level = row.level == 1 ? 2 : 1
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
  float: left;
  padding: 5px 10px;
  height: 500px;
  border: 1px solid #ddd;
  overflow-y: scroll;
}

.all-fields {
  width: 48%;
  margin-right: 2%;
}

.selected-fields {
  width: 48%;
}

.checkAll {
  display: block;
  margin-bottom: 20px;
  padding: 10px 20px;
  background-color: #f7f9fc;
}
.avatar {
  width: 30px;
  height: 30px;
  vertical-align: middle;
  margin-right: 5px;
  border-radius: 5px;
}
.all-fields ::v-deep .el-checkbox__label {
  font-size: 16px;
}
.all-fields ::v-deep .el-checkbox__input {
  float: right;
}
.all-fields ::v-deep .el-checkbox__inner {
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
.checkAll ::v-deep .el-checkbox__label {
  font-weight: bold;
}

.checkItem {
  margin: 0 0 10px 0;
  width: 100%;
}
.checkItem:hover ::v-deep .el-checkbox__inner {
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
  padding: 5px 10px;
  border-radius: 10px;
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
