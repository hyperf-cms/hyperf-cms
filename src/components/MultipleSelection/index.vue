<template>
  <el-dialog
    :title="data.title"
    :visible.sync="data.visible"
    width="50%"
    :close-on-click-modal="false"
    class="field-dialog"
    @close="closeDialog"
  >
    <div class="filter-container">
      <div class="all-fields">
        <div
          class="box-head"
          style="display: flex;justify-content: space-between;align-items: center;"
        >
          <span>全部</span>
          <el-button type="danger" size="mini" @click="clearSelection">清空选择</el-button>
        </div>
        <div v-for="(group, index) in data.data" :key="index" style="margin-bottom: 25px;">
          <el-checkbox
            :label="group.display_name"
            :indeterminate="group.indeterminate"
            v-model="group.checkAll"
            @change="handleCheckAllChange($event, group)"
            class="checkAll"
          ></el-checkbox>
          <el-checkbox-group
            :value="group"
            v-model="checkedKeys"
            @change="handleCheckedFieldChange(group)"
            style="padding: 0 20px;"
          >
            <el-checkbox
              v-for="(value, vIndex) in group.children"
              :key="vIndex"
              :label="value.id"
              class="checkItem"
            >{{value.display_name}}</el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
      <el-button style="margin-top: 10px;float: right;" @click="closeDialog">取消</el-button>
      <el-button
        type="primary"
        style="margin: 10px 10px 0 0;float: right;"
        @click="handleConfirm"
      >确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { setStore, getStore, removeStore } from '@/utils/store'
import Sortable from 'sortablejs'

export default {
  name: 'MultipleSelection',
  props: {
    data: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      defaultProps: {
        children: 'children',
        label: 'display_name',
      },
      checkedKeys: [],
      selectedFields: {},
      selectedFieldsKeysOrder: [],
      returnFields: [],
      addArr: [],
      removeArr: [],
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initMove()
    })
  },
  watch: {
    checkedKeys: function (newVal, oldVal) {
      this.addArr = this.addedFieldId(oldVal, newVal)
      this.removeArr = this.removedFieldId(oldVal, newVal)
    },
  },
  created() {
    // 获取已选节点的id
    let len = this.checkedFields.length
    let fieldLen = 0
    let childLen = 0
    for (let i = 0; i < this.fields.length; i++) {
      this.fields[i].initCheckedNum = 0
      this.fields[i].checkAll = false
      this.fields[i].indeterminate = false
    }
    this.checkedFields.forEach((checked) => {
      fieldLen = this.fields.length
      fieldLoop: for (let i = 0; i < fieldLen; i++) {
        childLen = this.fields[i].children.length
        for (let j = 0; j < childLen; j++) {
          if (this.fields[i].children[j].name == checked) {
            this.fields[i].initCheckedNum += 1
            this.checkedKeys.push(this.fields[i].children[j].id)

            // 以父ID作为一个模块，不同模块的指标单独排序，不能混合在一起排序
            if (
              this.selectedFields[this.fields[i].children[j].pid] == undefined
            ) {
              this.selectedFields[this.fields[i].children[j].pid] = []
              this.selectedFieldsKeysOrder.push(this.fields[i].children[j].pid)
            }
            this.selectedFields[this.fields[i].children[j].pid].push(
              this.fields[i].children[j]
            )

            this.fields[i].indeterminate = true
            break
          }
        }
      }
    })

    // 判断是否全选状态
    for (let i = 0; i < this.fields.length; i++) {
      if (
        this.fields[i].initCheckedNum > 0 &&
        this.fields[i].initCheckedNum == this.fields[i].children.length
      ) {
        this.fields[i].checkAll = true
        this.fields[i].indeterminate = false
      }
    }

    // 更新返回数据
    this.updateReturnData()
  },
  methods: {
    updateReturnData() {
      let temp = []
      this.selectedFieldsKeysOrder.forEach((id) => {
        this.selectedFields[id].forEach((field) => {
          temp.push(field)
        })
      })

      this.returnFields = JSON.parse(JSON.stringify(temp))
    },
    addedFieldId(oldArr, newArr) {
      // 找出新增的id
      return newArr.filter((val) => {
        return oldArr.indexOf(val) === -1
      })
    },
    removedFieldId(oldArr, newArr) {
      // 找出删除的id
      return oldArr.filter((val) => {
        return newArr.indexOf(val) === -1
      })
    },
    handleCheckAllChange($event, group) {
      let len = group.children.length
      if ($event == true) {
        for (let i = 0; i < len; i++) {
          if (this.checkedKeys.indexOf(group.children[i].id) > -1) continue

          this.checkedKeys.push(group.children[i].id)

          if (this.selectedFields[group.id] == undefined) {
            this.selectedFields[group.id] = []
            this.selectedFieldsKeysOrder.push(group.id)
          }
          this.selectedFields[group.id].push(group.children[i])
        }
        group.indeterminate = false
      } else {
        let pos = -1
        for (let i = 0; i < len; i++) {
          pos = this.checkedKeys.indexOf(group.children[i].id)

          if (pos < 0) continue

          this.checkedKeys.splice(pos, 1)
        }

        let orderPos = this.selectedFieldsKeysOrder.indexOf(group.id)
        this.selectedFieldsKeysOrder.splice(orderPos, 1)
        delete this.selectedFields[group.id]
      }

      this.$nextTick(() => {
        this.initMove()
      })

      // 更新返回数据
      this.updateReturnData()
    },
    handleCheckedFieldChange(group) {
      if (this.addArr.length > 0) {
        // 增加字段的情况
        group.children.forEach((child) => {
          if (this.addArr.indexOf(child.id) > -1) {
            if (this.selectedFields[child.pid] == undefined) {
              this.selectedFields[child.pid] = []
              this.selectedFieldsKeysOrder.push(child.pid)
            }
            this.selectedFields[child.pid].push(child)
          }
        })

        if (group.children.length == this.selectedFields[group.id].length) {
          group.checkAll = true
          group.indeterminate = false
        } else {
          group.indeterminate = true
        }

        this.addArr = []
      }

      if (this.removeArr.length > 0) {
        // 删除字段的情况
        for (let i in this.selectedFields) {
          for (let k = 0; k < this.selectedFields[i].length; ) {
            if (this.removeArr.indexOf(this.selectedFields[i][k].id) > -1) {
              this.selectedFields[i].splice(k, 1)
              // 调整顺序，删除没有子指标的父指标
              if (this.selectedFields[i].length == 0) {
                let pos = this.selectedFieldsKeysOrder.indexOf(Number(i))
                if (pos > -1) {
                  this.selectedFieldsKeysOrder.splice(pos, 1)
                }
                delete this.selectedFields[i]
                break
              }
            } else {
              k++
            }
          }
        }

        group.checkAll = false
        if (this.selectedFields[group.id] == undefined) {
          group.indeterminate = false
        } else {
          group.indeterminate = true
        }

        this.removeArr = []
      }

      this.$forceUpdate()

      this.$nextTick(() => {
        this.initMove()
      })

      // 更新返回数据
      this.updateReturnData()
    },
    deleteSelected(data, index) {
      let pos = this.checkedKeys.indexOf(data.id)
      if (pos > -1) {
        this.checkedKeys.splice(pos, 1)
      }
      this.selectedFields[data.pid].splice(index, 1)
      if (this.selectedFields[data.pid].length == 0) {
        // 调整顺序，删除没有子指标的父指标
        let pos = this.selectedFieldsKeysOrder.indexOf(Number(data.pid))
        if (pos > -1) {
          this.selectedFieldsKeysOrder.splice(pos, 1)
        }
        delete this.selectedFields[data.pid]
      }

      // 检查指标选择框状态
      let len = this.fields.length
      fieldLoop: for (let i = 0; i < len; i++) {
        let childLen = this.fields[i].children.length
        for (let j = 0; j < childLen; j++) {
          if (this.checkedKeys.indexOf(this.fields[i].children[j].id) > -1)
            continue fieldLoop
        }

        // 如果当前父指标中没有选择子指标，则清除选择框状态
        this.fields[i].indeterminate = false
      }

      // 更新返回数据
      this.updateReturnData()
    },
    handleConfirm() {
      this.$emit('changeField', this.returnFields)
    },
    closeDialog() {
      this.$emit('update:visible', false)
    },
    clearSelection() {
      this.checkedKeys = []
      this.selectedFields = {}
      this.selectedFieldsKeysOrder = []
      this.fields.forEach((group) => {
        group.indeterminate = false
        group.checkAll = false
      })

      // 更新返回数据
      this.updateReturnData()
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
  margin-right: 2%;
  width: 69%;
}

.selected-fields {
  width: 29%;
}

.checkAll {
  display: block;
  margin-bottom: 20px;
  padding: 10px 20px;
  background-color: #f7f9fc;
}

.all-fields ::v-deep .el-checkbox__label {
  font-size: 16px;
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
  width: 33.333333%;
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
