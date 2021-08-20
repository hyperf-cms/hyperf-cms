<template>
  <el-card class="form-container" shadow="never" style="width: 900px">
    <el-form :model="upUser" :rules="rules" ref="upUserForm" label-width="150px">
      <el-form-item label="Up主链接信息：">
        <div class="dataItem" v-for="(item, index) in upUser.up_user_info" :key="index">
          <el-input v-model="item.up_user_url" placeholder="请填写链接信息"></el-input>
          <el-select v-model="item.timed_status" placeholder="请选择是否开启定时统计">
            <el-option
              v-for="item in timedStatusOptions"
              :key="item.dict_value"
              :label="item.dict_label"
              :value="item.dict_value"
            ></el-option>
          </el-select>
          <el-button type="text" @click="handleDeleteDataItem(index)">删除</el-button>
        </div>
        <el-button @click="handleAddDataItem()" size="small">添加</el-button>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit('upUserForm')">提交</el-button>
        <el-button @click="resetForm('upUserForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script>
import { upUserAdd } from '@/api/laboratory/bilibili_module/upUser'
const defaultUpUser = {
  up_user_info: [
    {
      up_user_url: '',
      timed_status: 1,
    },
  ],
}
export default {
  name: 'FileMaterialDetail',
  data() {
    return {
      upUser: Object.assign({}, defaultUpUser),
      timedStatusOptions: [],
    }
  },
  created() {
    this.getDicts('lab_up_user_time_status').then((response) => {
      if (response.code == 200) {
        this.timedStatusOptions = response.data.list
      }
    })
  },
  methods: {
    onSubmit(upUserForm) {
      this.$refs[upUserForm].validate((valid) => {
        if (valid) {
          this.$confirm('是否提交数据', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }).then(() => {
            upUserAdd(this.upUser).then((response) => {
              this.resetForm(upUserForm)
            })
          })
        } else {
          this.$message({
            message: '验证失败',
            type: 'error',
            duration: 1000,
          })
          return false
        }
      })
    },
    resetForm(upUserForm) {
      this.upUser.up_user_info = [
        {
          up_user_url: '',
          timed_status: 1,
        },
      ]
    },
    handleDeleteDataItem(index) {
      this.upUser.up_user_info.splice(index, 1)
    },
    handleAddDataItem() {
      if (this.upUser.up_user_info.length >= 50) {
        this.msgError('最多一次性添加50条链接')
      }
      this.upUser.up_user_info.push({
        up_user_url: '',
        timed_status: 1,
      })
    },
  },
}
</script>
<style>
.dataItem {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.dataItem >>> .el-input {
  width: 45%;
}
</style>
